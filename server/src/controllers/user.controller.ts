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

      const result = await this._login(userId, password);

      if (!result) {
        res.status(200).json({ message: "Invalid credentials" });
        return;
      }

      res.status(200).json(result);
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: "Error logging in" });
    }
  }

  private async _login(userId: string, password: string) {
    const user = await User.findOne({ userId, password });
    if (!user) return null;

    const token = this.auth.generateToken({
      userId: user.userId,
      role: user.role,
      name: user.name,
    });

    return {
      message: "Login successful",
      user: {
        userId: user.userId,
        name: user.name,
        role: user.role,
      },
      token,
    };
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

      const result = await this._updateUsers(newUsers, updatedUsers, deletedUsers, session);

      await session.commitTransaction();
      session.endSession();

      res.status(200).json(result);

    } catch (error: any) {
      await session.abortTransaction();
      session.endSession();

      if (error.code === 11000) {
        res.status(400).json({
          message: "Duplicate User Id found",
          field: "userId",
          value: error.keyValue?.userId
        });
        return;
      }

      res.status(500).json({
        message: "Error saving users",
        error: error.message || "Unexpected error",
      });
    }
  }

  private async _updateUsers(
    newUsers: IUser[] = [],
    updatedUsers: IUser[] = [],
    deletedUsers: IUser[] = [],
    session: mongoose.ClientSession
  ) {
    const results: IUser[] = [];

    if (newUsers.length > 0) {
      for (const u of newUsers) {
        if (!u.userId || !u.name || !u.email) {
          throw new Error("New user must have userId, name, and email");
        }
        u.password = this.generateRandomPassword(); // assign random password
        const created = await User.create([u], { session });
        results.push(created[0]);
      }
    }

    if (updatedUsers.length > 0) {
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

    if (deletedUsers.length > 0) {
      for (const u of deletedUsers) {
        if (!u._id) throw new Error("Deleted user must contain _id");
        await User.deleteOne({ _id: u._id }, { session });
      }
    }

    return {
      message: "Users processed successfully",
      count: results.length,
      data: results,
    };
  }

  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this._getAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Error fetching users" });
    }
  }

  private async _getAllUsers() {
    return await User.find();
  }

  private generateRandomPassword(length = 10): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }
}
