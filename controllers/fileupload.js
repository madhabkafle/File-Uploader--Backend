const File = require("../models/File")
const cloudinary = require("cloudinary").v2
// localfileupload - >create handlerfunction

exports.localFileUpload = async(req,res) =>{
    try{
        //fetch file
        const file = req.files.file;
        console.log("FILE IS HERE",file);
        let path = __dirname + "/files/" + Date.now() + `.${file.name.split('.')[1]}`;
        console.log("PATH->",path)
        file.mv(path,(err)=>{
            console.log(err);
        });
        res.json({
            success:true,
            message:'Local File Uploaded Successfully',
        });
    }
    catch(error){
        console.log(error);
    }
}
function isFileTypeSupported(type, supportedTypes){
    return supportedTypes.includes(type);
}
async function uploadFileToCloudinary(file, folder,quality){
    const options = {folder};
    if(quality){
        options.quality = quality
    }
    options.resource_type = "auto"
    return await cloudinary.uploader.upload(file.tempFilePath, options);
}
//image upload handler
exports.imageUpload = async (req,res) =>{
    try{
        //data fetch
        const {name, tags, email} = req.body;
        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("file type",fileType)
        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"file format supported",
            })
        }
        //file format supported
        const response = await uploadFileToCloudinary(file,"Mysamples");
        console.log(response);
        //save entry in db
        const filedata = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,   
             })
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"image successfully uploaded"

        })

    }catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:" something went wrong",
        });
    }
}
//video upload handler
exports.videoUpload = async(req,res)=>{
    try{
        //data fetch
        const {name, tags,email} =req.body;
        console.log(name,tags,email);
        const file = req.files.videoFile;
        //validation
        const supportedTypes = ["mp4","mov"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("File Type", fileType);
        //TODO : ADD A UPPER LIMIT OF 5MP FOR VIDEO

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"FileFormatNotSupported",
            })
        }
        //file format supported
        const response = await uploadFileToCloudinary(file,"Mysamples");
        console.log(response);
        //save entry in db
        const filedata = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,   
             })
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"video successfully uploaded"

        })
    }
    catch(error){
        res.status(400).json({
            success:false,
            message:"something went wrong",
        })
    }
}

exports.imageSizeReducer = async (req,res) =>{
    try{
        //data fetch
        const {name, tags, email} = req.body;
        const file = req.files.imageFile;
        console.log(file);

        //validation
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split('.')[1].toLowerCase();
        console.log("file type",fileType)

        if(!isFileTypeSupported(fileType, supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"file format supported",
            })
        }
        //file format supported
        const response = await uploadFileToCloudinary(file,"Mysamples",50);
        console.log(response);
        //save entry in db
        const filedata = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,   
             })
        res.json({
            success:true,
            imageUrl:response.secure_url,
            message:"image successfully uploaded"

        })

    }catch(error){
        console.error(error);
        res.status(400).json({
            success:false,
            message:" something went wrong",
        });
    }
}