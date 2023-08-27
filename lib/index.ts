import Nix from "./nix";

const nix = new Nix(Nix.array([
    Nix.object({
        email: Nix.number("Email should be number").email("Invalid email address")
    })
]).max(2, "At least add a value"));

const errors = nix.validate([{
    email: 4546
}]);

console.log(JSON.stringify(errors, null, 2));