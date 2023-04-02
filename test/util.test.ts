import { describe, expect, it } from '@jest/globals';
import { validateUrl, number10to62 } from '../server/util/common';

describe('url validation', () => {
    it('https://google.com should be valid url', () => {
        expect(validateUrl('https://google.com')).toBe(true);
    });

    it('xxxx.cn should be invalid url', () => {
        expect(validateUrl('xxxx.cn')).toBe(false);
    });
});

describe('radix convert', () => {
    it('10000 convert should be 2Bi', () => {
        expect(number10to62(10000)).toBe('2Bi');
    });
});
