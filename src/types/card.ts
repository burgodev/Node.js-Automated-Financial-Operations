import { IAddress } from "./address";

export interface ICardRequest {
    cardholder: string;
    number: string;
    expiry_month: string;
    expiry_year: string;
    address_id?: string;
    address?: IAddress;
}

export interface ICard {
    id: string;

    cardholder: string;
    number: string;
    expiry_month: string;
    expiry_year: string;
}

export interface ICardRepository {
    id?: string;

    cardholder: string;
    number: string;
    expiry_month: string;
    expiry_year: string;

    user_id: string;
    address_id: string;
}

export interface ICardAndPaymentMethod {
    payment_method: string;
    id: string;
    cardholder: string;
    number: string;
    expiry_month: string;
    expiry_year: string;
}

export interface ICardResponse {
    id: string;
}
