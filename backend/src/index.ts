import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
const app = express();
const PORT = process.env.PORT || 3000;

//middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

//Routes
app.use("/api/auth", authRoutes);

//health check
app.get("/api/ping", (req, res) => {
  res.json({ message: "Sentinel API is running", timestamp: new Date() });
});

//error handling middleware
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error("Error:", err);
    res.status(err.status || 500).json({ error: "Internal Server Error" });
  },
);

app.listen(PORT, () => {
  console.log(`Sentinel API is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
