import * as financeRepository from "../repositories/financeRepository.js";

async function postEvents(req, res) {
    const userId = res.locals.user.id;

    try {    
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

async function getEvents(req, res) {
    const userId = res.locals.user.id;
    
    try {    
        const events = await financeRepository.findFinancialEvents({ userId })

        if (events) {
            return res.send(events);
        }
    } catch (err) {
        console.error(err);
        return res.sendStatus(500);
    }  
}

async function sumEvents(req, res) {
    const userId = res.locals.user.id;
    
    try {    
        const sum = await financeRepository.sumFinancialEvents({ userId })

        if ({sum}) {
            return res.send({ sum });
        }
      } catch (err) {
        console.error(err);
        return res.sendStatus(500);
      }  
}

export {
    postEvents,
    getEvents,
    sumEvents,
}
