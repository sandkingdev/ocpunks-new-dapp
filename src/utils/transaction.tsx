import {
    SmartContract,
    Interaction,
    ProxyProvider,
} from '@elrondnetwork/erdjs';

export const sendQuery = async (contract: SmartContract, proxy: ProxyProvider, interaction: Interaction) => {
    if (!contract) return;
    const queryResponse = await contract.runQuery(proxy, interaction.buildQuery());
    const res = interaction.interpretQueryResponse(queryResponse);

    return res;
};