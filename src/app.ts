import express from "express";
import router from "./routes";
import cors from "cors";
import { ENV } from "@/config";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

const app = express();

app.use(express.json());

const corsOptions = {
  origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(helmet());
app.use(morgan("dev"));

app.use(router);

export default app;
