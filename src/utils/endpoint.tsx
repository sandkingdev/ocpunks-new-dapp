import axios from 'axios';
import {
    WEGLD_ID,
    USDC_ID,
} from 'config';
import { convertWeiToEsdt } from './index';


export const getTokenBalance = async (apiAddress: string, walletAddress: string, tokenIdentifier: string) => {
    const res = await axios.get(`${apiAddress}/accounts/${walletAddress}/tokens?identifier=${tokenIdentifier}`);
    // console.log('res', res);
    if (res.data?.length > 0) {
        const token = res.data[0];
        return convertWeiToEsdt(token.balance, token.decimals);
    }

    return 0;
};

export const getEgldPrice = async (apiAddress: string) => {
    const url = `${apiAddress}/mex-pairs/${WEGLD_ID}/${USDC_ID}`;

    try {
        const res = await axios.get(url);
        // console.log('getEgldPrice res', res);
        if (res.data) {
            return parseFloat(res.data.basePrice);
        }
    } catch(e) {
        // console.log(e);
    }

    return 0;
};