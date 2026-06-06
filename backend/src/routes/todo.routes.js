import { Router } from "express"
import { getTodos, getTodo, createTodo, updateTodo, deleteTodo } from "../controllers/todo.controller.js"
import { protect, authorizeRoles } from "../middlewares/auth.middleware.js"
import { validate } from "../middlewares/validate.middleware.js"
import { createTodoSchema, updateTodoSchema } from "../validators/todo.validator.js"

const router = Router()

router.use(protect)

router.get("/", getTodos)
router.get("/:id", getTodo)
// /:userId o'rniga oddiy POST / — hamma o'ziga yarata oladi
router.post("/", validate(createTodoSchema), createTodo)
router.put("/:id", validate(updateTodoSchema), authorizeRoles(["admin"], "Faqat admin todo ni o'zgartira oladi"), updateTodo)
router.delete("/:id", authorizeRoles(["admin"], "Faqat admin todo ni o'chira oladi"), deleteTodo)

export default router
