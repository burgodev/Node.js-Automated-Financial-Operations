import { ICrudService, ICrudRepository } from "./crud";

export interface IUser {
    id?: string;
    name?: string;
    email: string;
    password?: string;
    confirm_password?: string;
    password_hash?: string;
    birthday?: string;
    phone?: string;
    ddi?: string;
    document?: string;
    nationality_id?: string;
    address?: {
        cep: string;
    };
}
export interface IUserService extends ICrudService<IUser> {}

export interface IUserRepository extends ICrudRepository<IUser> {}
