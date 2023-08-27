"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nix_1 = require("./nix");
const nix = new nix_1.default({
    email: nix_1.default.number("Email should be number").email("Invalid email address")
});
const errors = nix.validate({
    email: 4546
});
console.log(JSON.stringify(errors, null, 2));
