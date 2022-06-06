export interface ISubscriptionPaymentConfigListRepository {
    id: string;
    payment_external_reference: string;
    payment_card_id?: string;
    customer_gateway_id: string;
}

export interface ISubscriptionPaymentConfig {
    payment_external_reference: string;
    payment_card_id?: string;
    customer_gateway_id: string;
}
