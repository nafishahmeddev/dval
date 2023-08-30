Dval: Data Validation Module

Dval is a lightweight and intuitive data validation module designed to validate data against specified schemas. With Dval, you can ensure that your data adheres to predefined structures, types, and constraints, helping you maintain data integrity and reliability in your applications.

## Installation

You can install Dval using your preferred package manager. Here's how you can do it using npm:
```
npm install dval
```

## Getting Started

To start using Dval for data validation, follow these simple steps:

1. Import the module:

```
const dval = require('dval');
```

2. Create a Schema:

   Define a schema that describes the structure and constraints for your data. You can use various validation rules to specify the expected properties, types, and conditions.
```
const schema = dval.object({
   name: dval.string().required(),
   age: dval.number().positive().integer(),
   email: dval.string().email(),
   // Add more validation rules as needed
});
```
3. Validate Data:

   Use the schema to validate your data. Pass the data through the schema to ensure it conforms to the defined rules.

```
   const data = {
     name: 'John Doe',
     age: 28,
     email: 'john@example.com'
   };

   const validationResult = schema.validate(data);
   if (validationResult.isValid) {
     console.log('Data is valid:', data);
   } else {
     console.error('Validation errors:', validationResult.errors);
   }
```

## Validation Rules

Dval provides a range of validation rules that you can use to define your schemas. Some of the available rules include:

- .string(): Validates that the value is a string.
- .number(): Validates that the value is a number.
- .integer(): Validates that the number is an integer.
- .required(): Validates that the value is present.
- .positive(): Validates that the number is positive.
- .email(): Validates that the string is in email format.
- .array(): Validates that the value is an array.
- .object(): Validates that the value is an object.
- And many more...

You can chain these rules together to create complex validation scenarios tailored to your data's requirements.

## Customization

Dval also allows you to create custom validation rules and messages. This flexibility enables you to address specific validation needs unique to your project.

```
const customRule = dval.string().custom((value, mapping)=>{
  return value == "OK";
});
```

## Conclusion

Dval simplifies the process of data validation by providing an easy-to-use interface to define and enforce data schemas. By integrating Dval into your projects, you can enhance data quality, reduce errors, and build more robust applications.

For more detailed information and examples, refer to the official documentation: [https://github.com/nafishahmeddev/dval](https://github.com/nafishahmeddev/dval).

## License

This project is licensed under the MIT License: [https://opensource.org/licenses/MIT](https://opensource.org/licenses/MIT).
