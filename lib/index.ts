import Nix from "./nix";

const nix = new Nix(Nix.array([
    Nix.object({
        email: Nix.string("Email should be number").email("Invalid email address")
    })
]).max(2, "At least add a value"));

const errors = nix.validate([{
    email: "nafish.ahmed@gmail.com"
}]);

console.log(JSON.stringify(errors, null, 2));