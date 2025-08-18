import DepartmentModels from "../Models/Department.js";
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';

const deleteDepImageFile = (filename) => {
    if (!filename) return;
    const filePath = path.join(process.cwd(), 'uploadDep', filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                } else {
                    console.log(`Deleted department image: ${filename}`);
                }
            });
        } else {
            console.warn(`Department image not found for deletion: ${filePath}`);
        }
    });
};

export const CreateDepartment = async (req, res) =>{
    try{
            const depData = await DepartmentModels.create({
            name: req.body.name,
            image: req?.file?.filename,
            university: req.body.universityId,
        });
        if(depData) res.status(201).send({message: "Department created successfully"});
        else res.status(400).send({message: "Failed to create Department"});
    }
    catch(error){
        console.log("Fail to submit data");
    }
};

export const UpdateDepartment = async (req, res) => {
    try {
        const { _id, name, universityId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ message: "Invalid department ID" });
        }

        const existingDep = await DepartmentModels.findById(_id);
        if (!existingDep) {
            return res.status(404).send({ message: "Department not found" });
        }

        
        if (req?.file?.filename && existingDep.image) {
            deleteDepImageFile(existingDep.image);
        }

        const updatePayload = {
            name,
            university: universityId,
        };

        if (req?.file?.filename) {
            updatePayload.image = req.file.filename;
        }

        const updatedDep = await DepartmentModels.findByIdAndUpdate(_id, updatePayload, {
            new: true,
        });

        res.status(200).send({ message: "Department updated successfully", data: updatedDep });
    } catch (error) {
        console.error("Fail to update department:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};


export const DeleteDepartment = async (req, res) => {
    try {
        const { _id } = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ message: "Invalid department ID" });
        }

        const existingDep = await DepartmentModels.findById(_id);
        if (!existingDep) {
            return res.status(404).send({ message: "Department not found" });
        }

        // Delete associated image
        if (existingDep.image) {
            deleteDepImageFile(existingDep.image);
        }

        await DepartmentModels.deleteOne({ _id });

        res.status(200).send({ message: "Department deleted successfully" });
    } catch (error) {
        console.error("Fail to delete department:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const GetDepartment = async (req, res) =>{
    try{
        const depData = await DepartmentModels.find({university: req.query.universityId,
        }).populate("university");
        if(depData) res.status(200).send({depData});
    }
    catch(error){
        console.log("Fail to submit data");
    }
};