import { TSchema } from '.';
declare type TGrid = Array<Array<any>>;
declare type TModel<T> = {
    getAll: () => Array<T>;
    get: (filter: any) => T;
    getById: (id: any) => T;
    filter: (filter: any) => Array<T>;
    update: (obj: T, fields: any) => T;
    getChanges: () => TChangeRecords;
    clearChanges: () => void;
    setGrid: (grid: TGrid) => void;
    getGrid: () => TGrid;
    setGridRefresh: (refresh: () => Promise<TGrid>) => Promise<any>;
    groupByKeys: (options?: {
        keysOnly: boolean;
    }) => any;
    __metadata: {
        schema: TSchema;
    };
};
declare type TChangeRecord = {
    fieldname: string;
    value: {
        from: any;
        to: any;
    };
    __metadata: {
        rowIdx: string;
        column: string;
    };
};
declare type TChangeRecords = Array<TChangeRecord>;
declare const makeCreateModel: (hashFn: any) => (schema: TSchema, _grid?: TGrid, rowIdxs?: number[][]) => TModel<any>;
declare const makeCreateModelsFromBaseModel: (hashFn: any) => (schemas: TSchema[], baseModel: TModel<any>, options?: {
    keysOnly: boolean;
}) => TModel<any>[];
export { makeCreateModel, makeCreateModelsFromBaseModel };
