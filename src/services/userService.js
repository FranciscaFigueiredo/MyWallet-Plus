import bcrypt from "bcrypt";
import * as userRepository from "../repositories/userRepository.js"

async function authenticate({ name, email, password }) {
    const search = await userRepository.findEmail({ email })

    if (search.length) {
        return null;
    }

    const hashedPassword = bcrypt.hashSync(password, 12);

    const createUser = await userRepository.create({ name, email, password: hashedPassword })

    return createUser;
}

export {
    authenticate,
}