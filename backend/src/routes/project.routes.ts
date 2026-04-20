import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { authorize } from "../middlewares/rbac.middleware.ts";
import {
  createProject,
  getTenantProjects,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { createProjectSchema } from "../validators/task.validator.ts";
import { checkPlanLimits } from "../middlewares/subscription.middleware.ts";

const router = Router();

// All routes require authentication
router.use(verifyJWT);

router
  .route("/")
  .get(getTenantProjects) // All authenticated users can view
  .post(
    authorize("ADMIN", "MANAGER"), // Only ADMIN and MANAGER can create
    checkPlanLimits,
    validate(createProjectSchema),
    createProject,
  );

router
  .route("/:projectId")
  .patch(
    authorize("ADMIN", "MANAGER"), // Only ADMIN and MANAGER can update
    updateProject,
  )
  .delete(
    authorize("ADMIN"), // Only ADMIN can delete
    deleteProject,
  );

export const projectRouter = router;
