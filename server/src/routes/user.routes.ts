import { Router } from "express";
import { UserController } from "../controllers/user.controller";

export class UserRoutes {
  public router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    
    const userCtrl = new UserController();
    this.router.get("/auth", (req, res) => userCtrl.fetchUsers(req, res));
    this.router.post("/auth", (req, res) => userCtrl.createUser(req, res));
  }
}

export default new UserRoutes().router;
