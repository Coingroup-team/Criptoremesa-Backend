import { Router } from "express";
import { getSiltRecords, getSiltById, getSiltImage } from "./silt.controller";

const router = Router();

// Get all SILT records with pagination
router.get("/", getSiltRecords);

// Serve SILT image (must be before /:silt_id to avoid route conflict)
router.get("/:silt_id/image/:filename", getSiltImage);

// Get single SILT record by ID
router.get("/:silt_id", getSiltById);

export default router;
