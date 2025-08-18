import multer from "multer";
import express from 'express';
import { CreateDepartment, DeleteDepartment, GetDepartment, UpdateDepartment } from "../Controller/Department.js";


const storageDep = multer.diskStorage({
    destination: "uploadDep/",
    filename:(req, file, cb)=>{
        cb(null, `${Date.now()}--${file.originalname}`);
    },
});

const uploadDep = multer({
    storage: storageDep,
});

const router = express.Router();

router.post("/department", uploadDep.single("image"), CreateDepartment);
router.put("/department", uploadDep.single("image"), UpdateDepartment);
router.get("/department", GetDepartment);
router.delete("/department", DeleteDepartment);

export default router;