
// import { ComponentInvoker } from "@bigbyte/utils/registry";
// import moment from "moment";

// export class LoggerService implements ComponentInvoker {

//     #origin?: string;

//     constructor() {

//     }

//     set invoker(value: Function) {
//         this.#origin = value.name;
//     }

//     private message(type: 'INFO' | 'DEBUG' | 'ERROR' | 'WARN' | 'DEV', ...message: any[]) {
//         const date = moment().format('YYYY-MM-DD HH:mm:ss');
//         let result = `[${this.#origin}] ${date} ${type} `;

//         message.forEach((msg: any) => {
//             if (typeof msg === 'object') {
//                 result += `${JSON.stringify(msg)} `;
//             } else {
//                 result += `${msg} `;
//             }
//         });

//         return result;
//     }

//     public error(...message: any[]) {
//         console.error(this.message('ERROR', ...message));
//     }

//     public warn(...message: any[]) {
//         console.error(this.message('WARN', ...message));
//     }

//     public info(...message: any[]) {
//         console.error(this.message('INFO', ...message));
//     }
// }

// TODO: sustituir por https://www.npmjs.com/package/pino

// import winston from 'winston';
// import moment from 'moment';

// import { TransformableInfo } from 'logform';
// import { SPLAT } from 'triple-beam'


// winston.addColors({
//     error: 'red',
//     warn: 'yellow',
//     info: 'green',
//     verbose: 'cyan',
//     debug: 'blue',
//     silly: 'magenta'
// });

// const format = ({ level, message, stack, ...e }: TransformableInfo) => {
//     let formattedMeta = '';

//     if (stack) {
//         formattedMeta += '\n' + stack
//     }
//     else if (e['0']) {
//         formattedMeta += JSON.stringify(e['0'], null, 2);
//     }
//     else if (e[SPLAT]) {
//         formattedMeta += JSON.stringify(e[SPLAT], null, 2);
//     }

//     const date = moment().format('YYYY-MM-DD HH:mm:ss');
//     let value = `[${level}] [${date}] ${message} ${formattedMeta}`;

//     return value;
// };


// const consoleFormat = winston.format.printf(format);
// const logger = winston.createLogger({
//     levels: winston.config.npm.levels,
//     transports:
//         [
//             new winston.transports.Console({
//                 format: winston.format.combine(
//                     winston.format.colorize(),
//                     winston.format.splat(),
//                     consoleFormat
//                 )
//             }),
//             new winston.transports.File({
//                 filename: path + '/error.log',
//                 level: 'error',
//                 format: winston.format.combine(
//                     winston.format.uncolorize(),
//                     winston.format.json(),
//                     consoleFormat
//                 )
//             }),
//             new winston.transports.File({
//                 filename: path + '/combined.log',
//                 format: winston.format.combine(
//                     winston.format.uncolorize(),
//                     winston.format.json(),
//                     consoleFormat
//                 )
//             })
//         ]
// });

// export default logger;
