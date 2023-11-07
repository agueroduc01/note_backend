import { Router } from "express";
import middlewares from '../middlewares'
import imageServices from "../services/imageServices";
import { query } from "express-validator";

const router = Router();

router.get("/get-image-details", [middlewares.handleRateLimit, middlewares.verifyAccessToken], 
    query(["noteId", "imageId"]).trim().notEmpty(),
    imageServices.getImageDetails);



export default router;