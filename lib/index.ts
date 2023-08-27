import Nix from "./nix";

const nix = new Nix({
    email : Nix.number("Email should be number").email("Invalid email address")
});

const errors = nix.validate({
    email: 4546
});

console.log(JSON.stringify(errors, null, 2));