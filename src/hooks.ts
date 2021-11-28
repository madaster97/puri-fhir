import { Codec, string, maybe, exactly, intersect, array, optional, unknown } from 'purify-ts/Codec';
import { GetReferenceValue } from './referenceValue';
import { DraftOrderBundle, DraftOrderReferenceValue } from './draftOrders'

const PatientViewContext = Codec.interface({
    userId: GetReferenceValue('Practitioner', 'PractitionerRole'),
    patientId: GetReferenceValue('Patient'),
    encounterId: maybe(GetReferenceValue('Encounter'))
});
const OrderSignContext = Codec.interface({
    userId: GetReferenceValue('Practitioner', 'PractitionerRole'),
    patientId: GetReferenceValue('Patient'),
    encounterId: maybe(GetReferenceValue('Encounter')),
    draftOrders: DraftOrderBundle
});
const OrderSelectContext = Codec.interface({
    userId: GetReferenceValue('Practitioner', 'PractitionerRole'),
    patientId: GetReferenceValue('Patient'),
    encounterId: maybe(GetReferenceValue('Encounter')),
    draftOrders: DraftOrderBundle,
    selections: array(DraftOrderReferenceValue)
});

function ConstructNoPrefetchHook<Context>(HookName: string, HookContext: Codec<Context>) {
    return Codec.interface({
        hook: exactly(HookName),
        context: HookContext,
        hookInstance: string
    })
}

function ConstructHook<Context, Prefetch>(HookName: string, HookContext: Codec<Context>, Prefetch: Codec<Prefetch>) {
    return Codec.interface({
        hook: exactly(HookName),
        context: HookContext,
        prefetch: Prefetch,
        hookInstance: string
    })
}

export function GetPatientViewHook<Prefetch>(PrefetchCodec: Codec<Prefetch>) {
    return ConstructHook('patient-view', PatientViewContext, PrefetchCodec);
}

export function GetOrderSignHook<Prefetch>(PrefetchCodec: Codec<Prefetch>) {
    return ConstructHook('order-sign', OrderSignContext, PrefetchCodec);
}

export function GetOrderSelectHook<Prefetch>(PrefetchCodec: Codec<Prefetch>) {
    return ConstructHook('order-select', OrderSelectContext, PrefetchCodec);
}
export function GetPatientViewHookNoPrefetch() {
    return ConstructNoPrefetchHook('patient-view', PatientViewContext);
}

export function GetOrderSignHookNoPrefetch() {
    return ConstructNoPrefetchHook('order-sign', OrderSignContext);
}

export function GetOrderSelectHookNoPrefetch() {
    return ConstructNoPrefetchHook('order-select', OrderSelectContext);
}