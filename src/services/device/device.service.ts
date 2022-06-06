import { DeviceType } from "@prisma/client";
import ValidationError from "../../errors/validation-error";
import DeviceRepository from "../../repositories/device-repository";
import {
    IDeviceCreateRepository,
    IDeviceFindRepository,
} from "../../types/device";

class DeviceService {
    private deviceRepository: DeviceRepository;

    constructor(deviceRepository: DeviceRepository) {
        this.deviceRepository = deviceRepository;
    }

    public async create(user_id: string, type: string) {
        const device_type: DeviceType = this.validateDevice(type);
        const mac_address = "ASDFG-ÇLKJH-POIUY-QWERT";

        const new_device: IDeviceCreateRepository = {
            mac_address: mac_address,
            type: device_type,
            user_id: user_id,
        };

        const device = await this.deviceRepository.create(new_device);

        return device;
    }

    public async list(user_id: string, type: string) {
        const device_type: DeviceType = this.validateDevice(type);

        const find_device: IDeviceFindRepository = {
            user_id: user_id,
            type: device_type,
        };

        const device = await this.deviceRepository.list(find_device);

        return device;
    }

    private validateDevice(type: string): DeviceType {
        if (type === "DESKTOP") {
            return DeviceType.DESKTOP;
        } else if (type === "MOBILE") {
            return DeviceType.MOBILE;
        } else if (type === "TABLET") {
            return DeviceType.TABLET;
        }

        throw new ValidationError("DEVICE.CREATE.INVALID_DEVICE_TYPE");
    }
}

export default DeviceService;
