import multer from "multer";
import express from 'express';
import { CreateUniversity, DeleteUniversity, GetUniversity, UpdateUniversity } from "../Controller/University.js";





const storageUniv = multer.diskStorage({
    destination: "uploadUniv/",
    filename:(req, file, cb)=>{
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});

const uploadUniv = multer({
    storage: storageUniv,
});

const router = express.Router();

router.post("/university", uploadUniv.single("image"), CreateUniversity);
router.get("/university", GetUniversity);
router.put("/university", uploadUniv.single("image"), UpdateUniversity);
router.delete("/university", DeleteUniversity);

export default router;