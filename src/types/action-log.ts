import { Actiontype } from "@prisma/client";

export interface IActionLogCreateRepository {
    ip: string;
    datetime: Date;
    action: Actiontype;
    device_id: string;
    user_id: string;
}
