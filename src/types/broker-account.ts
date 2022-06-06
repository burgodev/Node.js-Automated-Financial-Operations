export interface IBrokerAccountCreateRepository {
    balance?: number;
    external_broker_account_id: string;

    user_id: string;
    broker_id: string;
}

export interface IBrokerAccountGetByUserRepository {
    id: string;
    external_broker_account_id?: string;
}
