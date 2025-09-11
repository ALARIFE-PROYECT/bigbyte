/*
 * Copyright (c) 2025 Jose Eduardo Soria Garcia <alarifeproyect@gmail.com>
 *
 * This file is part of @bigbyte/cli.
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
