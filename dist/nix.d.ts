type IValidator = (value: any, mapping: {
    [key: string]: any;
}) => boolean;
interface IValidation {
    name: string;
    message?: string;
    validator: IValidator;
}
declare class Schema {
    validations: Array<IValidation>;
    constructor();
    optional(): this;
    required(message?: string): this;
    email(message?: string): this;
    string(message?: string): this;
    number(message?: string): this;
    integer(message?: string): this;
    min(min: number, message?: string): this;
    max(max: number, message?: string): this;
    positive(message?: string): this;
    negative(message?: string): this;
    regexp(reg: RegExp, message?: string): this;
    custom(validator: IValidator, message?: string): this;
    conditional(path: string, schema: Schema, message?: string): this;
    validate(values: any, path: string[] | undefined, mapping: {
        [key: string]: any;
    }): string | undefined;
}
declare class ArraySchema {
    validations: Array<IValidation>;
    values: any;
    message: any;
    constructor(values: Array<ArraySchema | ObjectSchema | Schema>, message?: string);
    min(min: number, message?: string): this;
    max(max: number, message?: string): this;
    validate(values: any, path: string[] | undefined, mapping: {
        [key: string]: any;
    }): any;
}
declare class ObjectSchema {
    values: any;
    validations: Array<IValidation>;
    message: any;
    constructor(values: {
        [key: string]: ObjectSchema | ArraySchema | Schema;
    }, message?: string);
    validate(values: any, path: string[] | undefined, mapping: {
        [key: string]: any;
    }): any;
}
declare class Nix {
    schema: any;
    constructor(schema: any);
    static loop(values: any, schema: any, path: string[] | undefined, mapping: {
        [key: string]: any;
    }): any;
    validate(values: any): {
        errors: any;
        isValid: boolean;
    };
    static optional: () => Schema;
    static required: (message?: string) => Schema;
    static email: (message?: string) => Schema;
    static string: (message?: string) => Schema;
    static number: (message?: string) => Schema;
    static integer: (message?: string) => Schema;
    static min: (min: number, message?: string) => Schema;
    static max: (max: number, message?: string) => Schema;
    static positive: (message?: string) => Schema;
    static negative: (message?: string) => Schema;
    static regexp: (expression: RegExp, message?: string) => Schema;
    static custom: (validator: IValidator, message?: string) => Schema;
    static conditional: (path: string, schema: Schema, message?: string) => Schema;
    static array: (values: Array<Schema | ObjectSchema | ArraySchema>, message?: string) => ArraySchema;
    static object: (values: {
        [key: string]: Schema | ArraySchema | ObjectSchema;
    }, message?: string) => ObjectSchema;
}
export default Nix;
