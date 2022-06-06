export interface IPaymentCardCreateRepository {
    cardholder: string;
    number: string;
    expiry_month: string;
    expiry_year: string;
    user_id: string | any;
    address_id?: string | any;
}
