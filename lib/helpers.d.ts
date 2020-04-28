declare type TSplitResult = Array<Array<any>>;
declare const splitGrid: (grid: any[], hidx?: number) => TSplitResult;
declare const toJSON: (rows: any) => any[];
declare const getByKey: (key: any, grid: any) => any;
export { toJSON, splitGrid, getByKey };
