import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import UniversityRoutes from './Routes/UniversityRoutes.js';
import DepartmentRoutes from './Routes/DepartmentRoutes.js';
import ProductRoutes from './Routes/ProductRoutes.js';
import OrderHDRoutes from './Routes/OrderHDRoutes.js';
import UserRoutes from './Routes/UserRoutes.js';
import session from 'express-session';


dotenv.config();

const app = express();
app.use(express.json());


app.use(cors({
  origin: "http://localhost:3000",  
  credentials: true                
}));

app.use(session({
  secret: '5612439517f394d75aff8cae03bb1f45ab07ab5bd60d67e2c305a4c4dfcc2969',
  resave: false,
  saveUninitialized: false,  
  cookie: {
    secure: false,           
    httpOnly: true,          
    maxAge: 1000 * 60 * 60 * 24 
  }
}));


// Routes.
app.use('/api', UniversityRoutes);
app.use('/api', DepartmentRoutes);
app.use('/api', ProductRoutes);
app.use('/api', OrderHDRoutes);
app.use('/api', UserRoutes);


// Serve static files
app.use('/uploads/university', express.static('uploadUniv'));
app.use('/uploads/department', express.static('uploadDep'));
app.use('/uploads/product', express.static('uploadPro'));




mongoose.connect(process.env.DB_URL)
    .then(()=>{
    app.listen(process.env.PORT, ()=>{
    console.log("Server is running on port : ",process.env.PORT);
});
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Error connecting to MongoDB", error);
})