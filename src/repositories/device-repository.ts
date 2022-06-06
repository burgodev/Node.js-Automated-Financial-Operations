import { PrismaClient } from "@prisma/client";
import {
    IDeviceCreateRepository,
    IDeviceFindRepository,
} from "../types/device";

class DeviceRepository {
    private prisma;
    private client;

    private select_arguments = {
        id: true,
    };

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
        this.client = prisma.device;
    }

    public async create(device: IDeviceCreateRepository) {
        const result = await this.client.create({
            data: device,
            select: this.select_arguments,
        });

        return result;
    }

    public async list(device: IDeviceFindRepository) {
        const result = await this.client.findFirst({
            where: {
                user_id: device.user_id,
                type: device.type,
            },
        });

        return result;
    }
}

export default DeviceRepository;
