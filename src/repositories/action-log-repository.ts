import { PrismaClient } from "@prisma/client";
import { IActionLogCreateRepository } from "../types/action-log";

class ActionLogRepository {
    private prisma;
    private client;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.actionLog;
    }

    public async create(action_log: IActionLogCreateRepository) {
        const result = await this.client.create({
            data: action_log,
        });

        return result;
    }

    public async list(user_id: string) {
        const result = await this.client.findFirst({
            where: {
                user_id,
                action: "LOGIN",
            },
        });

        if (result) {
            return { first_time_login: false };
        } else {
            return { first_time_login: true };
        }
    }
}

export default ActionLogRepository;
