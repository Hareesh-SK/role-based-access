import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { AuthMiddleware } from "../middleware/jwt.middleware";

const router = Router();
const userController = new UserController();
const auth = new AuthMiddleware();

router.post("/login", (req, res) => userController.login(req, res));
router.get("/users", auth.verifyToken.bind(auth), (req, res) => userController.getAllUsers(req, res));
router.post("/users", (req, res) => userController.updateUsers(req, res));

export default router;
