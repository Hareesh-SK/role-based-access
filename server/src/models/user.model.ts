import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  userId: string;
  name: string;
  email: string;
  password: string;
  role: "Admin" | "General User";
  createdAt: Date;
  status: "active" | "inactive";
}

const userSchema = new Schema<IUser>({
  userId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Admin", "General User"], default: "General User" },
  createdAt: { type: Date, default: () => new Date() },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

export default mongoose.model<IUser>("User", userSchema);
