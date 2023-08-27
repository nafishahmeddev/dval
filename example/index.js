const Dval = require("../dist");

const dval = new Dval(Dval.array([
    Dval.object({
        email: Dval.string("Email should be number").email("Invalid email address")
    })
]).max(2, "At least add a value"));

const errors = dval.validate([{
    email: "nafish.ahmed@gmail.com"
}]);
console.log(JSON.stringify(errors, null, 2));
