
// comprobar fusion de objetos
// dada la declaracion del integration de cli, http y core, que la fusion sea correta y todos los objetos sean creaciones

// comprobar error de reescritura de valor, cuando un valor intenta reescribir otro

// comprobar error de falta de parametros, cuando el objeto resultante no tiene todos los parametros necesarios

import { test, assert } from 'node:test';

import { ARGV_FLAG_DEBUG } from "@bigbyte/utils/constant";
import { Configuration } from "@bigbyte/utils/integration";

import { Addon } from "../../src/model/Addon";

import { addons } from '../../src/service/Addon';
import { configure, commands } from '../../src/service/Configuration'

const coreConfiguration: Configuration = {
    commands: [
        {
            name: 'FAKE_COMMAND',
            path: 'FAKE_COMMAND',
            description: 'FAKE_COMMAND',
            detail: 'FAKE_COMMAND',
            flags: '*',
        },
        {
            name: 'run',
            flags: [
                {
                    name: ARGV_FLAG_DEBUG,
                },
                {
                    name: 'ARGV_FAKE',
                    env: 'ENV_FAKE',
                    type: 'value',
                    inherit: true,
                    description: 'FAKE',
                    detail: 'FAKE'
                }
            ],
        }
    ]
};

const httpConfiguration: Configuration = {
    environment: {
        DEFAULT_VALUES: {
            ['ENV_PROTOCOL']: 'http',
            ['ENV_IP']: '0.0.0.0',
            ['ENV_PORT']: 8080,
            ['ENV_API_ROOT']: '/api',
            ['ENV_ACCESS_LOG_FILE']: undefined,
            ['ENV_ACCESS_LOG_FILE_TIME_INTERVAL']: undefined,
            ['ENV_ACCESS_LOG_FILE_SIZE_INTERVAL']: undefined,
        }
    },
    commands: [
        {
            name: 'run',
            flags: [
                {
                    name: 'ARGV_PROTOCOL',
                    env: 'ENV_PROTOCOL',
                    type: 'value',
                    inherit: true,
                    description: 'Protocol to use for the server. Default is "http".',
                    detail: 'The protocol defines how the server will communicate with clients. It can be "http" or "https". If "https" is used, the server will require SSL certificates to be configured.'
                },
                {
                    name: 'ARGV_IP',
                    env: 'ENV_IP',
                    type: 'value',
                    inherit: true,
                    description: 'IP address to bind the server. Default is "0.0.0.0".',
                    detail: 'The IP address defines which network interface the server will listen on.'
                },
                {
                    name: 'ARGV_PORT',
                    env: 'ENV_PORT',
                    type: 'value',
                    inherit: true,
                    description: 'Port to bind the server. Default is 8080.',
                    detail: 'The port defines the network port on which the server will listen for incoming requests. It must be an integer between 0 and 65535.'
                },
                {
                    name: 'ARGV_API_ROOT',
                    env: 'ENV_API_ROOT',
                    type: 'value',
                    inherit: true,
                    description: 'Root path for the API. Default is "/api".',
                    detail: 'The API root path is the base URL for all API endpoints. For example, if the API root is "/api" and the endpoint is "/users", the full URL will be "/api/users".'
                },
                {
                    name: 'ARGV_ACCESS_LOG_FILE',
                    env: 'ARGV_ACCESS_LOG_FILE',
                    type: 'value',
                    inherit: true,
                    description: 'Path to the access log file. If not specified, no access log will be created.',
                    detail: 'The access log file is used to store information about incoming requests to the server, such as the request method, URL, status code, and response time. This can be useful for monitoring and debugging purposes.'
                },
                {
                    name: 'ARGV_ACCESS_LOG_FILE_TIME_INTERVAL',
                    env: 'ENV_ACCESS_LOG_FILE_TIME_INTERVAL',
                    type: 'value',
                    inherit: true,
                    description: 'Time interval in milliseconds to rotate the access log file. If not specified, the access log file will not be rotated based on time.',
                    detail: 'The access log file can be rotated based on time to prevent it from growing indefinitely. This is useful for long-running applications where you want to keep the log files manageable. For example, if set to 86400000 (24 hours), a new log file will be created every day.'
                },
                {
                    name: 'ARGV_ACCESS_LOG_FILE_SIZE_INTERVAL',
                    env: 'ENV_ACCESS_LOG_FILE_SIZE_INTERVAL',
                    type: 'value',
                    inherit: true,
                    description: 'Size interval in bytes to rotate the access log file. If not specified, the access log file will not be rotated based on size.',
                    detail: 'The access log file can be rotated based on size to prevent it from growing indefinitely. This is useful for applications that generate a lot of log data and you want to keep the log files manageable. For example, if set to 10485760 (10 MB), a new log file will be created when the current log file reaches 10 MB in size.'
                }
            ],
        }
    ]
};

const mockAddons: Addon[] = [
    {
        name: 'core',
        version: '1.0.0',
        path: './',
        configuration: coreConfiguration
    },
    {
        name: 'http',
        version: '1.0.0',
        path: './',
        configuration: httpConfiguration
    }
]

mockAddons.forEach(addon => {
    addons.push(addon);
});


test('Load the configuration', () => {
    configure();

    // el resultado de los commands el flag ARGV_FLAG_DEBUG debe ser (inherit: true),
    commands.forEach(command => {
        console.log('RESUL COMAND ------------>', command);

        // if (command.flags && Array.isArray(command.flags)) {
        //     command.flags?.forEach(flag => {
        //         console.log('flag:', flag);
        //     });
        // }
    });
});
