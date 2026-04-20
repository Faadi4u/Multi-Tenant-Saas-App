import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { authorize } from "../middlewares/rbac.middleware.ts";
import { sendInvite, acceptInvite } from "../controllers/invite.controller.ts";

const router = Router();

// Route to actually join (Public, no verifyJWT needed here)
router.route("/accept").post(acceptInvite);

// Route to send invite (Protected: Only Admin can invite)
router.use(verifyJWT);
router.route("/send").post(authorize("ADMIN"), sendInvite);

export const inviteRouter = router;