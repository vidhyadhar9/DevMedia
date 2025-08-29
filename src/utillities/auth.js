const validation = require('validator');



function authValidation(req) {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
        throw new Error("All fields are required");
    }

    if (!validation.isEmail(email)) {
        throw new Error("Invalid email format");
    }

    if (!validation.isStrongPassword(password, { minLength: 6 })) {
        throw new Error("Password must be at least 6 characters long");
    }
}


module.exports = authValidation;
