const Nix = require("../dist/nix");
const nix = new Nix.default(Nix.default.array([
    Nix.default.object({
        email: Nix.default.string("Email should be number").email("Invalid email address")
    })
]).max(2, "At least add a value"));

const errors = nix.validate([{
    email: "nafish.ahmed@gmail.com"
}]);
console.log(JSON.stringify(errors, null, 2));
