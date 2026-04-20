import { Router } from "express";
import { registerOrganization, loginUser } from "../controllers/auth.controller.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { registerSchema, loginSchema } from "../validators/auth.validator.ts";

const router = Router();

router.route("/register").post(validate(registerSchema), registerOrganization);
router.route("/login").post(validate(loginSchema), loginUser);

export const authRouter = router;