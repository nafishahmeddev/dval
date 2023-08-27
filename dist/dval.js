"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Schema {
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
    required(message) {
        this.validations.push({
            name: "required",
            message: message,
            validator: (value, mapping) => !!value
        });
        return this;
    }
    email(message) {
        this.validations.push({
            name: "email",
            message: message,
            validator: (value, mapping) => new RegExp(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/).test(value)
        });
        return this;
    }
    string(message) {
        this.validations.push({
            name: "string",
            message: message,
            validator: (value, mapping) => value && typeof value == "string"
        });
        return this;
    }
    number(message) {
        this.validations.push({
            name: "number",
            message: message,
            validator: (value, mapping) => value && !isNaN(Number(value))
        });
        return this;
    }
    integer(message) {
        this.validations.push({
            name: "integer",
            message: message,
            validator: (value, mapping) => value && typeof value == "number"
        });
        return this;
    }
    min(min, message) {
        this.validations.push({
            name: "min",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) >= min,
        });
        return this;
    }
    max(max, message) {
        this.validations.push({
            name: "max",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) <= max,
        });
        return this;
    }
    positive(message) {
        this.validations.push({
            name: "positive",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) > 0,
        });
        return this;
    }
    negative(message) {
        this.validations.push({
            name: "negative",
            message: message,
            validator: (value, mapping) => (this.validations.find(ob => ob.name == "number") ? Number(value) : value.length) < 0,
        });
        return this;
    }
    regexp(reg, message) {
        this.validations.push({
            name: "regexp",
            message: message,
            validator: (value, mapping) => value && reg.test(value)
        });
        return this;
    }
    custom(validator, message) {
        this.validations.push({
            name: "custom",
            message: message,
            validator: validator,
        });
        return this;
    }
    conditional(path, schema, message) {
        this.validations.push({
            name: "conditional",
            message: message,
            validator: (value, mapping) => !!new Dval(schema).validate(mapping[path])
        });
        return this;
    }
    validate(values, path = [], mapping) {
        var _a, _b, _c, _d;
        let errors;
        for (const validation of this.validations) {
            if (validation.name == "optional") {
                if (!validation.validator(values, mapping))
                    break;
                continue;
            }
            else if (validation.name == "required") {
                errors = !validation.validator(values, mapping) ? (_a = validation.message) !== null && _a !== void 0 ? _a : `${path.join(".")} is ${validation.name}.` : undefined;
                if (errors)
                    break;
                else
                    continue;
            }
            else if (validation.name == "custom") {
                errors = !validation.validator(values, mapping) ? (_b = validation.message) !== null && _b !== void 0 ? _b : `${path.join(".")} is ${validation.name}.` : undefined;
                if (errors)
                    break;
                else
                    continue;
            }
            else if (validation.name == "conditional") {
                errors = !validation.validator(values, mapping) ? (_c = validation.message) !== null && _c !== void 0 ? _c : `${path.join(".")} is ${validation.name}.` : undefined;
                if (errors)
                    break;
                else
                    continue;
            }
            else if (!validation.validator(values, mapping)) {
                errors = !validation.validator(values, mapping) ? (_d = validation.message) !== null && _d !== void 0 ? _d : `${path.join(".")} is ${validation.name}.` : undefined;
                if (errors)
                    break;
            }
        }
        return errors;
    }
}
class ArraySchema {
    constructor(values, message) {
        this.validations = [];
        this.values = values;
        this.message = message;
        return this;
    }
    min(min, message) {
        this.validations.push({
            name: "min",
            message: message,
            validator: (value, mapping) => value.length >= min,
        });
        return this;
    }
    max(max, message) {
        this.validations.push({
            name: "max",
            message: message,
            validator: (value, mapping) => value.length <= max,
        });
        return this;
    }
    validate(values, path = [], mapping) {
        var _a;
        let errors;
        if (!Array.isArray(values)) {
            errors = `${path.join(".")} is not an array.`;
        }
        else {
            for (const validation of this.validations) {
                errors = !validation.validator(values, mapping) ? (_a = validation.message) !== null && _a !== void 0 ? _a : `${path.join(".")} is ${validation.name}.` : undefined;
                if (errors)
                    break;
                continue;
            }
            if (errors)
                return errors;
            //validate rest of the things
            errors = [];
            for (let key in this.values) {
                errors[key] = Dval.loop(values === null || values === void 0 ? void 0 : values[Number(key)], this.values[key], [...path, key], mapping);
                errors = errors.filter((error) => !!error);
                if (errors.length == 0)
                    errors = undefined;
                console.log(errors);
            }
        }
        if (errors)
            return errors;
    }
}
class ObjectSchema {
    constructor(values, message) {
        this.validations = [];
        this.values = values;
        this.message = message;
        return this;
    }
    validate(values, path = [], mapping) {
        var _a;
        let errors;
        if (typeof values != "object") {
            errors = `${path.join(".")} is not an object.`;
        }
        else {
            for (const validation of this.validations) {
                errors = !validation.validator(values, mapping) ? (_a = validation.message) !== null && _a !== void 0 ? _a : `${path.join(".")} is ${validation.name}.` : undefined;
                if (errors)
                    break;
                continue;
            }
            if (errors)
                return errors;
            errors = {};
            for (let key in this.values) {
                errors[key] = Dval.loop(values === null || values === void 0 ? void 0 : values[key], this.values[key], [...path, key], mapping);
                if (!errors[key])
                    delete errors[key];
            }
            if (Object.entries(errors).length == 0)
                errors = undefined;
        }
        if (errors)
            return errors;
    }
}
class Dval {
    constructor(schema) {
        this.schema = schema;
    }
    static loop(values, schema, path = [], mapping) {
        let errors;
        if (schema instanceof Schema) {
            errors = schema.validate(values, path, mapping);
        }
        else if (schema instanceof ObjectSchema) {
            console.log(values);
            errors = schema.validate(values, path, mapping);
        }
        else if (schema instanceof ArraySchema) {
            errors = schema.validate(values, path, mapping);
        }
        return errors;
    }
    validate(values) {
        const mapping = {};
        const valueLoop = (vals, path = []) => {
            if (typeof vals == "object") {
                for (let key in vals) {
                    valueLoop(vals[key], [...path, key]);
                }
            }
            else {
                mapping[path.join(".")] = vals;
            }
        };
        valueLoop(values);
        const errors = Dval.loop(values, this.schema, [], mapping);
        return {
            errors: errors,
            isValid: !errors
        };
    }
}
Dval.optional = () => new Schema().optional();
Dval.required = (message) => new Schema().required(message);
Dval.email = (message) => new Schema().email(message);
Dval.string = (message) => new Schema().string(message);
Dval.number = (message) => new Schema().number(message);
Dval.integer = (message) => new Schema().integer(message);
Dval.min = (min, message) => new Schema().min(min, message);
Dval.max = (max, message) => new Schema().max(max, message);
Dval.positive = (message) => new Schema().positive(message);
Dval.negative = (message) => new Schema().negative(message);
Dval.regexp = (expression, message) => new Schema().regexp(expression, message);
Dval.custom = (validator, message) => new Schema().custom(validator, message);
Dval.conditional = (path, schema, message) => new Schema().conditional(path, schema, message);
Dval.array = (values, message) => new ArraySchema(values, message);
Dval.object = (values, message) => new ObjectSchema(values, message);
exports.default = Dval;
