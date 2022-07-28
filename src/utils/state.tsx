export interface IOffer {
    accept_token_amount: number;
    accept_token_id: string;
    offer_id: number;
    offer_timestamp: number;
    offer_token_amount: number;
    offer_token_id: string;
    offerer_address: string;
    is_partial_fill_allowed: boolean;
}