import { string, Codec } from 'purify-ts/Codec';
import { GetOrderSignHookNoPrefetch, GetPatientViewHook, GetPatientViewHookNoPrefetch } from '../src/hooks';
import getRequest from './fixture/hooks';

test('Omitting prefetch makes field optional', () => {
    const NoPrefetch = GetPatientViewHookNoPrefetch();
    const decoded = NoPrefetch.decode(getRequest('patient-view'));
    decoded.caseOf({
        Left: e => {
            expect(e).toBe(undefined)
        },
        Right: req => {
            expect(req).not.toHaveProperty('prefetch')
        }
    })
});

test('Including prefetch makes field available', () => {
    const Prefetch = GetPatientViewHook(Codec.interface({ myField: string }));
    const decoded = Prefetch.decode(getRequest('patient-view'));
    decoded.caseOf({
        Left: e => {
            expect(e).toBe(undefined)
        },
        Right: req => {
            expect(req).toHaveProperty('prefetch')
            expect(req.prefetch).toHaveProperty('myField')
        }
    })
});

test('Order Sign pulls in draftOrders', () => {
    const NoPrefetch = GetOrderSignHookNoPrefetch();
    const decoded = NoPrefetch.decode(getRequest('order-sign'));
    decoded.caseOf({
        Left: e => {
            expect(e).toBe(undefined)
        },
        Right: req => {
            expect(req.context).toHaveProperty('draftOrders')
        }
    })
});