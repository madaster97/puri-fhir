import { Codec, GetType } from "purify-ts/Codec";
import { CodeableConcept, HasCodeable } from '../src/codeable';
import { GetResourceWithId, ResourcePredicate } from '../src/resource';
import { GetBundle, FindFirstMatchedResource, FilterMatchResources } from '../src/bundle';
import { DraftOrderBundle, ServiceRequest } from '../src/draftOrders';
import encounterDxs from './fixture/encounterDxs';
import draftOrders from './fixture/draftOrders';
import getRequest from './fixture/hooks';
import { Just, Maybe, Nothing } from "purify-ts/Maybe";
import { GetOrderSignHookNoPrefetch } from "../src/hooks";

// Searching bundles
const IncomingConditionResourceData = Codec.interface({
    code: CodeableConcept
});
const ConditionResourceType = 'Condition';
const ConditionResource = GetResourceWithId(IncomingConditionResourceData, ConditionResourceType);
type ConditionResource = GetType<typeof ConditionResource>;
const ConditionResourceBundle = GetBundle(ConditionResource);
const ConditionHasDx = (system: string) => (code: string): ResourcePredicate<'Condition', ConditionResource> => (condition: ConditionResource): boolean => {
    return HasCodeable(system, code)(condition.code);
}
test('Can search for a single resource', () => {
    const result = ConditionResourceBundle.decode(encounterDxs);
    result.caseOf({
        Left: e => expect(e).toBe(undefined),
        Right: bundle => {
            const found =
                FindFirstMatchedResource(bundle,ConditionHasDx("urn:oid:2.16.840.1.113883.6.90")("I10"));
            found.caseOf({
                Nothing: () => expect(false).toBe(true),
                Just: cond => expect(cond.id).toBe("eh8OUeGWAtnDo9VfNzyrFhpwHBMt-nFRfWjVKf7XAvrsxTmlxCLD70YGLpTlCxy57U0Qa9vSajV0-U6Bb7RBqqA3")
            });
        }
    })
});

// Filtering bundles
test('Can filter by resource type', () => {
    const result = DraftOrderBundle.decode(draftOrders);
    result.caseOf({
        Left: e => expect(e).toBe(undefined),
        Right: bundle => {
            const found = FilterMatchResources(bundle, (order): Maybe<ServiceRequest> => {
                switch (order.resourceType) {
                    case 'ServiceRequest':
                        return Just(order);
                    default:
                        return Nothing;
                }
            });
            expect(found).toHaveLength(1)
            expect(found[0].resourceType).toEqual('ServiceRequest')
            expect(found[0].id).toBe('123')
        }
    })
})

// Check type propogates through hook context
test('Draft orders bundle propogates to context', () => {
    const OrderSign = GetOrderSignHookNoPrefetch();
    const request = getRequest('order-sign');
    const result = OrderSign.decode(request);
    result.caseOf({
        Left: e => expect(e).toBe(undefined),
        Right: hook => {
            const {draftOrders} = hook.context;
            const found = FilterMatchResources(draftOrders, (order): Maybe<ServiceRequest> => {
                switch (order.resourceType) {
                    case 'ServiceRequest':
                        return Just(order);
                    default:
                        return Nothing;
                }
            });
            expect(found).toHaveLength(1)
            expect(found[0].resourceType).toBe('ServiceRequest')
            expect(found[0].id).toBe('123')
        }
    })
});