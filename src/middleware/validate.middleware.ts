import type { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";
import type { ZodIssue } from "zod";

export const validate = (schema: ZodObject<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = err.issues.map((e: ZodIssue) => ({
          field: e.path[e.path.length - 1], 
          message: e.message,
        }));

        return res.status(400).json({
          message: "Validation failed",
          errors,
        });
      }

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
};