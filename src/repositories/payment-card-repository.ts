import { PrismaClient } from "@prisma/client";
import { IPaymentCardCreateRepository } from "../types/payment-card";

class PaymentCardRepository {
    private prisma;
    private client;

    protected select_arguments = {
        id: true,
        cardholder: true,
        number: true,
        address: {
            select: {
                cep: true,
                number: true,
                complement: true,
            },
        },
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.paymentCard;
    }

    public async findById(user_id: string) {
        return await this.client.findFirst({
            where: {
                user_id: user_id,
            },
        });
    }

    public async createWithAddress(data: IPaymentCardCreateRepository) {
        try {
            // const address_obj = await this.prisma.address.create({
            //     data: address,
            // });

            const obj = await this.client.create({
                data: {
                    cardholder: data.cardholder,
                    number: data.number,
                    expiry_month: data.expiry_month,
                    expiry_year: data.expiry_year,
                    user_id: data.user_id,
                    address_id: data.address_id,
                },
                select: this.select_arguments,
            });

            return obj;
        } catch (err: any) {
            throw new Error(err?.message || ("Um erro" as string));
        }
    }

    public async findByNumber(number: string) {
        const cc = await this.client.findFirst({
            where: {
                number,
            },
        });

        return cc;
    }
}

export default PaymentCardRepository;
