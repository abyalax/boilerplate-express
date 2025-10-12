import { login, register } from "./auth.controller";
import { createRouter } from "~/common/http/router";

export const authRoutes = createRouter();

authRoutes.post("/auth/login", login);
authRoutes.post("/auth/register", register);
