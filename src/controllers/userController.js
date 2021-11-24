import * as userService from "../services/userService.js";

async function signUp(req, res) {
    try {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            return res.sendStatus(400);
        }

        const registration = await userService.authenticate({ name, email, password})
    
        if (registration === null) {
            return res.sendStatus(409);
        }
    
        if (registration) {
            return res.sendStatus(201);
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export {
    signUp,
}
