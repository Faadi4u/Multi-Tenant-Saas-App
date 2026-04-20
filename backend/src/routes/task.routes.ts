import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { createTask, getTasksByProject } from "../controllers/task.controller.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { createTaskSchema } from "../validators/task.validator.ts";

const router = Router();
router.use(verifyJWT); // Protect all task routes

router.route("/").post(validate(createTaskSchema), createTask);
router.route("/project/:projectId").get(getTasksByProject);

export const taskRouter = router;