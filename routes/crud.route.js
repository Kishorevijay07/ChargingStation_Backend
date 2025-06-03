import express from "express";
import protectroute from "../middleware/protectroute.js";
import {
  createStation,
  getStations,
  updateStation,
  deleteStation,
  getallsatations
} from "./../controller/crud.conroller.js";

const router = express.Router();

router.post("/", protectroute, createStation);
router.get("/", protectroute, getStations);
router.put("/:id", protectroute, updateStation);
router.delete("/:id", protectroute, deleteStation);
router.get("/all", protectroute, getallsatations); 

export default router;