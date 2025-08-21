import express from "express";
import cors from "cors";
import connectDB from "./config/db";
import userRoutes from "./routes/user.routes";

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Connect DB & Start Server
connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
