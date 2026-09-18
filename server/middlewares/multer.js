import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination : function (req, file, cb){
        cb(null, path.join(process.cwd(), "public"));
    },
    filename: function (req, file, cb){
        const filename =Date.now() + "-" + file.originalname;
        cb(null, filename)
    },
})

const  upload = multer({
    storage,
    limits: {fileSize : 5*1024*1024}, //5mb
});

export default upload;
