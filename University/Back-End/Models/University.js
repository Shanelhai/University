import mongoose from "mongoose";

const UniversitySchema = new mongoose.Schema({
   name:{
    type:String,
    required:true,
   },
    image:{
    type:String,
    required:true,
   }
},
    {timestamps: true},

);

const UniversityModels = mongoose.model("university", UniversitySchema);
export default UniversityModels;