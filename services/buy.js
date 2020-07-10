const helper = require("../helper.js");
const BuyDao = require("../dao/buyDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.post("/buy", function(request,response){
   

    const buyDao = new BuyDao(request.app.locals.dbConnection); 
    helper.log(request.body.id); 
    helper.log("Service Buy: Client tries to buy: " + buyDao.loadById(request.body.id));  

    try{
        var Id = request.body.id;
        buyDao.changeById(Id);
        helper.log("Wurde erfolgreich gekauft");
        response.status(200).json(helper.jsonMsgOK({respo : "Erfolgreich gekauft", id : Id}))
    }
    catch (ex){
        helper.logError("Service Buy: Error buying car, Exception occured: " + ex.message);
        response.status(401).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;