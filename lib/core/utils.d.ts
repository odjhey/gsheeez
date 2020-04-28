import { TSchema } from './schema';
declare type TData<T> = {
    __metadata: {
        rowIdx: Array<number>;
        uid: any;
    };
};
declare const makeToJSONWithSchema: (hashFn: any) => (schema: TSchema, grid?: TData<any>[][], rowIdxs?: number[][]) => any[];
declare const mergeSchema: (schemas: any) => any;
export { makeToJSONWithSchema };
export { TData };
export { mergeSchema };
