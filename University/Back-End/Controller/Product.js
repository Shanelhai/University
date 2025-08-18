import ProductModels from "../Models/Product.js";
import fs from 'fs';
import path from 'path';



const deleteProductImageFile = (filename) => {
    if (!filename) return;
    const filePath = path.join(process.cwd(), 'uploadPro', filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting product image:", err);
                } else {
                    console.log(`Deleted product image: ${filename}`);
                }
            });
        } else {
            console.warn(`Product image not found: ${filePath}`);
        }
    });
};


export const CreateProduct = async (req, res) => {
    try {
        let images = req?.files?.map((item) => {
            return item.filename;
        });

        const proData = await ProductModels.create({
            name: req.body.name,
            description: req.body.description,
            qty: req.body.qty,
            price: req.body.price,
            images: images,
            department: req.body.departmentId,
            active: true
        });

        if (proData) {
            res.status(201).send({ message: "Product created successfully" });
        } else {
            res.status(400).send({ message: "Failed to create Product" });
        }
    } catch (error) {
        console.log(error);
    }
};

export const UpdateProduct = async (req, res) => {
  try {
    const { _id, name, description, qty, price, departmentId } = req.body;
    const newImages = req?.files?.map(file => file.filename); 
    const existingProduct = await ProductModels.findById(_id);
    if (!existingProduct) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Delete old images if new ones are uploaded
    if (newImages?.length > 0 && existingProduct.images?.length > 0) {
      existingProduct.images.forEach((img) => {
        deleteProductImageFile(img);
      });
    }

    const updatedProduct = await ProductModels.findOneAndUpdate(
      { _id },
      {
        name,
        description,
        qty,
        price,
        department: departmentId,
        images: newImages?.length > 0 ? newImages : existingProduct.images,
      },
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).send({ message: "Product updated successfully", data: updatedProduct });
    } else {
      res.status(400).send({ message: "Failed to update product" });
    }
  } catch (error) {
    console.error("Failed to update product:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const product = await ProductModels.findById(req.body._id);
    if (!product) {
      return res.status(404).send({ message: "Product not found" });
    }

    // Delete associated images
    if (product.images?.length > 0) {
      product.images.forEach((img) => {
        deleteProductImageFile(img);
      });
    }

    await ProductModels.findByIdAndDelete(req.body._id);

    res.status(200).send({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Failed to delete product:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};


export const GetProductByDepartment = async (req, res) =>{
    try{
        const proDate = await ProductModels.find(
        {department: req.query.departmentId}).populate({path: "department", populate: [{path: "university"}]});
        res.status(200).send({proDate});
    }
    catch(error){
          console.log("Fail to submit data");
    }
};
export const GetProductDetails = async (req, res) => {
  try {
    const productData = await ProductModels.findOne(
      { _id: req.query.productId } 
    ).populate({ path: "department", populate: [{ path: "university" }] });

    if (productData) {
      res.status(200).send({ proData: productData }); 
    } else {
      res.status(404).send({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    res.status(500).send({ message: "Internal Server Error" });
  }
};

export const UpdateProductQty = async (req, res) =>{
    try{
       let productInDb = await ProductModels.findOne({_id: req.body.id});
       let active = true;
       if(productInDb.qty - req.body.qty <= 0) active = false;
       let proDate = await ProductModels.findByIdAndUpdate(
        {_id: req.body.id},
        {
            qty: productInDb.qty - req.body.qty,
            active: active,
        }
       );
        if(proDate) res.status(200).send({message: "Product  qty successfully"});
        else res.status(400).send({message: "Failed to qty Product"});
    }
    catch(error){
          console.log("Fail to submit data");
    }
};
