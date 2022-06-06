import { IUser } from "./user";

export interface ISignIn {
    user: Partial<IUser>,
    token: string,
}

export interface ISignInService {
    signIn(email: string, password: string): Promise<unknown>;
}

export interface ISignInRepository {
    findByEmail(email: string): Promise<Partial<unknown> | null>;
}