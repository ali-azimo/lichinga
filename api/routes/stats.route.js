import express from "express";
import {
  getPlatformStats,
  getPropertyTypeStats,
  getCityStats
} from "../controllers/stats.Controller.js";

const router = express.Router();

// Estatísticas gerais da plataforma
router.get("/", getPlatformStats);

// Estatísticas por tipo de propriedade
router.get("/property-types", getPropertyTypeStats);

// Estatísticas por cidade
router.get("/cities", getCityStats);

export default router;