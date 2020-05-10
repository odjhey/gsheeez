import { createSchema, TSchema } from './schema';
import { mergeSchema } from './utils';
declare type TConfiguration = {
    scopes: Array<string>;
    tokenPath: string;
    credsPath: string;
    google: any;
    hashFn: (obj: any) => any;
};
declare type TSheepInfo = {
    spreadsheetId: string;
    range: string;
    sheet?: string;
};
declare type TSheep = {
    configure: (conf: TConfiguration) => void;
    getConfig: () => TConfiguration;
    create: (info: TSheepInfo) => any;
};
declare const sheep: TSheep;
export { sheep };
export { TSchema };
declare const groupByKeys: (keys: any, data: any) => any;
declare const createModel: (schema: TSchema, _grid?: any[][], rowIdxs?: number[][]) => {
    getAll: () => any[];
    get: (filter: any) => any;
    getById: (id: any) => any;
    filter: (filter: any) => any[];
    update: (obj: any, fields: any) => any;
    getChanges: () => {
        fieldname: string;
        value: {
            from: any;
            to: any;
        };
        __metadata: {
            rowIdx: string;
            column: string;
        };
    }[];
    clearChanges: () => void;
    setGrid: (grid: any[][]) => void;
    getGrid: () => any[][];
    setGridRefresh: (refresh: () => Promise<any[][]>) => Promise<any>;
    groupByKeys: (options?: {
        keysOnly: boolean;
    }) => any;
    __metadata: {
        schema: TSchema;
    };
};
declare const createModelsFromBaseModel: (schemas: TSchema[], baseModel: {
    getAll: () => any[];
    get: (filter: any) => any;
    getById: (id: any) => any;
    filter: (filter: any) => any[];
    update: (obj: any, fields: any) => any;
    getChanges: () => {
        fieldname: string;
        value: {
            from: any;
            to: any;
        };
        __metadata: {
            rowIdx: string;
            column: string;
        };
    }[];
    clearChanges: () => void;
    setGrid: (grid: any[][]) => void;
    getGrid: () => any[][];
    setGridRefresh: (refresh: () => Promise<any[][]>) => Promise<any>;
    groupByKeys: (options?: {
        keysOnly: boolean;
    }) => any;
    __metadata: {
        schema: TSchema;
    };
}, options?: {
    keysOnly: boolean;
}) => {
    getAll: () => any[];
    get: (filter: any) => any;
    getById: (id: any) => any;
    filter: (filter: any) => any[];
    update: (obj: any, fields: any) => any;
    getChanges: () => {
        fieldname: string;
        value: {
            from: any;
            to: any;
        };
        __metadata: {
            rowIdx: string;
            column: string;
        };
    }[];
    clearChanges: () => void;
    setGrid: (grid: any[][]) => void;
    getGrid: () => any[][];
    setGridRefresh: (refresh: () => Promise<any[][]>) => Promise<any>;
    groupByKeys: (options?: {
        keysOnly: boolean;
    }) => any;
    __metadata: {
        schema: TSchema;
    };
}[];
declare const toJSONWithSchema: (schema: TSchema, grid?: import("./utils").TData<any>[][], rowIdxs?: number[][]) => any[];
export { createSchema };
export { toJSONWithSchema };
export { groupByKeys };
export { createModel, createModelsFromBaseModel };
export { mergeSchema };