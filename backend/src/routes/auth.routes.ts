import { Router } from "express";
import { registerOrganization, loginUser } from "../controllers/auth.controller.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { registerSchema, loginSchema } from "../validators/auth.validator.ts";
import { updateProfile } from "../controllers/auth.controller.ts";
import { verifyJWT } from "../middlewares/auth.middleware.ts";

const router = Router();

router.route("/register").post(validate(registerSchema), registerOrganization);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/profile").patch(verifyJWT, updateProfile);

export const authRouter = router;