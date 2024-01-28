export const base62 = {
    charset: '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
    encode: (integer: bigint) => {
        let s = '';
        const base = 62n; // Using 'n' to denote a bigint literal
        if (integer === 0n) { // Compare against bigint literal
            return '0';
        }
        while (integer > 0n) { // Use bigint literal for comparison
            const index = Number(integer % base); // Convert bigint to number for indexing
            s = base62.charset[index] + s;
            integer /= base;
        }
        return s;
    },
    decode: (chars: string) => chars.split('').reverse().reduce((prev, curr, i) =>
        prev + (base62.charset.indexOf(curr) * (62 ** i)), 0)
};
