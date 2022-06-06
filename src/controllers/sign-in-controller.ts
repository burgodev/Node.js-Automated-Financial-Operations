import { Request, Response } from 'express';
import SignInService from '../services/sign-in/sign-in.service';
import BaseController from './base-controller';

class SignInController extends BaseController<SignInService> {

    constructor() {
        super(new SignInService());
    }

    public async signIn(request: Request, response: Response): Promise<Response> {
        const { email, password } = request.body;
        
        const signed = await this.service.signIn(email, password);

        return response.json(signed);
    }

}

export default SignInController;