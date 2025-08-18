import multer from "multer";
import express from 'express';
import { CreateProduct, DeleteProduct, GetProductByDepartment, GetProductDetails, UpdateProduct, UpdateProductQty } from "../Controller/Product.js";





const storagePro = multer.diskStorage({
  destination: "uploadPro/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const uploadPro = multer({ storage: storagePro });

const router = express.Router();

router.post("/product", uploadPro.array("images"), CreateProduct);
router.put("/product", uploadPro.array("images"), UpdateProduct);      
router.put("/UpdateProductQty", UpdateProductQty);                        
router.delete("/product", DeleteProduct);
router.get("/product", GetProductByDepartment);       
router.get("/productDetails", GetProductDetails);  

export default router;
