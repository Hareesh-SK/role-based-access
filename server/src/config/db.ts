import mongoose from "mongoose";

class Database {
  private uri: string;

  constructor() {
    this.uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/role_based_access";
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log("✅ MongoDB connected");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("🛑 MongoDB disconnected");
    } catch (error) {
      console.error("❌ MongoDB disconnection failed:", error);
    }
  }

  public status(): string {
    return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  }
}

export default new Database();
