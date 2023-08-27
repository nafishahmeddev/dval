
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

    required(message?: string) {
        this.validations.push({
            name: "required",
            message: message,
            validator: (value, mapping) => !!value
        });
        return this;
    }
    email(message?: string) {
        this.validations.push({
            name: "email",
            message: message,
            validator: (value, mapping) => new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(value)
        });
        return this;
    }

    string(message?: string) {
        this.validations.push({
            name: "string",
            message: message,
            validator: (value, mapping) => value && typeof value == "string"
        });
        return this;
    }

    number(message?: string) {
        this.validations.push({
            name: "number",
            message: message,
            validator: (value, mapping) => value && !isNaN(Number(value))
        });
        return this;
    }


    integer(message?: string) {
        this.validations.push({
            name: "integer",
            message: message,
            validator: (value, mapping) => value && typeof value == "number"
        });
        return this;
    }

    min(min: number, message?: string) {
        this.validations.push({
            name: "min",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) >= min,
        });
        return this;
    }

    max(max: number, message?: string) {
        this.validations.push({
            name: "max",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) <= max,
        });
        return this;
    }

    positive(message?: string) {
        this.validations.push({
            name: "positive",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) > 0,
        });
        return this;
    }

    negative(message?: string) {
        this.validations.push({
            name: "negative",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) < 0,
        });
        return this;
    }

    regexp(reg: RegExp, message?: string) {
        this.validations.push({
            name: "regexp",
            message: message,
            validator: (value, mapping) => value && reg.test(value)
        });
        return this;
    }
    custom(validator: IValidator, message?: string) {
        this.validations.push({
            name: "custom",
            message: message,
            validator: validator,
        });
        return this;
    }

    conditional(path: string, schema: Schema, message?: string) {
        this.validations.push({
            name: "conditional",
            message: message,
            validator: (value, mapping) => !!new Dval(schema).validate(mapping[path])
        });
        return this;
    }

    validate(values: any, path: string[] = [], mapping: { [key: string]: any }) {
        let errors;
        for (const validation of this.validations as Array<IValidation>) {
            if (validation.name == "optional") {
                if (!validation.validator(values, mapping)) break;
                continue;
            } else if (validation.name == "required") {
                errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is ${validation.name}.` : undefined
                if (errors) break
                else continue;
            } else if (validation.name == "custom") {
                errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is ${validation.name}.` : undefined
                if (errors) break
                else continue;
            } else if (validation.name == "conditional") {
                errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is ${validation.name}.` : undefined
                if (errors) break
                else continue;
            } else if (!validation.validator(values, mapping)) {
                errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is ${validation.name}.` : undefined
                if (errors) break;
            }
        }
        return errors;
    }
}


class ArraySchema {
    validations: Array<IValidation>;
    values: any;
    message: any;
    constructor(values: Array<ArraySchema | ObjectSchema | Schema>, message?: string) {
        this.validations = [];
        this.values = values;
        this.message = message;
        return this;
    }

    min(min: number, message?: string) {
        this.validations.push({
            name: "min",
            message: message,
            validator: (value, mapping) => value.length >= min,
        });
        return this;
    }

    max(max: number, message?: string) {
        this.validations.push({
            name: "max",
            message: message,
            validator: (value, mapping) => value.length <= max,
        });
        return this;
    }

    validate(values: any, path: string[] = [], mapping: { [key: string]: any }) {
        let errors: any;
        if (!Array.isArray(values)) {
            errors = `${path.join(".")} is not an array.`;
        } else {
            for (const validation of this.validations) {
                errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is ${validation.name}.` : undefined
                if (errors) break;
                continue;
            }
            if (errors) return errors;
            //validate rest of the things
            errors = [];
            for (let key in this.values) {
                errors[key] = Dval.loop(values?.[Number(key)], this.values[key], [...path, key], mapping);
                errors = errors.filter((error: any )=>!!error);
                if (errors.length == 0) errors = undefined;
                console.log(errors)
            }
        }
        if(errors) return errors;
    }


}

class ObjectSchema {
    values: any;
    validations: Array<IValidation>;
    message: any;
    constructor(values: { [key: string]: ObjectSchema | ArraySchema | Schema }, message?: string) {
        this.validations = [];
        this.values = values;
        this.message = message;
        return this;
    }

    validate(values: any, path: string[] = [], mapping: { [key: string]: any }) {
        let errors: any;
        if (typeof values != "object") {
            errors = `${path.join(".")} is not an object.`;
        } else {

            for (const validation of this.validations) {
                errors = !validation.validator(values, mapping) ? validation.message ?? `${path.join(".")} is ${validation.name}.` : undefined
                if (errors) break;
                continue;
            }
            if (errors) return errors;

            errors = {};
            for (let key in this.values) {
                errors[key] = Dval.loop(values?.[key], this.values[key], [...path, key], mapping);
                if (!errors[key]) delete errors[key];
            }
            if (Object.entries(errors).length == 0) errors = undefined;
        }
        if(errors) return errors;
    }

}

class Dval {
    schema: any;
    constructor(schema: any) {
        this.schema = schema;
    }
    static loop(values: any, schema: any, path: string[] = [], mapping: { [key: string]: any }) {
        let errors: any;
        if (schema instanceof Schema) {
            errors = schema.validate(values, path, mapping);
        } else if (schema instanceof ObjectSchema) {
            console.log(values);
            errors = schema.validate(values, path, mapping);
        } else if (schema instanceof ArraySchema) {
            errors = schema.validate(values, path, mapping);
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
        const errors = Dval.loop(values, this.schema, [], mapping);
        return { 
            errors : errors,
            isValid: !errors
        }
    }

    static optional = () => new Schema().optional()
    static required = (message?: string) => new Schema().required(message)
    static email = (message?: string) => new Schema().email(message)
    static string = (message?: string) => new Schema().string(message)
    static number = (message?: string) => new Schema().number(message)
    static integer = (message?: string) => new Schema().integer(message)
    static min = (min: number, message?: string) => new Schema().min(min, message)
    static max = (max: number, message?: string) => new Schema().max(max, message)
    static positive = (message?: string) => new Schema().positive(message)
    static negative = (message?: string) => new Schema().negative(message)
    static regexp = (expression: RegExp, message?: string) => new Schema().regexp(expression, message)
    static custom = (validator: IValidator, message?: string) => new Schema().custom(validator, message)
    static conditional = (path: string, schema: Schema, message?: string) => new Schema().conditional(path, schema, message)
    static array = (values: Array<Schema | ObjectSchema | ArraySchema>, message?: string) => new ArraySchema(values, message)
    static object = (values: { [key: string]: ObjectSchema | ArraySchema | Schema }, message?: string) => new ObjectSchema(values, message)

}
export default Dval;
