import * as userService from "../services/userService.js";

async function signUp(req, res) {
    try {
        const { name, email, password } = req.body;
    
        if (!name || !email || !password) {
            return res.sendStatus(400);
        }

        const registration = await userService.authenticateRegistration({ name, email, password})
    
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

async function signIn(req, res) {
    try {
        const { email, password } = req.body;
    
        if (!email || !password) {
            return res.sendStatus(400);
        }
    
        const user = await userService.authenticateEntry({ email, password })
    
        if (user === null) {
            return res.sendStatus(401);
        }
        const token = user
    
        if (token) {
            return res.status(200).send({
                token
            });
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export {
    signUp,
    signIn,
}
