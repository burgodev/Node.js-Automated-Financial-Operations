import { Router } from 'express';
import SignInController from '../controllers/sign-in-controller';

const signInRoutes = Router();

const signInController = new SignInController();

signInRoutes.post('/', signInController.signIn.bind(signInController));

export default signInRoutes;