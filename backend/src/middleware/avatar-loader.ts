import path from 'path';
import multer from 'multer';
import { Request } from "express";

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files/avatars");
    },
    filename: (req, file, cb) => {
        cb(null, `id:${req.params.id}${path.extname(file.originalname)}`);
    }
});

const imageFilter = (req: Request, file: any, cb: any) => {
    const type = file.mimetype;
  
    if (type === "image/png" || type === "image/jpg"|| type === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const avatarLoader = multer({ storage: storageConfig, fileFilter: imageFilter });

export default avatarLoader;