export interface IChargeHistory {
    id: string;
    due_date: Date;
    price: number;
    paid_at?: Date;
    gateway_charge_id?: string;
    error_code?: string;
    user_id: string;
    payment_config_id: string;
}