import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import { AuthMiddleware } from "../middleware/jwt.middleware";
import mongoose from "mongoose";

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

  public async updateUsers(req: Request, res: Response): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { newUsers, updatedUsers, deletedUsers }: 
  { newUsers?: IUser[]; updatedUsers?: IUser[]; deletedUsers?: IUser[] } = req.body;

      if (!newUsers && !updatedUsers) {
        res.status(400).json({ message: "Request body must contain newUsers or updatedUsers" });
        return;
      }

      const results: IUser[] = [];

      // ✅ Handle newly added users
      if (Array.isArray(newUsers) && newUsers.length > 0) {
        for (const u of newUsers) {
          if (!u.userId || !u.name || !u.email) {
            throw new Error("New user must have userId, name, and email");
          }
          u.password = this.generateRandomPassword(); // assign random password
          const created = await User.create([u], { session });
          results.push(created[0]);
        }
      }

      // ✅ Handle updated users
      if (Array.isArray(updatedUsers) && updatedUsers.length > 0) {
        for (const u of updatedUsers) {
          if (!u._id) {
            throw new Error("Updated user must contain _id");
          }
          const updated = await User.findOneAndUpdate({ _id: u._id }, u, {
            new: true,
            runValidators: true,
            session,
          });
          if (updated) results.push(updated);
        }
      }

    if (Array.isArray(deletedUsers) && deletedUsers.length > 0) {
      for (const u of deletedUsers) {
        if (!u._id) throw new Error("Deleted user must contain _id");
        await User.deleteOne({ _id: u._id }, { session });
      }
     }

      // ✅ Commit if all succeeded
      await session.commitTransaction();
      session.endSession();

      res.status(200).json({
        message: "Users processed successfully",
        count: results.length,
        data: results,
      });
    } catch (error: any) {
      // ❌ Rollback on error
      await session.abortTransaction();
      session.endSession();

      console.error("Error saving users:", error);
      res.status(500).json({
        message: "Error saving users",
        error: error.message || "Unexpected error",
      });
    }
  }


private generateRandomPassword(length = 10): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
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
