
type IValidator = (value: any, mapping: { [key: string]: any }) => boolean;

interface IValidation {
    name: string,
    message?: string,
    validator: IValidator
}
class Schema {
    validations: Array<IValidation>;
    constructor() {
        this.validations = [];
        return this;
    }
    optional() {
        this.validations.unshift({
            name: "optional",
            validator: (value, mapping) => !value
        });
        return this;
    }

    required(message: string) {
        this.validations.push({
            name: "required",
            message: message,
            validator: (value, mapping) => !!value
        });
        return this;
    }
    email(message: string) {
        this.validations.push({
            name: "email",
            message: message,
            validator: (value, mapping) => new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(value)
        });
        return this;
    }

    string(message: string) {
        this.validations.push({
            name: "string",
            message: message,
            validator: (value, mapping) => value && typeof value == "string"
        });
        return this;
    }

    number(message: string) {
        this.validations.push({
            name: "number",
            message: message,
            validator: (value, mapping) => value && !isNaN(Number(value))
        });
        return this;
    }


    integer(message: string) {
        this.validations.push({
            name: "integer",
            message: message,
            validator: (value, mapping) => value && typeof value == "number"
        });
        return this;
    }

    min(min: number, message: string) {
        this.validations.push({
            name: "min",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) >= min,
        });
        return this;
    }

    max(max: number, message: string) {
        this.validations.push({
            name: "max",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) <= max,
        });
        return this;
    }

    positive(message: string) {
        this.validations.push({
            name: "positive",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) > 0,
        });
        return this;
    }

    negative(message: string) {
        this.validations.push({
            name: "negative",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) < 0,
        });
        return this;
    }

    regexp(reg: RegExp, message: string) {
        this.validations.push({
            name: "regexp",
            message: message,
            validator: (value, mapping) => value && reg.test(value)
        });
        return this;
    }
    custom(validator: IValidator, message: string) {
        this.validations.push({
            name: "custom",
            message: message,
            validator: validator,
        });
        return this;
    }

    conditional(path: string, schema: Schema, message: string) {
        this.validations.push({
            name: "conditional",
            message: message,
            validator: (value, mapping) => !!new Nix(schema).validate(mapping[path])
        });
        return this;
    }
}


class ArraySchema {
    validations: Array<IValidation>;
    constructor() {
        this.validations = [];
        return this;
    }


}

class Nix {
    schema: any;
    constructor(schema: any) {
        this.schema = schema;
    }
    loop(values: any, schema: any, path: string[] = [], mapping: { [key: string]: any }) {
        let errors: any;
        if (schema instanceof Schema) {
            for (const validation of schema.validations as Array<IValidation>) {
                if (validation.name == "optional") {
                    if (!validation.validator(values, mapping)) break;
                    continue;
                } else if (validation.name == "required") {
                    errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is required.` : undefined
                    if (errors) break
                    else continue;
                } else if (validation.name == "custom") {
                    errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is required.` : undefined
                    if (errors) break
                    else continue;
                } else if (validation.name == "conditional") {
                    errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is required.` : undefined
                    if (errors) break
                    else continue;
                } else if (!validation.validator(values, mapping)) {
                    errors = validation.message ?? `${path.join(".")} should be ${validation.name}`;
                    if (errors) break;
                }
            }
        } else if (typeof schema === "object" && schema !== null) {
            errors = Array.isArray(schema) ? [] : {};
            for (let key in schema) {
                errors[key] = this.loop(values?.[key], schema[key], [...path, key], mapping);
                if (!errors[key] || Object.values(errors[key]).length == 0) {
                    delete errors[key];
                }
            }
        }
        return errors;
    }

    validate(values: any) {
        const mapping: any = {};
        const valueLoop = (vals: any, path: string[] = []) => {
            if (typeof vals == "object") {
                for (let key in vals) {
                    valueLoop(vals[key], [...path, key])
                }
            } else {
                mapping[path.join(".")] = vals;
            }
        }
        valueLoop(values);
        const errors = this.loop(values, this.schema, [], mapping);
        return errors;
    }

    static optional = () => new Schema().optional()
    static required = (message: string) => new Schema().required(message)
    static email = (message: string) => new Schema().email(message)
    static string = (message: string) => new Schema().string(message)
    static number = (message: string) => new Schema().number(message)
    static integer = (message: string) => new Schema().integer(message)
    static min = (min: number, message: string) => new Schema().min(min, message)
    static max = (max: number, message: string) => new Schema().max(max, message)
    static positive = (message: string) => new Schema().positive(message)
    static negative = (message: string) => new Schema().negative(message)
    static regexp = (expression: RegExp, message: string) => new Schema().regexp(expression, message)
    static custom = (validator: IValidator, message: string) => new Schema().custom(validator, message)
    static conditional = (path: string, schema: Schema, message: string) => new Schema().conditional(path, schema, message)

}
export default Nix;
