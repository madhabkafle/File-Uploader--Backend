const mongoose = require("mongoose")
const nodemailer = require("nodemailer")
const fileschema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    tags:{
        type:String,
    },
    email:{
        type:String,
    }
});
//post middleware
fileschema.post("save",async function(doc){
    try{
        console.log("DOC",doc)
        //transpoter
        let transporter = nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        })
        let info=await transporter.sendMail({
            from:`Madhab Kafle`,
            to:doc.email,
            subject:"New file uploaded in cloudinary",
            html:`<h2>Hello</h2><p>File Uploaded</p><br> View here <a href = ${doc.imageUrl}>File</a>`,
        })
        console.log("INFO",info)
    }catch(error){
        console.error(error)
    }
})
const File = mongoose.model("File",fileschema);
module.exports= File;