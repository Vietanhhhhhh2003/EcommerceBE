import type { Request } from "express";

declare global {
  namespace Express {
    interface Locals {
      requestId?: string;
    }
  }
}

export type AppRequest = Request;
