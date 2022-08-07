import EgldLogo from 'assets/img/EGLD.svg';

// mainnet
// export const TOKENS = {
//     "EGLD": {
//         identifier: "EGLD",
//         ticker: "EGLD",
//         decimals: 18,
//         url: EgldLogo,
//         unit_price_in_usd: 130,
//     },
//     "ODIN-4d429b": {
//         identifier: "ODIN-4d429b",
//         ticker: "ODIN",
//         decimals: 6,
//         url: "https://media.elrond.com/tokens/asset/ODIN-4d429b/logo.svg",
//         unit_price_in_usd: 0.0018,
//     },
//     "USDC-c76f1f": {
//         identifier: "USDC-c76f1f",
//         ticker: "USDC",
//         decimals: 6,
//         url: "https://media.elrond.com/tokens/asset/USDC-c76f1f/logo.svg"
//     },
//     "LUCKY-2cb58b": {
//         identifier: "LUCKY-2cb58b",
//         ticker: "LUCKY",
//         decimals: 18,
//         url: "https://media.elrond.com/tokens/asset/LUCKY-2cb58b/logo.svg",
//         unit_price_in_usd: 0,
//     },
//     "MEX-455c57": {
//         identifier: "MEX-455c57",
//         ticker: "MEX",
//         decimals: 18,
//         url: "https://media.elrond.com/tokens/asset/MEX-455c57/logo.svg",
//         unit_price_in_usd: 0.000173,
//     },
//     "WEGLD-bd4d79": {
//         identifier: "WEGLD-bd4d79",
//         ticker: "WEGLD",
//         decimals: 18,
//         url: "https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.svg",
//         unit_price_in_usd: 0,
//     },
//     "SUPER-507aa6": {
//         identifier: "SUPER-507aa6",
//         ticker: "SUPER",
//         decimals: 18,
//         url: "https://media.elrond.com/tokens/asset/SUPER-507aa6/logo.svg",
//         unit_price_in_usd: 0.034,
//     },
//     "VITAL-bc0917": {
//         identifier: "VITAL-bc0917",
//         ticker: "VITAL",
//         decimals: 8,
//         url: "https://media.elrond.com/tokens/asset/VITAL-bc0917/logo.svg",
//         unit_price_in_usd: 0.00000010,
//     },
//     "EFFORT-a13513": {
//         identifier: "EFFORT-a13513",
//         ticker: "EFFORT",
//         decimals: 18,
//         url: "https://media.elrond.com/tokens/asset/EFFORT-a13513/logo.svg",
//         unit_price_in_usd: 0,
//     },
//     "DICE-9749cc": {
//         identifier: "DICE-9749cc",
//         ticker: "DICE",
//         decimals: 6,
//         url: "https://media.elrond.com/tokens/asset/DICE-9749cc/logo.svg",
//         unit_price_in_usd: 0,
//     },
// };

// ZOG-c66239
// LKMEX-aab910
export const TOKENS: any = {
    'EGLD': {
        identifier: 'EGLD',
        ticker: 'EGLD',
        decimals: 18,
        url: EgldLogo,
        unit_price_in_usd: 130,
    },
    'ZOG-c66239': {
        identifier: 'ZOG-c66239',
        ticker: 'ZOG',
        decimals: 6,
        url: 'https://media.elrond.com/tokens/asset/ZOG-c66239/logo.svg',
        unit_price_in_usd: 0.00019,
    },
    'BLOOD-fe36ed': {
        identifier: 'BLOOD-fe36ed',
        ticker: 'BLOOD',
        decimals: 0,
        url: 'https://media.elrond.com/tokens/asset/BLOOD-fe36ed/logo.svg',
        unit_price_in_usd: 0.00019,
    },
    'STEPX-23bbca': {
        identifier: 'STEPX-23bbca',
        ticker: 'STEPX',
        decimals: 18,
        url: 'https://media.elrond.com/tokens/asset/STEPX-23bbca/logo.svg',
        unit_price_in_usd: 0.00019,
    },
    // 'LKMEX-aab910': {
    //     identifier: 'LKMEX-aab910',
    //     ticker: 'LKMEX',
    //     decimals: 18,
    //     url: 'https://media.elrond.com/tokens/asset/ZOG-c66239/logo.svg',
    //     unit_price_in_usd: 0.00019,
    // },
};


// devnet
// export const TOKENS:any = {
//     'ZOG-481946': {
//         identifier: 'ZOG-481946',
//         ticker: 'ZOG',
//         decimals: 6,
//         url: 'https://media.elrond.com/tokens/asset/ZOG-c66239/logo.svg',
//         unit_price_in_usd: 0.00019,
//     },
//     'SVEN-de92d2': {
//         identifier: 'SVEN-de92d2',
//         ticker: 'SVEN',
//         decimals: 18,
//         url: 'https://media.elrond.com/tokens/asset/ZOG-c66239/logo.svg',
//         unit_price_in_usd: 0.00019,
//     },
// };

// devnet
// export const OFFER_TOKEN_LIST = [
//     {
//         name: 'EGLD',
//         id: 'EGLD',
//         decimals: 18,
//         url: EgldLogo,
//     },
//     {
//         name: 'WEGLD',
//         id: 'WEGLD-d7c6bb',
//         decimals: 18,
//         url: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.png',
//     },
//     {
//         name: 'ZOG',
//         id: 'ZOG-481946',
//         decimals: 6,
//         url: 'https://media.elrond.com/tokens/asset/ZOG-c66239/logo.svg',
//     },
//     {
//         name: 'MEX',
//         id: 'MEX-dc289c',
//         decimals: 18,
//         url: 'https://media.elrond.com/tokens/asset/MEX-455c57/logo.png',
//     },
// ];

export const OFFER_TOKEN_LIST = [
    {
        name: 'EGLD',
        id: 'EGLD',
        decimals: 18,
        url: EgldLogo,
    },
    {
        name: 'WEGLD',
        id: 'WEGLD-bd4d79',
        decimals: 18,
        url: 'https://media.elrond.com/tokens/asset/WEGLD-bd4d79/logo.png',
    },
    {
        name: 'ZOG',
        id: 'ZOG-c66239',
        decimals: 6,
        url: 'https://media.elrond.com/tokens/asset/ZOG-c66239/logo.svg',
    },
    // {
    //     name: 'ODIN',
    //     id: 'ODIN-4d429b',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/ODIN-4d429b/logo.png",
    // },
    {
        name: 'MEX',
        id: 'MEX-455c57',
        decimals: 18,
        url: 'https://media.elrond.com/tokens/asset/MEX-455c57/logo.png',
    },
    {
        name: 'BLOOD',
        id: 'BLOOD-fe36ed',
        decimals: 0,
        url: 'https://media.elrond.com/tokens/asset/BLOOD-fe36ed/logo.png',
    },
    {
        name: 'STEPX',
        id: 'STEPX-23bbca',
        decimals: 18,
        url: 'https://media.elrond.com/tokens/asset/STEPX-23bbca/logo.png',
    },


    // {
    //     name: 'AERO',
    //     id: 'AERO-458bbf',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/AERO-458bbf/logo.png",
    // },
    // {
    //     name: 'AIR',
    //     id: 'AIR-317920',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/AIR-317920/logo.png",
    // },
    // {
    //     name: 'BHAT',
    //     id: 'BHAT-c1fde3',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/BHAT-c1fde3/logo.png",
    // },
    // {
    //     name: 'BSK',
    //     id: 'BSK-baa025',
    //     decimals: 16,
    //     url: "https://media.elrond.com/tokens/asset/BSK-baa025/logo.svg",
    // },
    // {
    //     name: 'BTX',
    //     id: 'BTX-0f676d',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/BTX-48d004/logo.png",
    // },
    // {
    //     name: 'CHECKR',
    //     id: 'CHECKR-60108b',
    //     decimals: 5,
    //     url: "https://media.elrond.com/tokens/asset/CHECKR-60108b/logo.png",
    // },
    // {
    //     name: 'COOL',
    //     id: 'COOL-985c14',
    //     decimals: 8,
    //     url: "https://media.elrond.com/tokens/asset/COOL-985c14/logo.png",
    // },

    // {
    //     name: 'CRU',
    //     id: 'CRU-a5f4aa',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/CRU-a5f4aa/logo.svg",
    // },

    // {
    //     name: 'CTP',
    //     id: 'CTP-298075',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/CTP-298075/logo.png",
    // },

    // {
    //     name: 'DICE',
    //     id: 'DICE-9749cc',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/DICE-9749cc/logo.png",
    // },

    // {
    //     name: 'EARTH',
    //     id: 'EARTH-cac0a1',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/EARTH-cac0a1/logo.png",
    // },
    // {
    //     name: 'EFFORT',
    //     id: 'EFFORT-a13513',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/EFFORT-a13513/logo.png",
    // },
    // {
    //     name: 'EFTR',
    //     id: 'EFTR-315177',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/EFTR-315177/logo.png",
    // },
    // {
    //     name: 'EGLDMEX',
    //     id: 'EGLDMEX-0be9e5',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/EGLDMEX-0be9e5/logo.svg",
    // },

    // {
    //     name: 'FIRE',
    //     id: 'FIRE-a9a32a',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/FIRE-a9a32a/logo.png",
    // },

    // {
    //     name: 'FIVE',
    //     id: 'FIVE-d8b982',
    //     decimals: 3,
    //     url: "https://media.elrond.com/tokens/asset/FIVE-d8b982/logo.png",
    // },
    // {
    //     name: 'FIXX',
    //     id: 'FIXX-074526',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/FIXX-074526/logo.png",
    // },

    // {
    //     name: 'GOLDEN',
    //     id: 'GOLDEN-335e6d',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/GOLDEN-335e6d/logo.png",
    // },
    // {
    //     name: 'GTTS',
    //     id: 'GTTS-ac8274',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/GTTS-ac8274/logo.png",
    // },

    // {
    //     name: 'HETO',
    //     id: 'HETO-663cf8',
    //     decimals: 0,
    //     url: "https://media.elrond.com/tokens/asset/HETO-663cf8/logo.png",
    // },
    // {
    //     name: 'HRD',
    //     id: 'HRD-71df2d',
    //     decimals: 12,
    //     url: "https://media.elrond.com/tokens/asset/HRD-71df2d/logo.png",
    // },
    // {
    //     name: 'ISET',
    //     id: 'ISET-84e55e',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/ISET-84e55e/logo.png",
    // },

    // {
    //     name: 'ISETEGLDLP',
    //     id: 'ISETEGLDLP-86715a',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/ISETEGLDLP-86715a/logo.svg",
    // },

    // {
    //     name: 'ITHEUM',
    //     id: 'ITHEUM-df6f26',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/ITHEUM-df6f26/logo.png",
    // },
    // {
    //     name: 'JEX',
    //     id: 'JEX-9040ca',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/JEX-9040ca/logo.png",
    // },
    // {
    //     name: 'KOSON',
    //     id: 'KOSON-5dd4fa',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/KOSON-5dd4fa/logo.png",
    // },
    // {
    //     name: 'KRO',
    //     id: 'KRO-df97ec',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/KRO-df97ec/logo.png",
    // },
    // {
    //     name: 'LAND',
    //     id: 'LAND-40f26f',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/LAND-40f26f/logo.png",
    // },
    // {
    //     name: 'LKLAND-6cf78e',
    //     id: 'LKLAND-6cf78e',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/LAND-40f26f/logo.png",
    // },
    // {
    //     name: 'LKLAND-c617f7',
    //     id: 'LKLAND-c617f7',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/LAND-40f26f/logo.png",
    // },

    // {
    //     name: 'MARE',
    //     id: 'MARE-63e515',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/MARE-63e515/logo.png",
    // },
    // {
    //     name: 'MUNCHKIN',
    //     id: 'MUNCHKIN-3865e6',
    //     decimals: 8,
    //     url: "https://media.elrond.com/tokens/asset/MUNCHKIN-3865e6/logo.png",
    // },
    // {
    //     name: 'NUTS',
    //     id: 'NUTS-8ad81a',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/NUTS-8ad81a/logo.png",
    // },
    // {
    //     name: 'OFE',
    //     id: 'OFE-29eb54',
    //     decimals: 4,
    //     url: "https://media.elrond.com/tokens/asset/OFE-29eb54/logo.png",
    // },
    // {
    //     name: 'PLATA',
    //     id: 'PLATA-9ba6c3',
    //     decimals: 8,
    //     url: "https://media.elrond.com/tokens/asset/PLATA-9ba6c3/logo.png",
    // },

    // {
    //     name: 'QWT',
    //     id: 'QWT-46ac01',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/QWT-46ac01/logo.png",
    // },
    // {
    //     name: 'REALM',
    //     id: 'REALM-8ead17',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/REALM-8ead17/logo.png",
    // },
    // {
    //     name: 'RIDE',
    //     id: 'RIDE-7d18e9',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/RIDE-7d18e9/logo.png",
    // },
    // {
    //     name: 'RISA',
    //     id: 'RISA-c115c7',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/RISA-c115c7/logo.png",
    // },
    // {
    //     name: 'STEAKS',
    //     id: 'STEAKS-abb9f1',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/STEAKS-abb9f1/logo.png",
    // },
    // {
    //     name: 'SUPER',
    //     id: 'SUPER-507aa6',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/SUPER-507aa6/logo.png",
    // },
    // {
    //     name: 'USDC',
    //     id: 'USDC-c76f1f',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/USDC-c76f1f/logo.png",
    // },
    // {
    //     name: 'UPARK',
    //     id: 'UPARK-982dd6',
    //     decimals: 6,
    //     url: "https://media.elrond.com/tokens/asset/UPARK-982dd6/logo.png",
    // },

    // {
    //     name: 'VITAL',
    //     id: 'VITAL-bc0917',
    //     decimals: 8,
    //     url: "https://media.elrond.com/tokens/asset/VITAL-bc0917/logo.png",
    // },

    // {
    //     name: 'WAFL',
    //     id: 'WAFL-e74a57',
    //     decimals: 5,
    //     url: "https://media.elrond.com/tokens/asset/WAFL-e74a57/logo.svg",
    // },

    // {
    //     name: 'WEFFT',
    //     id: 'WEFFT-db4cf1',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/WEFFT-db4cf1/logo.svg",
    // },
    // {
    //     name: 'WFLS',
    //     id: 'WFLS-5385b4',
    //     decimals: 9,
    //     url: "https://media.elrond.com/tokens/asset/WFLS-5385b4/logo.svg",
    // },
    // {
    //     name: 'WAM',
    //     id: 'WAM-510e42',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/WAM-510e42/logo.svg",
    // },
    // {
    //     name: 'WATER',
    //     id: 'WATER-9ed400',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/WATER-9ed400/logo.png",
    // },


    // {
    //     name: 'XLH',
    //     id: 'XLH-8daa50',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/XLH-8daa50/logo.png",
    // },
    // {
    //     name: 'ZPAY',
    //     id: 'ZPAY-247875',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/ZPAY-247875/logo.png",
    // },
    // {
    //     name: 'ZPAYWEGLD',
    //     id: 'ZPAYWEGLD-34e5c1',
    //     decimals: 18,
    //     url: "https://media.elrond.com/tokens/asset/ZPAYWEGLD-34e5c1/logo.svg",
    // },
];