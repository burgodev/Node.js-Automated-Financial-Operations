import { PrismaClient } from "@prisma/client";
import APIError from "../errors/api-error";
import { ICardRepository } from "../types/card";

export default class CardRepository {
    private prisma;
    private client;
    private where_not_deleted = {
        deleted_at: null,
    };

    protected select_arguments = {
        id: true,
        cardholder: true,
        number: true,
        expiry_month: true,
        expiry_year: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = this.prisma.paymentCard;
    }

    public async create(card: ICardRepository) {
        return await this.client.create({
            data: card,
            select: this.select_arguments,
        });
    }

    public async list(user_id: string) {
        try {
            const data: Partial<ICardRepository>[] = await this.client.findMany(
                {
                    where: {
                        user_id,
                    },
                    select: { ...this.select_arguments },
                }
            );

            return data;
        } catch (err: any) {
            throw new APIError(err.message as string);
        }
    }

    public async findById(user_id: string, card_id: string) {
        try {
            const data: Partial<ICardRepository> | null =
                await this.client.findFirst({
                    where: {
                        user_id,
                        id: card_id,
                    },
                    select: this.select_arguments,
                });

            return data;
        } catch (err: any) {
            throw new APIError(err.message as string);
        }
    }
}
