export interface ISubscriptionCostHistory {
    id: string;
    due_date: Date;
    paid_at?: Date;
    start_validity?: Date;
    end_validity?: Date;
    subscription_id: string;
    charge_id: string;
}