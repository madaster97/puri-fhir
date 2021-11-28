import { Codec, string, exactly } from "purify-ts/Codec";
import { Left } from "purify-ts/Either";

export type ReferenceValue<ResourceType extends string> = {
    resourceType: ResourceType,
    id: string
}

export const GetReferenceValue = <T extends (string)[]>(...resourceTypes: T): Codec<ReferenceValue<T[number]>> => {
    const ResourceType = exactly(...resourceTypes);
    return Codec.custom<ReferenceValue<T[number]>>({
        decode: input => {
          return string.decode(input)
            .chain(reference => {
              const splitRef = reference.split('/').reverse();
              const [id,type] = splitRef;
              return !type || !id
                ? Left(`Reference ${reference} could not be split`)
                : ResourceType.decode(type)
                  .map(resourceType => { return { id, resourceType }})
            })
        },
        encode: ({ id, resourceType }) => {
          return string.encode(`${resourceType}/${id}`)
        }
      });
}