import { CommandData } from "@bigbyte/utils/integration";
import { ConfigurationError } from "../../exception/ConfigurationError";

export const launchCommand = (data: CommandData) => {
    const { command } = data;
    if ('path' in command) {
        const commandDependency = require(command.path.replace('.ts', '.js'));

        if (!commandDependency.default || typeof commandDependency.default !== 'function') {
            throw new ConfigurationError('command', `The command at path ${command.path} does not export a default function.`);
        }

        // Funcion exportada por el comando
        commandDependency.default(data);
    }

}