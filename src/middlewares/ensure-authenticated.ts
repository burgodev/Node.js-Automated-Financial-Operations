import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { auth_config } from "../config/index";
import UnauthenticatedError from "../errors/unauthenticated-error";
import { ILoggedUser } from "../types/auth";

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): void {
  const token = request.headers.authorization;

  if (!token) {
    throw new UnauthenticatedError();
  }

  try {
    const decoded = jwt.verify(token, auth_config.jwt.secret);

    const { sub } = decoded as TokenPayload;

    const logged_user: ILoggedUser = {
      user_id: sub,
    };
    request.user = logged_user;

    return next();
  } catch (error) {
    throw new UnauthenticatedError("TOKEN.INVALID");
  }
}
