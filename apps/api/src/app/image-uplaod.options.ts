import { diskStorage } from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { v4 } from 'uuid';

export const imageOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      cb(null, './images');
    },
    filename: (req, file, cb) => {
      var dir = './images';
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      const filename: string = v4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};
