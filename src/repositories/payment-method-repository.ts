import { PrismaClient } from "@prisma/client";

class PaymentMethodRepository {
    private prisma;
    private client;

    protected select_arguments = {
        paymentType: {
            select: {
                name: true,
            },
        },
        paymentGateway: {
            select: {
                name: true,
            },
        },
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.paymentMethod;
    }
    public async create() {
        //
    }
    public async list() {
        const result = await this.client.findMany({
            select: {
                id: true,
                paymentType: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        return result.map((m) => {
            return {
                id: m.id,
                name: m.paymentType.name,
            };
        });
    }

    public async findById(id: string) {
        const result = await this.client.findFirst({
            where: {
                id: id,
            },
            select: {
                payment_type_id: true,
                payment_gateway_id: true,
            },
        });

        return result;
    }

    public async findByPaymentTypeId(id: string) {
        const result = await this.client.findFirst({
            where: {
                payment_type_id: id,
            },
            select: {
                id: true,
            },
        });

        return result;
    }
}

export default PaymentMethodRepository;
