import { PrismaClient } from "@prisma/client";

class BrokerRepository {
    private prisma;
    private client;

    private select_arguments = {
        id: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.broker;
    }

    public async findByName(name: string) {
        return await this.client.findFirst({
            where: {
                name,
            },
            select: this.select_arguments,
        });
    }
}

export default BrokerRepository;
