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
