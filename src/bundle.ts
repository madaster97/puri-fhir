import { Codec, array, exactly, number, oneOf, GetType, string } from 'purify-ts/Codec'
import { Just, Maybe, Nothing } from "purify-ts/Maybe";
import { Tuple } from 'purify-ts/Tuple';
import { GetResourceWithId, GetResourceWithoutId, ResourcePredicate, ResourceWithId } from './resource';

const OperationOutcome = GetResourceWithoutId(Codec.interface({}), 'OperationOutcome');

const OutcomeEntry = Codec.interface({ resource: OperationOutcome, search: Codec.interface({ mode: exactly('outcome') }) });
type OutcomeEntry = GetType<typeof OutcomeEntry>;

type MatchEntry<MT extends string, Resource extends ResourceWithId<MT>> = {
    resource: Resource,
    search: {
        mode: 'match'
    }
}

type IncludeEntry<IT extends string, Included extends ResourceWithId<IT>> = {
    resource: Included,
    search: {
        mode: 'include'
    }
}

type BundleEntry<MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>> = OutcomeEntry | MatchEntry<MT, Resource> | IncludeEntry<IT, Included>;

const IsMatchEntry =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (entry: BundleEntry<MT, IT, Resource, Included>): entry is MatchEntry<MT, Resource> => {
        return entry.search.mode == 'match';
    }

const IsIncludeEntry =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (entry: BundleEntry<MT, IT, Resource, Included>): entry is IncludeEntry<IT, Included> => {
        return entry.search.mode == 'include';
    }

const GetMatchEntry =
    <MT extends string, Resource extends ResourceWithId<MT>>
        (Resource: Codec<Resource>): Codec<MatchEntry<MT, Resource>> => {
        return Codec.interface({ resource: Resource, search: Codec.interface({ mode: exactly('match') }) });
    }

const GetIncludeEntry =
    <IT extends string, Included extends ResourceWithId<IT>>
        (Included: Codec<Included>): Codec<IncludeEntry<IT, Included>> => {
        return Codec.interface({ resource: Included, search: Codec.interface({ mode: exactly('include') }) });
    }

type Bundle<MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>> = {
    resourceType: 'Bundle',
    total: number,
    entry: Array<BundleEntry<MT, IT, Resource, Included> | OutcomeEntry>
}

const IncludePlaceHolder = GetResourceWithId(Codec.interface({}),'Unknown');
type IncludePlaceHolder = GetType<typeof IncludePlaceHolder>;

export function GetBundle
    <MT extends string, Resource extends ResourceWithId<MT>>
    (Resource: Codec<Resource>):
    Codec<Bundle<MT, 'Unknown', Resource, IncludePlaceHolder>> { return GetBundleWithInclude(Resource, IncludePlaceHolder) }

export function GetBundleWithInclude
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
    (Resource: Codec<Resource>, Included: Codec<Included>):
    Codec<Bundle<MT, IT, Resource, Included>> {
    const MatchEntry = GetMatchEntry(Resource);
    const IncludeEntry = GetIncludeEntry(Included);
    const Entry = oneOf([OutcomeEntry, MatchEntry, IncludeEntry]);
    return Codec.interface({
        resourceType: exactly('Bundle'),
        total: number,
        entry: array(Entry)
    });
}

// Functions for searching bundles
const Pick = <T, U>(tryMap: (t: T) => Maybe<U>) => (array: T[]): Maybe<Tuple<number, U>> => {
    for (let index = 0; index < array.length; index++) {
        const maybeU = tryMap(array[index]);
        if (maybeU.isJust()) {
            return Just(Tuple(index, maybeU.extract()))
        }
    }
    return Nothing;
}

const MapEntryToInclude =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (entry: BundleEntry<MT, IT, Resource, Included>): Maybe<IncludeEntry<IT, Included>> => {
        return IsIncludeEntry(entry) ? Just(entry) : Nothing;
    }

const MapEntryToMatch =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (entry: BundleEntry<MT, IT, Resource, Included>): Maybe<MatchEntry<MT, Resource>> => {
        return IsMatchEntry(entry) ? Just(entry) : Nothing;
    }

const SearchMatchEntries =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (entries: BundleEntry<MT, IT, Resource, Included>[], predicate: ResourcePredicate<MT, Resource>): Maybe<Tuple<number, Resource>> => {
        const MapWithPredicate =
            (entry: BundleEntry<MT, IT, Resource, Included>): Maybe<Resource> => {
                return MapEntryToMatch(entry).map(e => e.resource).filter(predicate);
            }
        return Pick(MapWithPredicate)(entries);
    }

const SearchIncludedEntries =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (entries: BundleEntry<MT, IT, Resource, Included>[], predicate: ResourcePredicate<IT, Included>): Maybe<Tuple<number, Included>> => {
        const MapWithPredicate =
            (entry: BundleEntry<MT, IT, Resource, Included>): Maybe<Included> => {
                return MapEntryToInclude(entry).map(e => e.resource).filter(predicate);
            }
        return Pick(MapWithPredicate)(entries);
    }

const ExtractTupleItem = <T>(t: Tuple<number, T>): T => t.snd();

export const FindFirstMatchedResource =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (bundle: Bundle<MT, IT, Resource, Included>, predicate: ResourcePredicate<MT, Resource>): Maybe<Resource> => {
            return bundle.total == 0 ? Nothing : SearchMatchEntries<MT, IT, Resource, Included>(bundle.entry, predicate).map(ExtractTupleItem);
        }

export const FindFirstIncludedResource =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>>
        (bundle: Bundle<MT, IT, Resource, Included>, predicate: ResourcePredicate<IT, Included>): Maybe<Included> => {
            return bundle.total == 0 ? Nothing : SearchIncludedEntries<MT, IT, Resource, Included>(bundle.entry, predicate).map(ExtractTupleItem);
        }

// Functions for filtering bundles
type Picker<T,U> = (t: T) => Maybe<U>;
export const FilterMatchResources =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>, U>
        (bundle: Bundle<MT, IT, Resource, Included>,picker: Picker<Resource, U>): U[] => {
            return Maybe.catMaybes(bundle.entry.map(entry => {
                return IsMatchEntry(entry)
                    ? Just(entry).chain(entry => picker(entry.resource))
                    : Nothing;
            }));
        }

export const FilterIncludeResources =
    <MT extends string, IT extends string, Resource extends ResourceWithId<MT>, Included extends ResourceWithId<IT>,U>
        (bundle: Bundle<MT, IT, Resource, Included>,picker: Picker<Included, U>): U[] => {
            return Maybe.catMaybes(bundle.entry.map(entry => {
                return IsIncludeEntry(entry)
                    ? Just(entry).chain(entry => picker(entry.resource))
                    : Nothing;
            }));
        }