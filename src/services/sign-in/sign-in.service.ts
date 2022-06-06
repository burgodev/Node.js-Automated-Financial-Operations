import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { ISignInService } from '../../types/sign-in';
import { auth_config } from '../../config';
import SignInRepository from '../../repositories/sign-in-repository';
import BaseService from '../base.service';
import ValidationError from '../../errors/validation-error';
import NotFoundError from '../../errors/not-found-error';

class SignInService extends BaseService<SignInRepository> implements ISignInService {

    constructor() {
        super(new SignInRepository());
    }

    public async signIn(email: string, password: string): Promise<unknown> {
        const find_user = await this.repository.findByEmail(email);

        if (!find_user) {
            throw new NotFoundError('User not found');
        }

        const password_matched = await compare(password, find_user.password_hash || '');

        if (!password_matched) {
            throw new ValidationError('E-mail or password invalid');
        }
        const { secret, expiresIn } = auth_config.jwt;

        const token = sign({sub: find_user.id}, secret, {
            expiresIn
        });

        //todo: resolve warnning password_hash
        delete find_user.password_hash

        return {
            find_user,
            token,
        }
    }

}

export default SignInService;