import { BrokerAccount, PrismaClient } from "@prisma/client";
import { IBrokerAccountGetByUserRepository } from "../types/broker-account";

class BrokerAccountRepository {
    private prisma;
    private client;

    private select_arguments = {
        id: true,

        balance: true,
        external_broker_account_id: true,

        created_at: true,
        updated_at: true,
        deleted_at: true,

        user_id: true,
        broker_id: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.brokerAccount;
    }

    public async create(token: string, user_id: string, broker_id: string) {
        return await this.client.create({
            data: {
                user_id,
                external_broker_account_id: token,
                broker_id: broker_id,
            },
            select: this.select_arguments,
        });
    }

    public async checkToken(token: string, user_id: string) {
        return await this.client.findFirst({
            where: {
                external_broker_account_id: token,
                user_id,
            },
        });
    }

    //WARNING: we are considering just one broker account per user
    public async getByUser(user_id: string) {
        const result = await this.client.findFirst({
            where: { user_id },
            select: {
                id: true,
                external_broker_account_id: true,
            },
        });

        return result;
    }
}

export default BrokerAccountRepository;
