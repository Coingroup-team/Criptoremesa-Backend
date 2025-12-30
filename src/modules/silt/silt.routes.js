import { Router } from "express";
import { getSiltRecords, getSiltById } from "./silt.controller";

const router = Router();

// Get all SILT records with pagination
router.get("/", getSiltRecords);

// Get single SILT record by ID
router.get("/:silt_id", getSiltById);

export default router;
