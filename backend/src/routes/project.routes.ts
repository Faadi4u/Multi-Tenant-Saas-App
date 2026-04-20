import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { createProject, getTenantProjects } from "../controllers/project.controller.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { createProjectSchema } from "../validators/task.validator.ts";

const router = Router();
router.use(verifyJWT); // Protect all project routes

router.route("/")
    .post(validate(createProjectSchema), createProject)
    .get(getTenantProjects);

export const projectRouter = router;