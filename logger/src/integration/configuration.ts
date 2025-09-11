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

import { Configuration } from "@bigbyte/integration";
import { ARGV_TRACE_LOG_FILE, ARGV_TRACE_LOG_FILE_SIZE_INTERVAL, ARGV_TRACE_LOG_FILE_TIME_INTERVAL, ENV_TRACE_LOG_FILE, ENV_TRACE_LOG_FILE_SIZE_INTERVAL, ENV_TRACE_LOG_FILE_TIME_INTERVAL } from "../constant";


export default {
    commandDeclaration: [
        {
            name: 'run',
            flags: [
                {
                    name: ARGV_TRACE_LOG_FILE,
                    env: ENV_TRACE_LOG_FILE,
                    type: 'value',
                    defaultValue: undefined,
                    description: 'Path to the trace log file. If not specified, no trace log will be created.',
                    detail: 'The trace log file is used to store detailed information about the application execution, which can be useful for debugging and performance analysis.'
                },
                {
                    name: ARGV_TRACE_LOG_FILE_TIME_INTERVAL,
                    env: ENV_TRACE_LOG_FILE_TIME_INTERVAL,
                    type: 'value',
                    defaultValue: undefined,
                    description: 'Time interval in milliseconds to rotate the trace log file. If not specified, the trace log file will not be rotated based on time.',
                    detail: 'The trace log file can be rotated based on time to prevent it from growing indefinitely. This is useful for long-running applications where you want to keep the log files manageable.'
                },
                {
                    name: ARGV_TRACE_LOG_FILE_SIZE_INTERVAL,
                    env: ENV_TRACE_LOG_FILE_SIZE_INTERVAL,
                    type: 'value',
                    defaultValue: undefined,
                    description: 'Size interval in bytes to rotate the trace log file. If not specified, the trace log file will not be rotated based on size.',
                    detail: 'The trace log file can be rotated based on size to prevent it from growing indefinitely. This is useful for applications that generate a lot of log data and you want to keep the log files manageable.'
                }
            ],
        }
    ]
} as Configuration;
