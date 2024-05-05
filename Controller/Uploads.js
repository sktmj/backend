
import pool from "../config/db.js";
import multer from "multer";
import fs from 'fs';
import path from 'path';


const __dirname = path.resolve();



export const uploadProfilePic = (req,res)=>{
    try {
        const{AppId} =req.session;
        console.log("Profile pic upload successfully",req.file)
        if(!req.file){
            return res.status(400).json({success:false,message:"No file uploaded"});
        }
        const fileName = req.file.originalname;
        const filePath = path.join(__dirname,'public','uploads',fileName);
        console.log("File path:", filePath)
        fs.access(filePath, fs.constants.F_OK, async(err)=>{
        if(err){
            console.error("File not found:",err)
            return res.status(404).json({success:false,message:"File not found"});
        }
        try{
            const query = `UPDATE ApplicationForm SET Pic = @Pic WHERE AppId = @AppId`;
            const request = pool.request();
            request.input("Pic",fileName);
            request.input("AppId",AppId);
            const result = await request.query(query)
            if(result.rowsAffected[0] > 0){
                console.log("File name updated successfully in the database");
                res.status(200).json({success:true,message:"File name updated successfully in the database", fileName})
            }else {
                console.error("Failed to update database");
                res.status(404).json({ success: false, message: "Failed to update database" });
            }
        } catch (error) {
            console.error("Error updating database:", error.message);
            res.status(500).json({ success: false, message: "Error updating database" });
        }
    });
} catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
}
};


export const uploadMobilePic = (req,res)=>{
    try {
        const{AppId} =req.session;
        console.log("Mobile Pic upload successfully",req.file)
        if(!req.file){
            return res.status(400).json({success:false,message:"No file uploaded"});
        }
        const fileName = req.file.originalname;
        const filePath = path.join(__dirname,'public','uploads',fileName);
        console.log("File path:", filePath)
        fs.access(filePath, fs.constants.F_OK, async(err)=>{
        if(err){
            console.error("File not found:",err)
            return res.status(404).json({success:false,message:"File not found"});
        }
        try{
            const query = `UPDATE ApplicationForm SET MobilePic = @MobilePic WHERE AppId = @AppId`;
            const request = pool.request();
            request.input("MobilePic",fileName);
            request.input("AppId",AppId);
            const result = await request.query(query)
            if(result.rowsAffected[0] > 0){
                console.log("File name updated successfully in the database");
                res.status(200).json({success:true,message:"File name updated successfully in the database", fileName})
            }else {
                console.error("Failed to update database");
                res.status(404).json({ success: false, message: "Failed to update database" });
            }
        } catch (error) {
            console.error("Error updating database:", error.message);
            res.status(500).json({ success: false, message: "Error updating database" });
        }
    });
} catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
}
};


export const uploadResume = (req,res)=>{
    try {
        const{AppId} =req.session;
        console.log("Resume upload successfully",req.file)
        if(!req.file){
            return res.status(400).json({success:false,message:"No file uploaded"});
        }
        const fileName = req.file.originalname;
        const filePath = path.join(__dirname,'public','uploads',fileName);
        console.log("File path:", filePath)
        fs.access(filePath, fs.constants.F_OK, async(err)=>{
        if(err){
            console.error("File not found:",err)
            return res.status(404).json({success:false,message:"File not found"});
        }
        try{
            const query = `UPDATE ApplicationForm SET ResumeFileName = @ResumeFileName WHERE AppId = @AppId`;
            const request = pool.request();
            request.input("ResumeFileName",fileName);
            request.input("AppId",AppId);
            const result = await request.query(query)
            if(result.rowsAffected[0] > 0){
                console.log("File name updated successfully in the database");
                res.status(200).json({success:true,message:"File name updated successfully in the database", fileName})
            }else {
                console.error("Failed to update database");
                res.status(404).json({ success: false, message: "Failed to update database" });
            }
        } catch (error) {
            console.error("Error updating database:", error.message);
            res.status(500).json({ success: false, message: "Error updating database" });
        }
    });
} catch (error) {
    console.error("Error uploading file:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
}
};
