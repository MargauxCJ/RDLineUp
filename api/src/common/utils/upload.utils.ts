import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const uploadConfig = (folderPath: string) => {
  return {
    storage: diskStorage({
      destination: `./uploads/${folderPath}`,
      filename: (req, file, cb) => {
        const filename: string =
          path.parse(file.originalname).name.replace(/\s/g, '') + '-' + uuidv4();
        const extension: string = path.extname(file.originalname);
        cb(null, `${filename}${extension}`);
      },
    }),
  };
};
