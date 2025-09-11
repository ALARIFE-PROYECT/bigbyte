/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/logger.
 *
 * Licensed under the Apache-2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License in the LICENSE file
 * at the root of this project.
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND.
 */

// import environment from '@bigbyte/utils/environment';
// import { TRACE_LOG_FILE_MODE, TRACE_LOG_FILE_SIZE_INTERVAL, TRACE_LOG_FILE_TIME_INTERVAL } from '../constant';

// function obtenerMegabytes(pathArchivo: string): number {
//     const stats = fs.statSync(pathArchivo);
//     const megabytes = stats.size / (1024 * 1024);
//     return megabytes;
//   }

// -----------------------

// setInterval(miFuncion, 5000); // milisegundos

export const initInterval = (path: string, timeInterval?: string, sizeInterval?: string) => {
//         const logFileTimeInterval = environmentService.get(ENV_TRACE_LOG_FILE_TIME_INTERVAL);
//         const logFileSizeInterval = environmentService.get(ENV_TRACE_LOG_FILE_SIZE_INTERVAL);
//         if (logFileTimeInterval || logFileSizeInterval) {
//             log.info(`Logger configured to rotate logs every ${logFileTimeInterval ? `${logFileTimeInterval} minutes.` : `${logFileSizeInterval} bytes.`}`);

//             initInterval(path, logFileTimeInterval, logFileTimeInterval);
//         }












    // const logFileMode = environment.get(TRACE_LOG_FILE_MODE) === 'true';
    // const logFile = environment.get(TRACE_LOG_FILE_MODE);

    // const logFileTimeInterval = environment.get(TRACE_LOG_FILE_TIME_INTERVAL);
    // const logFileSizeInterval = environment.get(TRACE_LOG_FILE_SIZE_INTERVAL);

    // if (logFileMode && !(logFileTimeInterval || logFileSizeInterval)) {
    //     // warning, va a guardar logs y nunca los va a limpiar
    // }

    // if (logFileMode && logFileTimeInterval) {
    //     // Intercalos permitidos:

    //     // size:
    //     // gb -> gigabytes
    //     // mb -> megabytes
    //     // kb -> kilobytes

    //     // *TRANSFORMAR TODO A BYTES


    //     // Time:
    //     // segundos
    //     // minutos
    //     // horas
    //     // dias

    //     // *TRANSFORMAR TODO A MILISEGUNDOS





    // }
}
