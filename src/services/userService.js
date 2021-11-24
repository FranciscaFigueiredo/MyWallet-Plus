import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository.js"

async function authenticateRegistration({ name, email, password }) {
    const search = await userRepository.findEmail({ email });

    if (search.length) {
        return null;
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const createUser = await userRepository.create({ name, email, password: hashedPassword });

    return createUser;
}

async function authenticateEntry({ email, password }) {
    const user = await userRepository.findEmail({ email });
    
    if (!user.length) {
        return null;
    }

    const comparePassword = bcrypt.compareSync(password, user[0].password);

    if (!comparePassword) {
        return null;
    }

    const token = jwt.sign({
        id: user[0].id,
    }, process.env.JWT_SECRET);

    return token;
}

export {
    authenticateRegistration,
    authenticateEntry,
}