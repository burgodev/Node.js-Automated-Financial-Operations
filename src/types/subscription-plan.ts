import { SubscriptionType } from "@prisma/client";

export interface ISubscriptionPlanCreateRepository {
    name: string;
    type: SubscriptionType;
    price: number;
    created_by: string;
    updated_by: string;
    trader_robot_id: string;
}

export interface ISubscriptionPlan {
    id: string;
    name: string;
    type: SubscriptionType;
    active: boolean;
    validity_start: Date;
    validity_end?: Date;
    price: number;
    minimum_months_of_subscription?: number;
    maximum_months_of_advance_payment?: number;
}
