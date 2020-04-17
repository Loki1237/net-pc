import path from 'path';
import multer from 'multer';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "files/audio");
    },
    filename: async (req, file, cb) => {
        const uid = `${uuidv4()}-${req.params.userId}`;
        cb(null, `${uid}${path.extname(file.originalname)}`);
    }
});

const songFilter = (req: Request, file: any, cb: any) => {
    const type = file.mimetype;
  
    if (type === "audio/oog" || type === "audio/mpeg") {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const audioLoader = multer({ storage: storageConfig, fileFilter: songFilter });

export default audioLoader;
