import type { Request } from "express";
import type { SafeUser } from "../../modules/users/user.model";

declare global {
  namespace Express {
    interface Locals {
      requestId?: string;
    }

    interface Request {
      user?: SafeUser;
    }
  }
}

export type AppRequest = Request;
