import { GetType } from 'purify-ts/Codec';
import { Just, Nothing } from 'purify-ts/Maybe';
import { GetReference } from '../src/reference';

const FhirUserReference = GetReference('Practitioner','RelatedPerson');
type FhirUserReference = GetType<typeof FhirUserReference>;

const withoutDisplay: FhirUserReference = {
    reference: {resourceType: 'Practitioner',
    id: 'abc123'},
    display: Nothing
};

const withDisplay: FhirUserReference = {
    reference: {resourceType: 'RelatedPerson',
    id: 'def456'},
    display: Just('My Related Person')
};

test('Decodes reference without display', () => {
    const decoded = FhirUserReference.decode({
        reference: 'Practitioner/abc123'
    });
    decoded.caseOf({
        Left: e => {
            expect(e).toBe(undefined)
        },
        Right: ref => {
            expect(ref).toEqual(withoutDisplay)
        }
    })
});
test('Decodes reference with display', () => {
    const decoded = FhirUserReference.decode({
        reference: 'RelatedPerson/def456',
        display: 'My Related Person'
    });
    decoded.caseOf({
        Left: e => {
            fail(`Could not decode reference: ${e}`);
        },
        Right: ref => {
            expect(ref).toEqual(withDisplay)
        }
    })
})
test('Ignores url prefix', () => {
    const decoded = FhirUserReference.decode({
        reference: 'https://www.fhir.com/server/RelatedPerson/def456',
        display: 'My Related Person'
    });
    decoded.caseOf({
        Left: e => {
            fail(`Could not decode reference: ${e}`);
        },
        Right: ref => {
            expect(ref).toEqual(withDisplay)
        }
    })
});
test('Errors for missing resourceType', () => {
    const decoded = FhirUserReference.decode({
        reference: '/def456',
        display: 'My Related Person'
    });
    expect(decoded.isLeft()).toBe(true);
});
test('Errors for missing resource ID', () => {
    const decoded = FhirUserReference.decode({
        reference: 'RelatedPerson/',
        display: 'My Related Person'
    });
    expect(decoded.isLeft()).toBe(true);
});
test('Errors for no slash', () => {
    const decoded = FhirUserReference.decode({
        reference: 'def456',
        display: 'My Related Person'
    });
    expect(decoded.isLeft()).toBe(true);
});
test('Errors for unexpected resourceType', () => {
    const decoded = FhirUserReference.decode({
        reference: 'Patient/def456',
        display: 'My Patient'
    });
    expect(decoded.isLeft()).toBe(true);
});