export interface IAddressCreateRequest {
    cep: string;
    number: number;
    street: string;
    city: string;
    state: string;
    country_id: string;
    user_id: string;
    neighborhood: string;
    is_main_address: boolean;
    complement?: string;
}

export interface IAddress {
    id?: string;
    cep: string;
    number: number;
    street: string;
    city: string;
    state: string;
    country_id: string;
    user_id: string | any;
    neighborhood: string;
    is_main_address: boolean;
    complement?: string;
}
