import { PrismaClient } from "@prisma/client";

class PaymentTypeRepository {
    private prisma;
    private client;

    protected select_arguments = {
        id: true,
        name: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.paymentType;
    }
    public async create() {
        //
    }
    public async list() {
        const result = await this.client.findMany({
            select: this.select_arguments,
        });

        return result;
    }

    public async findById(id: string) {
        const result = await this.client.findFirst({
            where: {
                id: id,
            },
        });

        return result;
    }
}

export default PaymentTypeRepository;
