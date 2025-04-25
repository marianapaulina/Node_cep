import { Router } from "express";
import { storeCepAndAddToQueue, fetchCepById } from "./controllers/cep.controller.js";

export const router = Router();

router.post("/cep", storeCepAndAddToQueue);
router.get("/id/:id", fetchCepById);