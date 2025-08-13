
export interface HelpBase {
    description: string;
    detail: string;
}

export type Help = ({
    key: string // puede ser un command o un flag 
} & HelpBase)
