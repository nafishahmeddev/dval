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
            validator: (value, mapping) => !!new Nix(schema).validate(mapping[path])
        });
        return this;
    }
}
class ArraySchema {
    constructor() {
        this.validations = [];
        return this;
    }
}
class Nix {
    constructor(schema) {
        this.schema = schema;
    }
    loop(values, schema, path = [], mapping) {
        var _a, _b, _c, _d;
        let errors;
        if (schema instanceof Schema) {
            for (const validation of schema.validations) {
                if (validation.name == "optional") {
                    if (!validation.validator(values, mapping))
                        break;
                    continue;
                }
                else if (validation.name == "required") {
                    errors = !validation.validator(values, mapping) ? (_a = validation.message) !== null && _a !== void 0 ? _a : `${path.join(".")} is required.` : undefined;
                    if (errors)
                        break;
                    else
                        continue;
                }
                else if (validation.name == "custom") {
                    errors = !validation.validator(values, mapping) ? (_b = validation.message) !== null && _b !== void 0 ? _b : `${path.join(".")} is required.` : undefined;
                    if (errors)
                        break;
                    else
                        continue;
                }
                else if (validation.name == "conditional") {
                    errors = !validation.validator(values, mapping) ? (_c = validation.message) !== null && _c !== void 0 ? _c : `${path.join(".")} is required.` : undefined;
                    if (errors)
                        break;
                    else
                        continue;
                }
                else if (!validation.validator(values, mapping)) {
                    errors = (_d = validation.message) !== null && _d !== void 0 ? _d : `${path.join(".")} should be ${validation.name}`;
                    if (errors)
                        break;
                }
            }
        }
        else if (typeof schema === "object" && schema !== null) {
            errors = Array.isArray(schema) ? [] : {};
            for (let key in schema) {
                errors[key] = this.loop(values === null || values === void 0 ? void 0 : values[key], schema[key], [...path, key], mapping);
                if (!errors[key] || Object.values(errors[key]).length == 0) {
                    delete errors[key];
                }
            }
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
        const errors = this.loop(values, this.schema, [], mapping);
        return errors;
    }
}
Nix.optional = () => new Schema().optional();
Nix.required = (message) => new Schema().required(message);
Nix.email = (message) => new Schema().email(message);
Nix.string = (message) => new Schema().string(message);
Nix.number = (message) => new Schema().number(message);
Nix.min = (min, message) => new Schema().min(min, message);
Nix.max = (max, message) => new Schema().max(max, message);
Nix.regexp = (expression, message) => new Schema().regexp(expression, message);
Nix.custom = (validator, message) => new Schema().custom(validator, message);
Nix.conditional = (path, schema, message) => new Schema().conditional(path, schema, message);
exports.default = Nix;
