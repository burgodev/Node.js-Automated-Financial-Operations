import { ICardRepository, ICard, ICardRequest } from "../../types/card";
import CardRepository from "../../repositories/card-repository";
import { ILoggedUser } from "../../types/auth";
import AddressRepository from "../../repositories/address-repository";
import ValidationError from "../../errors/validation-error";
import APIError from "../../errors/api-error";
import { IAddress } from "../../types/address";

export default class CardService {
    private cardRepository: CardRepository;
    private addressRepository: AddressRepository;

    constructor(
        cardRepository: CardRepository,
        addressRepository: AddressRepository
    ) {
        this.cardRepository = cardRepository;
        this.addressRepository = addressRepository;
    }

    public async create(
        user: ILoggedUser,
        card: ICardRequest
    ): Promise<Partial<ICard>> {
        let address_id: string;
        if (card.address_id) {
            // Informed an existend address
            await this.validateUserAddress(card.address_id, user.user_id);

            address_id = card.address_id;
        } else if (card.address) {
            // Informed a new address
            card.address.is_main_address = false;

            const new_address: IAddress = card.address;

            const address = await this.addressRepository.createAddress(
                new_address
            );

            if (!address.id) {
                throw new APIError("ADDRESS.CREATE.ERROR");
            }

            address_id = address.id;
        } else {
            // Using the usar default address
            const address = await this.addressRepository.getUserMainAddress(
                user.user_id
            );

            if (!address || address.id == undefined) {
                throw new ValidationError("Could not find user main address!");
            }

            address_id = address.id;
        }

        const card_insert: ICardRepository = {
            ...card,
            address_id,
            user_id: user.user_id,
        };

        return await this.cardRepository.create(card_insert);
    }

    private async validateUserAddress(
        address_id: string,
        user_id: string
    ): Promise<boolean> {
        const result = await this.addressRepository.findById(address_id);
        if (!result) {
            throw new ValidationError("Could not find informed address!");
        }

        //const address: IAddress = result; //TODO fix type
        const address: any = result;
        if (address.user_id != user_id) {
            throw new ValidationError(
                "The address informed does not belong to this user!"
            );
        }

        return true;
    }

    public async list(user_id: string) {
        const cards = await this.cardRepository.list(user_id);

        return cards;
    }

    public async findById(user: ILoggedUser, card_id: string) {
        const user_id: string = user.user_id;
        const card = await this.cardRepository.findById(user_id, card_id);

        return card;
    }

    public async validation(card: ICardRequest): Promise<boolean> {
        this.validateCardFields(card);
        //CALL card check api to get if the card is ready for payments

        return true;
    }

    private validateCardFields(card: ICardRequest): void {
        if (card.cardholder == "") {
            throw new ValidationError("CARDS.BAD_REQUEST.CARDHOLDER");
        }
        if (parseInt(card.expiry_month) > 12) {
            throw new ValidationError("CARDS.BAD_REQUEST.EXPIRY_MONTH");
        }
    }
}
