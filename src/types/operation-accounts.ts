import { OperationAccountType } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";

export interface IOperationAccountCreateRepository {
    id?: string;

    number: number;
    name: string;
    type: OperationAccountType;
    balance_total: Decimal;

    broker_account_id: string;
    subscription_id?: string;
}

export interface IOperationAccountListRepository {
    id: string;

    number: number;
    name: string;
    type: OperationAccountType;
    balance_total: Decimal;
    created_at: Date;
    updated_at?: Date | null;

    broker_account_id: string;
    subscription_id?: string | null;
}

export interface IOperationAccountUpdateRepository {
    number: number;
    balance_total: Decimal;
    updated_at: Date | null;
}

export interface ISelectOperationAccount {
    id: string;

    account_number: number;
    name: string;
    is_demo: boolean;
    balance: Decimal;
}
