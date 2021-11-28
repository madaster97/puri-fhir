import { Codec, array, string, maybe, GetType } from 'purify-ts/Codec';

export const Coding = Codec.interface({
    system: string,
    code: string
});
export type Coding = GetType<typeof Coding>;
export const CodeableConcept = Codec.interface({
    coding: array(Coding),
    text: maybe(string)
});
export type CodeableConcept = GetType<typeof CodeableConcept>;

export const HasCodeable = (system: string, code: string) => (concept: CodeableConcept) => {
    return concept.coding.findIndex(codeCheck => codeCheck.system == system && codeCheck.code == code) != -1
};