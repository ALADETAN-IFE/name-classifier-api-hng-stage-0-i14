import { Request, Response } from "express";
import {
  BadGatewayError,
  BadRequestError,
  InternalServerError,
  UnprocessableEntityError,
} from "@/utils";

type GenderizeResponse = {
  name: string;
  gender: "male" | "female" | null;
  probability: number;
  count: number;
};

const toValidatedName = (nameQuery: Request["query"]["name"]) => {
  if (typeof nameQuery === "undefined") {
    throw new BadRequestError("Missing or empty name parameter");
  }

  if (Array.isArray(nameQuery) || typeof nameQuery !== "string") {
    throw new UnprocessableEntityError("name must be a string");
  }

  const normalized = nameQuery.trim().toLowerCase();

  if (!normalized) {
    throw new BadRequestError("Missing or empty name parameter");
  }

  return normalized;
};

const fetchGenderizeData = async (name: string): Promise<GenderizeResponse> => {
  const url = `https://api.genderize.io?name=${encodeURIComponent(name)}`;

  let response: globalThis.Response;

  try {
    response = await fetch(url);
  } catch {
    throw new BadGatewayError("Failed to fetch data from upstream provider");
  }

  if (!response.ok) {
    throw new BadGatewayError("Failed to fetch data from upstream provider");
  }

  try {
    const payload = (await response.json()) as GenderizeResponse;
    return payload;
  } catch {
    throw new InternalServerError("Invalid upstream response format");
  }
};

export const classifyName = async (req: Request, res: Response) => {
  const normalizedName = toValidatedName(req.query.name);
  const upstreamData = await fetchGenderizeData(normalizedName);

  const probability = Number(upstreamData.probability ?? 0);
  const sampleSize = Number(upstreamData.count ?? 0);

  if (upstreamData.gender === null || sampleSize === 0) {
    throw new UnprocessableEntityError(
      "No prediction available for the provided name",
    );
  }

  const isConfident = probability >= 0.7 && sampleSize >= 100;

  return res.status(200).json({
    status: "success",
    data: {
      name: normalizedName,
      gender: upstreamData.gender,
      probability,
      sample_size: sampleSize,
      is_confident: isConfident,
      processed_at: new Date().toISOString(),
    },
  });
};
