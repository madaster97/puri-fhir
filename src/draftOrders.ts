import { GetResourceWithId } from './resource';
import { GetReference } from './reference';
import { GetReferenceValue } from './referenceValue';
import { CodeableConcept } from './codeable'
import { Codec, exactly, GetType, intersect, oneOf, optional } from 'purify-ts/Codec';
import { GetBundle } from './bundle';

// Core Data Structure;
const GetDraftOrder = <T extends string>(resourceType: T) => GetResourceWithId(Codec.interface({
    status: exactly('draft')
}),resourceType);
const MedicationRequest = intersect(GetDraftOrder('MedicationRequest'), Codec.interface({
    medicationReference: GetReference('Medication')
}));
export type MedicationRequest = GetType<typeof MedicationRequest>;
const ServiceRequest = intersect(GetDraftOrder('ServiceRequest'), Codec.interface({
    code: optional(CodeableConcept)
}));
export type ServiceRequest = GetType<typeof ServiceRequest>;

const DraftOrder = oneOf([
    MedicationRequest,
    ServiceRequest,
    GetDraftOrder('DeviceRequest'),
    GetDraftOrder('NutritionOrder'),
    GetDraftOrder('VisionPrescription')
]);

// export const DraftOrderBundle = GetBundle(DraftOrder, GetResourceWithId(Codec.interface({}), 'Unknown'));
export const DraftOrderBundle = GetBundle(DraftOrder);
export const DraftOrderReferenceValue = oneOf([
    GetReferenceValue('DeviceRequest'),
    GetReferenceValue('MedicationRequest'),
    GetReferenceValue('NutritionOrder'),
    GetReferenceValue('ServiceRequest'),
    GetReferenceValue('VisionPrescription')
]);