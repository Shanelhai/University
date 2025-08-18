import UniversityModels from "../Models/University.js";
import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';


const deleteImageFile = (filename) => {
    if (!filename) return;
    const filePath = path.join(process.cwd(), 'uploadUniv', filename);
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error("Error deleting file:", err);
                } else {
                    console.log(`Deleted old image: ${filename}`);
                }
            });
        } else {
            console.warn(`File not found for deletion: ${filePath}`);
        }
    });
};


export const CreateUniversity = async (req, res) =>{
    try{
            const univData = await UniversityModels.create({
            name: req.body.name,
            image: req?.file?.filename,
        });
        if(univData) res.status(201).send({message: "University created successfully"});
        else res.status(400).send({message: "Failed to create university"});
    }
    catch(error){
        console.log("Fail to submit data");
    }
};

export const UpdateUniversity = async (req, res) => {
    try {
        const { _id, name } = req.body;

        if (!mongoose.Types.ObjectId.isValid(_id)) {
            return res.status(400).send({ message: "Invalid university ID" });
        }

        const existingUniv = await UniversityModels.findById(_id);
        if (!existingUniv) {
            return res.status(404).send({ message: "University not found" });
        }

        // Delete old image if a new one is uploaded
        if (req?.file?.filename && existingUniv.image) {
            deleteImageFile(existingUniv.image);
        }

        const updatePayload = {
            name,
        };

        if (req?.file?.filename) {
            updatePayload.image = req.file.filename;
        }

        const updatedUniv = await UniversityModels.findByIdAndUpdate(_id, updatePayload, {
            new: true,
        });

        res.status(200).send({ message: "University updated successfully", data: updatedUniv });
    } catch (error) {
        console.error("Fail to update university:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const DeleteUniversity = async (req, res) => {
    try {
        const univData = await UniversityModels.findById(req.body._id);
        if (!univData) {
            return res.status(404).send({ message: "University not found" });
        }

        // Delete image file
        if (univData.image) {
            deleteImageFile(univData.image);
        }

        await UniversityModels.findByIdAndDelete(req.body._id);

        res.status(200).send({ message: "University deleted successfully" });

    } catch (error) {
        console.error("Fail to delete university:", error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

export const GetUniversity = async (req, res) =>{
    try{
        const univData = await UniversityModels.find()
        if(univData) res.status(200).send({univData});
    }
    catch(error){
        console.log("Fail to submit data");
    }
};
