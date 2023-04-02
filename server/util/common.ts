import { URL } from 'url';

export function number10to62(id: number) {
    const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
    const charsArr = chars.split('');
    const radix = chars.length;
    let qutient = id;
    const arr = [];

    do {
        let mod = qutient % radix;
        qutient = (qutient - mod) / radix;
        arr.unshift(charsArr[mod]);
    } while (qutient);

    return arr.join('');
}

export function validateUrl(url: string) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}
