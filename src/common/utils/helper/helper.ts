import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import { User } from '@prisma/client';

export const multerStorage = (folder: string) =>
  diskStorage({
    destination: `./uploads/${folder}`,
    filename: (req, file, cb) => {
      const ext = extname(file.originalname);
      cb(null, `${uuidv4()}${ext}`);
    },
  });

export const multerStorages = () =>
  diskStorage({
    destination: (req, file, cb) => {
      let folder = './uploads/others';
      if (file.fieldname === 'banner') folder = './uploads/banner';
      if (file.fieldname === 'introVideo') folder = './uploads/introVideo';

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
export const videoStorage = {
  storage: diskStorage({
    destination: './uploads/videos',
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}${extname(file.originalname)}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/mkv', 'video/avi'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed!'), false);
    }
  },
};
export const fileStorage = {
  storage: diskStorage({
    destination: './uploads/files',
    filename: (req, file, cb) => {
      cb(null, `${uuidv4()}${extname(file.originalname)}`);
    },
  }),
};
export const homeworkFile = {
  storage: diskStorage({
    destination: './uploads/homeworkFile',
    filename: (req, file, cb) => {
      const unique = uuidv4();
      cb(null, unique + extname(file.originalname));
    },
  }),
};
export const questionFile = {
  storage: diskStorage({
    destination: './uploads/questionFile',
    filename: (req, file, cb) => {
      const unique = uuidv4();
      cb(null, unique + extname(file.originalname));
    },
  }),
};
export const questionAnswerFile = {
  storage: diskStorage({
    destination: './uploads/questionAnswerFile',
    filename: (req, file, cb) => {
      const unique = uuidv4();
      cb(null, unique + extname(file.originalname));
    },
  }),
};
export enum EVeriification {
  REGISTER = 'register',
  RESET_PASSWORD = 'reset_password',
  EDIT_PHONE = 'edit_phone',
}
export interface ICheckOtp {
  type: EVeriification;
  phone: string;
  otp: string;
}
export function generateOtp(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}
export interface SMSPayload {
  mobile_phone: string;
  message: string;
  from: string;
  callback_url: string;
}
export interface SMSSendResponse {
  id: string;
  status: string;
  message: string;
}



export enum PaymeMethods {
  CheckPerformTransaction = 'CheckPerformTransaction',
  CreateTransaction = 'CreateTransaction',
  PerformTransaction = 'PerformTransaction',
  CancelTransaction = 'CancelTransaction',
  CheckTransaction = 'CheckTransaction',
  GetStatement = 'GetStatement',
}

export enum PaymeErrorCode {
  NOT_POST_REQUEST = -32300,
  INVALID_JSON = -32700,
  REQUIRED_FIELD_NOT_FOUND = -32600,
  INVALID_METHOD_NAME = -32601,
  INSUFFICIENT_PRIVILEGES = -32504,
  SYSTEM_ERROR = -32400,
  INVALID_AMOUNT = -31001,
  INVALID_ACCOUNT = -31050,
  TRANSACTION_NOT_FOUND = -31003,
  CANNOT_PERFORM_OPERATION = -31008,
  CANNOT_CANCEL_TRANSACTION = -31007,
}

export enum PaymeTransactionState {
  CREATED = 1,
  COMPLETED = 2,
  CANCELLED = -1,
  CANCELLED_AFTER_PAYMENT = -2,
}

export enum PaymeTransactionReason {
  RECEIVERS_INACTIVE = 1,
  DEBIT_OPERATION_ERROR = 2,
  EXECUTION_ERROR = 3,
  TIMEOUT = 4,
  REFUND = 5,
  UNKNOWN_ERROR = 10,
}

export interface PaymeAccountRecord {
  course_id: string;
  user_id: string;
}

export interface PaymeRequest<
  T = PaymeRequestParams[
  | PaymeMethods.CheckPerformTransaction
  | PaymeMethods.CheckTransaction
  | PaymeMethods.GetStatement
  | PaymeMethods.CancelTransaction
  | PaymeMethods.CreateTransaction
  | PaymeMethods.PerformTransaction],
> {
  method: PaymeMethods;
  params: T;
  id?: number;
}

export interface PaymeResponse<T> {
  result: T;
  id?: number;
}

export interface PaymeErrorResponse {
  error: {
    code: number | PaymeErrorCode;
    message: {
      ru: string;
      uz: string;
      en: string;
    };
    data?: keyof PaymeAccountRecord;
  };
  id?: number;
}

export interface PaymeTransactionReceiver {
  id: string;
  amount: number;
}

export interface PaymeTransaction<T = PaymeAccountRecord> {
  id: string;
  time: number;
  amount: number;
  account: T;
  create_time: number;
  perform_time: number;
  cancel_time: number;
  transaction: string;
  state: PaymeTransactionState;
  reason: PaymeTransactionReason | null;
  receivers?: PaymeTransactionReceiver[] | null;
}

export interface PaymeRequestParams {
  [PaymeMethods.CheckPerformTransaction]: {
    amount: number;
    account: PaymeAccountRecord;
  };
  [PaymeMethods.CreateTransaction]: {
    id: string;
    time: number;
    amount: number;
    account: PaymeAccountRecord;
  };
  [PaymeMethods.PerformTransaction]: {
    id: string;
  };
  [PaymeMethods.CancelTransaction]: {
    id: string;
    reason: PaymeTransactionReason;
  };
  [PaymeMethods.CheckTransaction]: {
    id: string;
  };
  [PaymeMethods.GetStatement]: {
    from: number;
    to: number;
  };
}

export interface PaymeResponses {
  [PaymeMethods.CheckPerformTransaction]: {
    allow: boolean;
    additional?: Record<string, string | number>;
    detail?: {
      receipt_type?: number; // fiscal cheque type
      shipping?: {
        title: string;
        price: number;
      };
      items?: {
        // Items required when receipt_type defined
        discount: number;
        title: string;
        price: number;
        count: number;
        code: string;
        units: number;
        vat_percent: number;
        package_code: string;
      }[];
    };
  };
  [PaymeMethods.CreateTransaction]: {
    create_time: number;
    transaction: string;
    state: PaymeTransactionState;
    receivers?: PaymeTransactionReceiver[] | null;
  };
  [PaymeMethods.PerformTransaction]: {
    transaction: string;
    perform_time: number;
    state: PaymeTransactionState;
  };
  [PaymeMethods.CancelTransaction]: {
    transaction: string;
    cancel_time: number;
    state:
    | PaymeTransactionState
    | PaymeTransactionState.CANCELLED_AFTER_PAYMENT;
  };
  [PaymeMethods.CheckTransaction]: {
    create_time: number;
    perform_time: number;
    cancel_time: number;
    transaction: string;
    state: PaymeTransactionState | PaymeTransactionState.COMPLETED;
    reason: PaymeTransactionReason | null;
  };
  [PaymeMethods.GetStatement]: {
    transactions: PaymeTransaction[];
  };
}



export function amountToPenny(amount: number): number {
  return amount * 100;
}

export function pennyToAmount(penny: number): number {
  return penny / 100;
}

export type TAuthUser = Omit<User, 'password'>;



export function getFutureTime(seconds: number) {
  const date = new Date();
  date.setSeconds(new Date().getSeconds() + seconds);
  return date;
}

export function getPastTime(seconds: number) {
  const now = new Date();
  return new Date(now.getTime() - seconds * 1000);
}

export function secToMills(seconds: number) {
  return seconds * 1000;
}
export function getInMills(date: string | number | Date | null | undefined): number {
  return date ? new Date(date).getTime() : 0;
}


export function validateWithinMinutes(date: Date, minute: number): boolean {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - date.getTime();
  return timeDifference <= minute * 60000;
}
