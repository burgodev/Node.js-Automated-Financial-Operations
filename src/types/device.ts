import { DeviceType } from "@prisma/client";

export interface IDeviceCreateRepository {
    mac_address: string;
    type: DeviceType;
    user_id: string;
}

export interface IDeviceFindRepository {
    user_id: string;
    type: DeviceType;
}
