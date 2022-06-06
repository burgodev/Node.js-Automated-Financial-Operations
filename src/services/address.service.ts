import AddressRepository from "../repositories/address-repository";
import { IAddress } from "../types/address";

class AddressService {
    private addressRepository: AddressRepository;
    constructor(addressRepository: AddressRepository) {
        this.addressRepository = addressRepository;
    }

    public async getUserMainAddress(user_id: string) {
        return await this.addressRepository.getUserMainAddress(user_id);
    }

    public async listById(user_id: string) {
        const addresses = await this.addressRepository.listById(user_id);

        return addresses;
    }

    public async createAddress(address_data: IAddress) {
        const address = await this.addressRepository.createAddress(
            address_data
        );

        return address;
    }

    public async update(address_id: string, address_data: IAddress) {
        const address = await this.addressRepository.update(
            address_id,
            address_data
        );

        return address;
    }
}

export default AddressService;
