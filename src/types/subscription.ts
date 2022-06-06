export interface ISubscriptionListByUserRepository {
    id: string;
    start_date?: Date;
    expires_at?: Date;
    is_active?: boolean;
    is_simulation?: boolean;
    created_at: Date;
    user_id: string;
    payment_config_id: string;
    subscription_plan_id: string;
}

export interface ISubscriptionCreateRepository {
    start_date?: Date;
    expires_at?: Date;
    is_active?: boolean;
    created_at: Date;
    user_id: string;
    payment_config_id: string;
    subscription_plan_id: string;
}

export interface ISimulationCreateRepository {
    start_date?: Date;
    expires_at?: Date;
    is_active?: boolean;
    is_simulation: boolean;
    created_at: Date;
    user_id: string;
    payment_config_id?: string | any;
    subscription_plan_id: string;
}

export interface ISubscriptionCancelRepository {
    id: string;
    is_active: boolean;
}
