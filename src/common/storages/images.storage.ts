import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { UnsupportedMediaTypeException } from '@nestjs/common';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export const imagesOfUsersStorage: MulterOptions = {
  storage: diskStorage({
    destination: (_req, file, cb) => {
      if (file.fieldname == 'avatar') {
        cb(null, 'public/avatars');
      }
    },
    filename: (_req, file, cb) => {
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

export const imagesOfCompaniesStorage: MulterOptions = {
  storage: diskStorage({
    destination: (_req, file, cb) => {
      if (file.fieldname == 'logo') {
        cb(null, 'public/companies/logos');
      } else if (file.fieldname == 'photos') {
        cb(null, 'public/companies/photos');
      }
    },
    filename: (_req, file, cb) => {
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
