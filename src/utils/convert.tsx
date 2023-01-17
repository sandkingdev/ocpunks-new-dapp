import BigNumber from 'bignumber.js/bignumber.js';
import {
    Egld,
} from '@elrondnetwork/erdjs';

export const convertWeiToEgld = (v: any, decimal = 18, precision = 2) => {
    if (typeof(v) !== typeof(BigNumber)) {
        v = new BigNumber(v);
    }
    const factor = Math.pow(10, precision);
    const number = v.div(Math.pow(10, decimal)).toNumber();
    return Math.floor(number * factor) / factor;
};

export const convertWeiToEsdtWithDecimal = (v: any) => {
    // conversion for BigNumber operation
    if (typeof (v) != typeof (BigNumber)) v = new BigNumber(v);
    const number = new BigNumber(v).dividedBy(new BigNumber(Math.pow(10, 18)));
    return number.toFixed(18).replace(/\.?0+$/, '');
};

export const formatNumbers = (v:any, precision = 2) => {
    const factor = Math.pow(10, precision);
    const number = Math.floor(v * factor) / factor;
    return new Intl.NumberFormat('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2}).format(number);
};

export const convertEsdtToWei = (v: number, decimals = 18) => {
    const factor = Math.pow(10, decimals);
    return (new BigNumber(v)).multipliedBy(factor);
};

export const paddingTwoDigits = (num: any) => {
    return num.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false
    });
};

export const convertWeiToEsdt = (v: any, decimals = 18, precision = 4) => {
    // conversion for BigNumber operation
    if (typeof(v) != typeof(BigNumber)) v = new BigNumber(v);

    const number = v.dividedBy(new BigNumber(Math.pow(10, decimals))).toNumber();
    const factor = Math.pow(10, precision);
    return Math.floor(number * factor) / factor;
};

export function getDecimalOfToken(tokens: any[], targetTokenId: string) {
    for (const [key, value] of Object.entries(tokens)) {
        if (value.id == targetTokenId) {
            return value.decimals;
        }
    }
    return 18;
}

export const precisionRound = (number: number, precision = 4) => {
    const factor = Math.pow(10, precision);
    return Math.floor(number * factor) / factor;
};