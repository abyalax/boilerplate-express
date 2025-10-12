import { catchMethodNotAllowed } from "~/common/middleware/catch.middleware";
import { getProfile, updateProfile } from "./user.controller";
import { createRouter } from "~/common/http/router";

export const userRoutes = createRouter();

userRoutes.get("/users/me", getProfile);
userRoutes.patch("/users/:id", updateProfile);

userRoutes.use("/users", catchMethodNotAllowed);
