export class MissingArgumentError extends Error {
    constructor(argument: string, description?: string) {
        super('Missing argument: ' + argument + (description ? ', ' + description : ''));
        this.name = 'MissingArgumentError';
    }
}