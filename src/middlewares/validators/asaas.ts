import { body } from 'express-validator';

export const subscriptionSchema = [
    body("customer").notEmpty().withMessage("Customer is required"),
    body("billingType").notEmpty().withMessage('billingType is invalid {creditCard, boleto, Pix, Undefined}'),
    body("value").notEmpty().withMessage("Password is required"),
    body("nextDueDate").notEmpty().withMessage("First monthly payment due is required"),
    body("cycle").notEmpty().withMessage("Cycle is required {WEEKLY, WEEKLY, MONTHLY, MONTHLY, MONTHLY, YEARLY}")
];

export const normalChargeSchema = [
    body("customer").notEmpty().withMessage("Customer is required"),
    body("billingType").notEmpty().withMessage('billingType is invalid {creditCard, boleto, Pix, Undefined}'),
    body("value").notEmpty().withMessage("Password is required"),
]

export const creditCardChargeSchema = [
    body("customer").notEmpty().withMessage("Customer is required"),
    body("billingType").notEmpty().withMessage('billingType is invalid {creditCard, boleto, Pix, Undefined}'),
    body("value").notEmpty().withMessage("Password is required"),
    body("dueDate").notEmpty().withMessage("dueDate is required"),
    body("creditCard").notEmpty().withMessage("creditCard is required"),
    body("creditCard").contains({
        "holderName": "string",
        "number": "string",
        "expiryMonth": "string",
        "expiryYear": "string",
        "cvv": "string"
    }).withMessage("creditCard is invalid"),
    body("creditCardHolderInfo").notEmpty().withMessage("creditCardHolderInfo is required"),
    body("creditCardHolderInfo").contains({
        "name": "string",
        "email": "string",
        "cpfCnpj": "string",
        "postalCode": "string",
        "addressNumber": "string",
        "phone": "string",
    }).withMessage("creditCardHolderInfo is invalid"),
    body("remoteIp").notEmpty().withMessage("remoteIp is required")
]