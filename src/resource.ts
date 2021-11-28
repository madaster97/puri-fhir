import { Codec, exactly, intersect, string } from 'purify-ts/Codec'

export type TypedResource<ResourceType extends string> = {
    resourceType: ResourceType
}

export type ResourceWithId<ResourceType extends string> = TypedResource<ResourceType> & {
    id: string
}

export const MapResourceToId = <T extends string, Resource extends ResourceWithId<T>>(resource: Resource): string => {
    return resource.id;
}

export const GetResourceWithoutId = <ResourceData, ResourceType extends string>(ResourceData: Codec<ResourceData>, ResourceType: ResourceType): Codec<ResourceData & TypedResource<ResourceType>> => {
    return intersect(ResourceData, Codec.interface({
        resourceType: exactly(ResourceType)
    }));
}

export const GetResourceWithId = <ResourceData, ResourceType extends string>(ResourceData: Codec<ResourceData>, ResourceType: ResourceType): Codec<ResourceData & ResourceWithId<ResourceType>> => {
    return intersect(ResourceData, Codec.interface({
        id: string,
        resourceType: exactly(ResourceType)
    }));
}

export type ResourcePredicate<T extends string, Resource extends ResourceWithId<T>> = (resource: Resource) => boolean;