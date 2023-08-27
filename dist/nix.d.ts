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
    required(message: string): this;
    email(message: string): this;
    string(message: string): this;
    number(message: string): this;
    min(min: number, message: string): this;
    max(max: number, message: string): this;
    regexp(reg: RegExp, message: string): this;
    custom(validator: IValidator, message: string): this;
    conditional(path: string, schema: Schema, message: string): this;
}
declare class Nix {
    schema: any;
    constructor(schema: any);
    loop(values: any, schema: any, path: string[] | undefined, mapping: {
        [key: string]: any;
    }): any;
    validate(values: any): any;
    static optional: () => Schema;
    static required: (message: string) => Schema;
    static email: (message: string) => Schema;
    static string: (message: string) => Schema;
    static number: (message: string) => Schema;
    static min: (min: number, message: string) => Schema;
    static max: (max: number, message: string) => Schema;
    static regexp: (expression: RegExp, message: string) => Schema;
    static custom: (validator: IValidator, message: string) => Schema;
    static conditional: (path: string, schema: Schema, message: string) => Schema;
}
export default Nix;
