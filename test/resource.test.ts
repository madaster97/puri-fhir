import { GetResourceWithId } from '../src/resource';
import { GetReference } from '../src/reference';
import { Codec, string } from 'purify-ts/Codec';
import { Just } from 'purify-ts/Maybe';

const ConditionData = Codec.interface({
    subject: GetReference('Patient')
});
const Condition = GetResourceWithId(ConditionData, 'Condition');
const id = "ewWrLxAPb45gqMmpHa1wW4g3";
const coding = [
    {
        "system": "urn:oid:2.16.840.1.113883.6.90",
        "code": "I10"
    },
    {
        "system": "urn:oid:2.16.840.1.113883.6.96",
        "code": "59621000"
    }
];
const condition = Condition.decode({
    "resourceType": "Condition",
    id,
    "code": {
        coding,
        "text": "Essential hypertension"
    },
    "subject": {
        "reference": "Patient/eZ5-7rYdWqgv3jSgIvx.SPw3",
        "display": "Ambulatory, Oliver"
    }
});
describe('Parses condition resource', () => {
    condition.caseOf({
        Left: e => fail(`Failed to parse condition ${e}`),
        Right: (cond) => {
            test('Retrieves resourece ID automatically', () => {
                expect(cond).toHaveProperty('id',id);
            });
            test('Does not retrieve code parameter',() => {
                expect(cond).not.toHaveProperty('code');
            });
            test('Retrieves and parses reference', () => {
                expect(cond).toHaveProperty('subject', {
                    reference: {resourceType: "Patient",
                    id: "eZ5-7rYdWqgv3jSgIvx.SPw3"},
                    display: Just("Ambulatory, Oliver")
                });
            });
        }
    })
});

const notCondition = Condition.decode({
    id: 'abc123',
    resourceType: 'Patient'
});
test('Fails for non-condition resources', () => {
    expect(notCondition.isLeft()).toBe(true);
});