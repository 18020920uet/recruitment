import { UnsupportedMediaTypeException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const saveAvatarStorage = {
  storage: diskStorage({
    destination: 'public/avatars',
    filename: (req, file, cb) => {
      const fileExtensions: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtensions;
      const mimetype = file.mimetype;
      if (['image/png', 'image/jpeg', 'image/jpg'].includes(mimetype)) {
        cb(null, fileName);
      } else {
        cb(new UnsupportedMediaTypeException('File extensions must be .png, .jpg or .jpeg'), null);
      }
    },
  }),
};
