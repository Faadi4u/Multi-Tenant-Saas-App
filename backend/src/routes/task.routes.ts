import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.ts";
import { authorize } from "../middlewares/rbac.middleware.ts";
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.ts";
import { validate } from "../middlewares/validate.middleware.ts";
import { createTaskSchema } from "../validators/task.validator.ts";

const router = Router();
router.use(verifyJWT);

router.route("/").post(
  authorize("ADMIN", "MANAGER"), // Only ADMIN and MANAGER can create tasks
  validate(createTaskSchema),
  createTask,
);

router.route("/project/:projectId").get(getTasksByProject);

router
  .route("/:taskId")
  .patch(updateTask) // Anyone can update (but controller enforces ownership)
  .delete(
    authorize("ADMIN", "MANAGER"), // Only ADMIN and MANAGER can delete
    deleteTask,
  );

export const taskRouter = router;
