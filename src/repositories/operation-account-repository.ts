import { OperationAccountType, Prisma, PrismaClient } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import {
    IOperationAccountCreateRepository,
    IOperationAccountListRepository,
    IOperationAccountUpdateRepository,
} from "../types/operation-accounts";

class operationAccountRepository {
    private prisma;
    private client;

    private select_arguments = {
        id: true,

        number: true,
        name: true,
        type: true,
        balance_total: true,

        created_at: true,
        updated_at: true,

        broker_account_id: true,
        subscription_id: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.brokerOperationAccount;
    }

    public async create(operation_account: IOperationAccountCreateRepository) {
        await this.client.upsert({
            where: {
                number: operation_account.number,
            },
            create: {
                number: operation_account.number,
                name: operation_account.name,
                broker_account_id: operation_account.broker_account_id,
                balance_total: operation_account.balance_total,
                type: operation_account.type,
            },
            update: {
                name: operation_account.name,
                balance_total: operation_account.balance_total,
            },
        });
    }

    public async list(
        user_id: string,
        type: OperationAccountType
    ): Promise<IOperationAccountListRepository[]> {
        const result = await this.client.findMany({
            where: {
                type,
                brokerAccount: {
                    user_id,
                },
            },
            select: this.select_arguments,
        });

        return result;
    }

    public async update(
        number: number,
        name: string,
        balance_total: Decimal
    ): Promise<IOperationAccountUpdateRepository> {
        const result = await this.client.update({
            where: {
                number: number,
            },
            data: {
                name,
                balance_total,
                updated_at: new Date(),
            },
        });

        return result;
    }

    public async delete(number: number) {
        const result = await this.client.delete({
            where: {
                number,
            },
        });

        return result;
    }
}

export default operationAccountRepository;
