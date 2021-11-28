import { Codec, string, maybe, exactly, intersect, array, optional, unknown } from 'purify-ts/Codec';
import { ourVals } from './fixture/repro';

const codec = Codec.interface({
    user: ourVals
});

test('Draft orders should attempt to decode', () => {
    codec.decode({});
    expect(true).toBe(true);
})