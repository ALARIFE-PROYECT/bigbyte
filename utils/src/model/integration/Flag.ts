import { HelpBase } from "./Help";

/**
 * * Tipo del flag
 * 
 * 'switch' ==> Controla la activacion o no de ese flag
 * 'value' ==> Se debe indicar un valor
 */
export enum FlagType {
    switch = 'switch',
    value = 'value',
    file = 'file'
}

export interface Flag extends HelpBase {
    /**
     * Nombre del flag, por ejemplo "--doctor"
    */
    name: string;

    /**
     * key del environment donde se replica el valor. Si no existe no se replica
    */
    env?: string;

    type: FlagType;
}

/**
 * * Datos de un flag
 * 
 * Contiene el flag configurado a su accion y el valor que se le asigna por argv
 * Recibido por parametros a la funcion que debe exportar una accion
 */
export interface FlagData {
    flag: Flag;
    value: string | boolean;
}

