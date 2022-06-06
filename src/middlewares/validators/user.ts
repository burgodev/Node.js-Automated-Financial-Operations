import { body } from 'express-validator';

export const createSchema = [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage('Email is invalid'),
    body("password").notEmpty().withMessage("Password is required"),
    body("confirm_password").notEmpty().withMessage("Password confirmation is required"),
    body("birthday").notEmpty().withMessage("Birthday is required"),
    body("phone").notEmpty().withMessage("Phone is required"),
    body("ddi").notEmpty().withMessage("DDI is required"),
    body("type").isIn(['PF', 'PJ']).withMessage('Type is invalid (PF or PJ)')
];

export const findByIdSchema = [
    body("id").notEmpty().withMessage("Id is required")
];

export const updateSchema = [
    // body("id").notEmpty().withMessage("Id is required"),
];

export const deleteSchema = [
    body("id").notEmpty().withMessage("Id is required"),
];