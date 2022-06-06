import { PrismaClient } from "@prisma/client";
import { ICustomerGatewayInfoCreateRepository } from "../types/gateway-customer-info";

class CustomerGatewayInfoRepository {
    private prisma;
    private client;

    protected select_arguments = {
        id: true,
        customer_id: true,
        user_id: true,
        payment_gateway_id: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.customerGatewayInfos;
    }

    public async create(
        customer_gateway_info: ICustomerGatewayInfoCreateRepository
    ) {
        const result = await this.client.create({
            data: customer_gateway_info,
        });

        return result;
    }
    public async getGatewayCustomer(
        customer_gateway_info: ICustomerGatewayInfoCreateRepository
    ) {
        const result = await this.client.findFirst({
            where: {
                user_id: customer_gateway_info.user_id,
                payment_gateway_id: customer_gateway_info.payment_gateway_id,
            },
            select: this.select_arguments,
        });

        return result;
    }
}

export default CustomerGatewayInfoRepository;
