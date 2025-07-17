import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';

export const multerStorage = (folder: string) =>
    diskStorage({
        destination: `../uploads/${folder}`,
        filename: (req, file, cb) => {
            const ext = extname(file.originalname);
            cb(null, `${uuidv4()}${ext}`);
        },
    });



export const multerStorages = () =>
    diskStorage({
        destination: (req, file, cb) => {
            let folder = 'uploads/others';
            if (file.fieldname === 'banner') folder = 'uploads/banner';
            if (file.fieldname === 'introVideo') folder = 'uploads/introVideo';

            if (!fs.existsSync(folder)) {
                fs.mkdirSync(folder, { recursive: true });
            }

            cb(null, folder);
        },
        filename: (req, file, cb) => {
            const ext = extname(file.originalname);
            const filename = `${uuidv4()}${ext}`;
            cb(null, filename);
        },
    });
export enum EVeriification {
    REGISTER = 'register',
    RESET_PASSWORD = 'reset_password',
    EDIT_PHONE = 'edit_phone'
}
export interface ICheckOtp {
    type: EVeriification
    phone: string
    otp: string
}
export function generateOtp(): string {
    return String(Math.floor(10000 + Math.random() * 90000))
}
export interface SMSPayload {
    mobile_phone: string
    message: string
    from: string,
    callback_url: string
}
export interface SMSSendResponse {
    id: string,
    status: string,
    message: string
}