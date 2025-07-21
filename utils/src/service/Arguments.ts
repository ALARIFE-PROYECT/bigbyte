// no de como hacerlo

// no me gusta que --debug sea un flag y una environment
// no me gusta qeu la constante para comprobar que este flag o argument existe no sea usable en el resto de addons

export default {
    get(key: string): string | undefined {
        return process.argv.find((arg) => arg.includes(key));
    },
    getValue(key: string): string | undefined {
        const arg = this.get(key);

        if (arg) {
            const [_, value] = arg.split('=');

            return value;
        }
        return undefined;
    },
    has(key: string): boolean {
        return Boolean(process.argv.includes(key));
    }
} 
