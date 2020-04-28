declare type TGridSchemaInput = {
    range: string;
    header: Array<string>;
    keys?: Array<string>;
};
declare type TSchema = Array<{
    key: string;
    __metadata: {
        column: string;
        idx: number;
        isUniqueIdfier: boolean;
        baseIdx?: number;
    };
}>;
declare const createSchema: (input: TGridSchemaInput) => TSchema;
export { createSchema };
export { TSchema };
