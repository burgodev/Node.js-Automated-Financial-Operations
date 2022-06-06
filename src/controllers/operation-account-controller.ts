import { Request, Response } from "express";
import ValidationError from "../errors/validation-error";
import { r } from "../helpers/general";
import OperationAccountService from "../services/operation-account/operation-account.service";
import { ILoggedUser } from "../types/auth";

class OperationAccountController {
    private operationAccountService: OperationAccountService;

    constructor(operationAccountService: OperationAccountService) {
        this.operationAccountService = operationAccountService;
    }

    public async list(request: Request, response: Response) {
        const user: ILoggedUser = request.user;
        const { integration_token, account_type } = request.body; // real | demo

        if (!account_type || !integration_token) {
            throw new ValidationError(
                "OPERATION_ACCOUNT.BAD_REQUEST.MISSING_ACCOUNT_TYPE_OR_TOKEN"
            );
        }

        const data = await this.operationAccountService.list(
            user,
            account_type,
            integration_token
        );

        return r(response, "SUCCESS", data);
    }
}

export default OperationAccountController;
