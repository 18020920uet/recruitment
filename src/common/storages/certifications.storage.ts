import { UnsupportedMediaTypeException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const saveCertificationsStorage: MulterOptions = {
  storage: diskStorage({
    destination: 'public/certifications',
    filename: (req, file, cb) => {
      const fileExtensions: string = path.extname(file.originalname);
      const fileName: string = uuidv4() + fileExtensions;
      const mimetype = file.mimetype;
      if (['image/png', 'application/pdf'].includes(mimetype)) {
        cb(null, fileName);
      } else {
        cb(new UnsupportedMediaTypeException('File extensions must be .png, .pdf'), null);
      }
    },
  }),
}
