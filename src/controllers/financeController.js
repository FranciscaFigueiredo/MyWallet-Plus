import * as financeRepository from "../repositories/financeRepository.js";

async function postEvents(req, res) {
    try {
        const userId = res.locals.user.idUser;
    
        const { value, type } = req.body;
    
        if (!value || !type) {
            return res.sendStatus(400);
        }
    
        if (!['INCOME', 'OUTCOME'].includes(type)) {
            return res.sendStatus(400);
        }
    
        if (value < 0) {
            return res.sendStatus(400);
        }
    
        const post = financeRepository.create({ userId, value, type })
    
        if (post) {
            return res.sendStatus(201);
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }
}

export {
    postEvents,
}
