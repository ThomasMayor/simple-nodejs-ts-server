declare const process:any;

export const SECRET_TOKEN_KEY: string = 'secret token key';
export const DB_HOST: string = 'mongodb://host:port';
export const DB_NAME: string = process.env.NODE_ENV == 'test' ? 'testnode' : 'node';
export const BCRYPT_ROUND: number = 6;
export const PASSWORD_MIN_LENGHT: number = 6;
export const JWT_EXPIRE: number = 864000; //10 days
 
