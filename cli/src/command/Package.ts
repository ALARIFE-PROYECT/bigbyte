/**
 * Empaqueta la aplicacion para su despliegue en produccion
 */

import logUpdate from 'log-update';

const complete = () => {
 console.log(`Empaquetando completado!`);
}

export default async () => {
    const chart = '█ ';
    const min = 0;
    const max = 100;
    const step = 5;
    let num = 1;

    const mInterval = setInterval(() => {
        let progress = '';

        for (let i = 0; i < num; i++) {
            progress += chart;
        }

        const progressString = `Loading: [ ${progress} ${num * step}% ]`;
        logUpdate(progressString);

        num ++;
        if (num > max / step) {
            logUpdate.done();
            clearInterval(mInterval);
        }

        if (num > max / step) {
            complete();
            clearInterval(mInterval);
        }
    }, 300);
}
