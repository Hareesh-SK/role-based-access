import mongoose from "mongoose";

class Database {
  private uri: string;

  constructor() {
    this.uri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/role_based_access?replicaSet=rs0";
    
  }

  public async connect(): Promise<void> {
    try {
      await mongoose.connect(this.uri);
      console.log("\x1b[32m%s\x1b[0m", "MongoDB connected");
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "MongoDB connection failed:", error);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await mongoose.disconnect();
      console.log("\x1b[31m%s\x1b[0m", "MongoDB disconnected");
    } catch (error) {
      console.error("\x1b[31m%s\x1b[0m", "MongoDB disconnection failed:", error);
    }
  }

  public status(): string {
    return mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  }
}

export default new Database();
