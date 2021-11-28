import { Codec, string, maybe, exactly, oneOf, array, GetType, boolean } from 'purify-ts/Codec';
import { Just, Maybe } from 'purify-ts/Maybe';
import { ReferenceValue, GetReferenceValue } from './referenceValue';
import { Coding } from './codeable';
import { TypedResource } from './resource';

const SentenceString = string;
const ShortString = string;
const Markdown = string;
const UrlString = string;
const Link = Codec.interface({
    label: ShortString,
    url: UrlString,
    type: oneOf([exactly('absolute'), exactly('smart')]),
    appContext: maybe(string)
});
const Source = Codec.interface({
    label: ShortString,
    url: maybe(UrlString),
    icon: maybe(UrlString)
});

// Action
type ResourceAction<RT extends string, Resource extends TypedResource<RT>> = {
    type: 'create',
    description: string,
    resource: Resource
};
type DeleteAction<DT extends string> = {
    type: 'delete',
    description: string,
    resourceId: ReferenceValue<DT>
};
type Action<RT extends string, DT extends string, Resource extends TypedResource<RT>> =
    | ResourceAction<RT, Resource>
    | DeleteAction<DT>;

const GetAction = <RT extends string, DTS extends (string)[], Resource extends TypedResource<RT>>
    (Resource: Codec<Resource>, ...deleteTypes: DTS): Codec<Action<RT, DTS[number], Resource>> => {
    const resourceId = GetReferenceValue(...deleteTypes);
    const createAction = Codec.interface({
        type: exactly('create'),
        description: SentenceString,
        resource: Resource
    });
    const deleteAction = Codec.interface({
        type: exactly('delete'),
        description: SentenceString,
        resourceId
    });
    return oneOf([createAction, deleteAction]);
}

type Source = GetType<typeof Source>;
export type Link = GetType<typeof Link>;

// Suggestions
type Suggestion<RT extends string, DT extends string, Resource extends TypedResource<RT>> = {
    label: string,
    uuid: Maybe<string>,
    isRecommended: Maybe<boolean>,
    actions: Action<RT, DT, Resource>[]
}

const GetSuggestion = <RT extends string, DT extends string, Resource extends TypedResource<RT>>(Action: Codec<Action<RT, DT, Resource>>): Codec<Suggestion<RT, DT, Resource>> => {
    return Codec.interface({
        label: ShortString,
        uuid: maybe(string),
        isRecommended: maybe(boolean),
        actions: array(Action)
    });
};

// Cards
export type Indicator = 'info' | 'warning' | 'critical';
type Card<RT extends string, DT extends string, Resource extends TypedResource<RT>> = {
    summary: string,
    detail: Maybe<string>,
    indicator: Indicator,
    source: GetType<typeof Source>,
    selectionBehavior: 'any',
    links: Maybe<GetType<typeof Link>[]>,
    suggestions: Suggestion<RT, DT, Resource>[],
    overrideReasons: Maybe<Coding[]>
}

const GetCard = <RT extends string, DT extends string, Resource extends TypedResource<RT>>(Suggestion: Codec<Suggestion<RT, DT, Resource>>): Codec<Card<RT, DT, Resource>> => {
    return Codec.interface({
        summary: SentenceString,
        detail: maybe(Markdown),
        indicator: exactly(
            'info',
            'warning',
            'critical'),
        source: Source,
        selectionBehavior: exactly('any'),
        links: maybe(array(Link)),
        suggestions: array(Suggestion),
        overrideReasons: maybe(array(Coding))
    });
}

export const GetResponseCodecs = <RT extends string, DTS extends string[], Resource extends TypedResource<RT>>
    (Resource: Codec<Resource>, ...deleteTypes: DTS) => {
    const Action = GetAction(Resource, ...deleteTypes);
    const Suggestion = GetSuggestion(Action);
    const Card = GetCard(Suggestion);
    return {
        Action,
        Suggestion,
        Card
    }
}

export const CreateCard = <RT extends string, DT extends string, Resource extends TypedResource<RT>>(source: Source, links: Maybe<Link[]>, indicator: Indicator, summary: string, detail: Maybe<string>, suggestions: Suggestion<RT, DT, Resource>[], overrideReasons: Maybe<Coding[]>): Card<RT, DT, Resource> => {
    return {
        detail,
        indicator,
        links,
        selectionBehavior: 'any',
        source,
        suggestions,
        summary,
        overrideReasons
    }
}

export const CreateSuggestion = <RT extends string, DT extends string, Resource extends TypedResource<RT>>(action: Maybe<Action<RT, DT, Resource>>, isRecommended: boolean, uuid: string, label: string): Suggestion<RT, DT, Resource> => {
    return {
        label,
        // Enforces single-action suggestions
        actions: action.toList(),
        isRecommended: Just(isRecommended),
        uuid: Just(uuid)
    }
}

export const CreateAction = <DT extends string, RT extends string, Resource extends TypedResource<RT>>(description: string, resource: Resource): Action<RT,'Unknown', Resource> => {
    return {
        description,
        resource,
        type: 'create'
    }
}

export const DeleteAction = <DT extends string>(description: string, resourceId: ReferenceValue<DT>): Action<'Unknown',DT, {resourceType: 'Unknown'}> => {
    return {
        description,
        resourceId,
        type: 'delete'
    }
}