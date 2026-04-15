import { Request, Response } from "express";

export const rootHandler = (_req: Request, res: Response) => {
  res.json({
    name: "backend",
    type: "monolith",
    version: "1.0.0",
    status: "running",
    endpoints: {
      health: "/api/v1/health",
      classify: "/api/classify?name={name}",
    },
  });
};
