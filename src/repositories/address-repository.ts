import { PrismaClient } from "@prisma/client";
import { IAddress } from "../types/address";

class AddressRepository {
    private prisma;
    private client;

    protected select_arguments = {
        id: true,
        cep: true,
        number: true,
        street: true,
        city: true,
        state: true,
        country_id: true,
        user_id: true,
        neighborhood: true,
        is_main_address: true,
        complement: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.address;
    }

    public async getUserMainAddress(user_id: string) {
        return await this.client.findFirst({
            where: {
                user_id: user_id,
                is_main_address: true,
            },
            select: this.select_arguments,
        });
    }

    public async listById(user_id: string) {
        return await this.client.findMany({
            where: {
                user_id,
            },
            select: this.select_arguments,
        });
    }

    public async findById(user_id: string) {
        return await this.client.findFirst({
            where: { user_id },
            select: this.select_arguments,
        });
    }

    public async createAddress(address_data: IAddress) {
        const result = await this.client.create({
            data: address_data,
        });

        return result;
    }

    public async update(address_id: string, address_data: IAddress) {
        const result = await this.client.update({
            where: {
                id: address_id,
            },
            data: address_data,
        });

        return result;
    }
}

export default AddressRepository;
