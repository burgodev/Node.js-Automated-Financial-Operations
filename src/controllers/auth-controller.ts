import { Request, Response } from "express";
import { compare } from "bcrypt";
import APIError from "../errors/api-error";
import ValidationError from "../errors/validation-error";
import PasswordRecoveryService from "../services/auth/password-recovery.service";
import UserService from "../services/user/user.service";
import { IUser } from "../types/user";
import { l, r } from "../helpers/general";

import { auth_config } from "../config";
import { sign } from "jsonwebtoken";
import DeviceService from "../services/device/device.service";
import ActionLogService from "../services/action-log/action-log.service";

export default class AuthController {
    private user_service: UserService;
    private device_service: DeviceService;
    private action_log_service: ActionLogService;

    constructor(
        deviceService: DeviceService,
        actionLogService: ActionLogService
    ) {
        this.user_service = new UserService();
        this.device_service = deviceService;
        this.action_log_service = actionLogService;
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { email, password, ip, device_type } = req.body;

        const user = await this.user_service.findByEmail(email, {
            password_hash: true,
        });
        l("WARN", "user trying to login", { user, email });

        if (!user) {
            throw new ValidationError("USER.NOT_FOUND");
        }
        const user_id: string = user.id as string;

        if (!(await compare(password, user.password_hash || ""))) {
            throw new ValidationError("LOGIN.FAIL");
        }

        const { secret, expiresIn } = auth_config.jwt;

        const token = sign({ sub: user.id }, secret, {
            expiresIn,
        });

        const checkActionLog = await this.action_log_service.list(user_id);
        const first_time_login = checkActionLog.first_time_login;

        let device_id = "";
        const find_device = await this.device_service.list(
            user_id,
            device_type
        );

        if (!find_device) {
            const new_device = await this.device_service.create(
                user_id,
                device_type
            );
            if (!new_device) {
                throw new ValidationError(
                    "LOGIN.DEVICE_ADD.SOMETHING_WENT_WRONG"
                );
            }
            device_id = new_device.id;
        } else {
            device_id = find_device.id;
        }

        const action_log = await this.action_log_service.create(
            ip,
            user_id,
            device_id
        );
        if (!action_log) {
            throw new ValidationError(
                "LOGIN.ACTION_LOG_ADD.SOMETHING_WENT_WRONG"
            );
        }

        const iso_code = await this.user_service.findUserNationality(email);
        const nationality_id = iso_code.nationality_id;

        return r(res, "LOGIN.SUCCESS", {
            token,
            first_time_login,
            nationality_id,
        });
    }

    public async requestPasswordRecovery(
        req: Request,
        res: Response
    ): Promise<Response> {
        const { email } = req.body;
        const minutes = 5;

        const user = await this.user_service.findByEmail(email);
        if (!user) throw new ValidationError("ERROR.EMAIL_NOT_FOUND");

        const user_id = user.id as string;
        const password_recovery_service = new PasswordRecoveryService();

        if (
            await password_recovery_service.hasRequestedInLastMinutes(
                user_id as string,
                minutes
            )
        )
            throw new ValidationError(
                "AUTH.PASSWORD_RECOVERY.ALREADY_REQUESTED"
            ); //(`You requested the password recovery in the last ${minutes}. Please wait for request again.`);

        const sended = await password_recovery_service.create(user as IUser);

        if (!sended) {
            throw new APIError("EMAIL.SEND_ERROR");
        }

        l("INFO", "User asked to changed his password", { user: email });

        return r(res, "AUTH.PASSWORD_RECOVERY.REQUESTED");
    }

    public async passwordRecovery(
        req: Request,
        res: Response
    ): Promise<Response> {
        const { token, password, password_confirm } = req.body;

        if (password != password_confirm)
            throw new ValidationError("VALIDATIONS.PASSWORDS_DIFFERS");

        const password_recovery_service = new PasswordRecoveryService();
        const user_id = await password_recovery_service.validateToken(token);
        if (user_id == null) throw new ValidationError("TOKEN.INVALID");

        await this.user_service.changePassword(user_id, password);

        return r(res, "AUTH.PASSWORD_RECOVERY.CHANGED");
    }
}
