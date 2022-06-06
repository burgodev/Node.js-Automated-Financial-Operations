export interface IAsaasCreateCostumerRepository {
    name: string | any;
    cpfCnpj: string | any;
    email?: string;
    phone?: string;
    postalCode?: string;
    mobilePhone?: string;
    addressNumber?: string;
    complement?: string;
    externalReference?: string;
    notificationDisabled?: boolean;
    observations?: string;
}

export interface IAsaasCreateSubscriptionRepository {
    customer: string;
    billingType: string;
    nextDueDate: string;
    value: number | any;
    cycle: string;
    description: string | any;
    externalReference?: string;
    endDate?: any;
    creditCard: {
        holderName: string;
        number: string;
        expiryMonth: string;
        expiryYear: string;
        ccv: string;
    };
    creditCardHolderInfo: {
        name: string | any;
        email: string;
        cpfCnpj: string | any;
        postalCode: string;
        addressNumber: string;
        addressComplement?: null;
        phone: string | any;
        mobilePhone: string | any;
    };
    fine: {
        value: number;
    };
    interest: {
        value: 0;
    };
}

export interface IAsaasCreateTicketRepository {
    customer: string;
    billingType: string;
    dueDate?: string | any;
    value: number;
    description: string;
    discount?: {
        value?: number | 0;
        dueDateLimitDays?: number | 0;
    };
    fine?: {
        value?: number | 0;
    };
    interest?: {
        value?: number | 0;
    };
    postalService: boolean | false;
}
