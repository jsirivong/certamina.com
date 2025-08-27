import type { Request } from "express";
import type User from "../types/User.ts";

export default interface AuthorizedUserRequest extends Request {
    user?: User;
}