export class MalformedArgumentError extends Error {
    constructor(argument: string, description: string) {
        super('Malformed argument: ' + argument + (description ? ', ' + description : ''));
        this.name = 'MalformedArgumentError';
    }
}
