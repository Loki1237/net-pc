import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files/photo");
    },
    filename: async (req, file, cb) => {
        const uid = uuidv4();
        cb(null, `${uid}${path.extname(file.originalname)}`);
    }
});

const photoFilter = (req: Request, file: any, cb: any) => {
    const type = file.mimetype;
  
    if (type === "image/png" || type === "image/jpg"|| type === "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const photoLoader = multer({ storage: storageConfig, fileFilter: photoFilter });

export default photoLoader;
