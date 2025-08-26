import { Request, Response } from "express";
import User from "../models/user.model";
import { AuthMiddleware } from "../middleware/jwt.middleware";

export class UserController {
  private auth: AuthMiddleware;

  constructor() {
    this.auth = new AuthMiddleware();
  }

  public async login(req: Request, res: Response): Promise<void> {
    try {
      const { userId, password } = req.body;

      if (!userId || !password) {
        res.status(200).json({ message: "userId and password are required" });
        return;
      }

      const user = await User.findOne({ userId, password });
      if (!user) {
        res.status(200).json({ message: "Invalid credentials" });
        return;
      }

      const token = this.auth.generateToken({
        userId: user.userId,
        role: user.role,
        name: user.name,
      });

      res.status(200).json({
        message: "Login successful",
        user: {
          userId: user.userId,
          name: user.name,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  }

  public async createUser(req: Request, res: Response): Promise<void> {
    try {
      const newUser = new User(req.body);
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Error creating user" });
    }
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  }
}
