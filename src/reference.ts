import { Codec, string, maybe } from "purify-ts/Codec";
import { Maybe, Nothing } from "purify-ts/Maybe";
import { ResourceWithId } from './resource';
import { GetReferenceValue, ReferenceValue } from './referenceValue';

export type Reference<ResourceType extends string> = {
  reference: ReferenceValue<ResourceType>,
  display: Maybe<string>
}

export const GetReference = <T extends (string)[]>(...resourceTypes: T): Codec<Reference<T[number]>> => {
  const ReferenceValue = GetReferenceValue(...resourceTypes);
  return Codec.interface({
    reference: ReferenceValue,
    display: maybe(string)
  });
};

export const ConstructReferenceToResource = <ResourceType extends string>(
  target: ResourceWithId<ResourceType>
): Reference<ResourceType> => {
  const { id, resourceType } = target;
  return {
    reference: {
      id,
      resourceType
    },
    display: Nothing
  };
};

export type ReferenceChooser<SourceType extends string, TargetType extends string> = (source: ResourceWithId<SourceType>) => Reference<TargetType>[];

// const ResourceMatchesReference =
//   <Target extends ResourceWithId>(reference: Reference) =>
//     (target: Target): boolean => {
//       return (
//         reference.reference == ConstructReferenceToResource(target).reference
//       );
//     };

// const ReferenceMatchesResource =
//   <Target extends ResourceWithId>(target: Target) =>
//   (reference: Reference): boolean => {
//     return ResourceMatchesReference(reference)(target);
//   };

// export const SourceReferencesTarget =
//   <Source extends ResourceWithId, Target extends ResourceWithId>(
//     chooser: ReferenceChooser<Source>
//   ) =>
//     (target: Target) =>
//       (source: Source): boolean => {
//         return ResourceMatchesReference(chooser(source))(target);
//       };

// export const TargetReferencedBySource =
//   <Source extends ResourceWithId, Target extends ResourceWithId>(
//     chooser: ReferenceChooser<Source>
//   ) =>
//   (source: Source) =>
//   (target: Target): boolean => {
//     return ResourceMatchesReference(chooser(source))(target);
//   };