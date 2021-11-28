import { Codec, exactly, intersect, oneOf } from 'purify-ts/Codec';

export const ourVals = oneOf([exactly('myVal'),exactly('yourVal')]);