const helper = require("../helper.js");
const BuyDao = require("../dao/buyDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.post("/buy", function(request,response){
    helper.log("Service Buy: Client tries to buy: " + buyDao.loadById(request.body.id));

    const buyDao = new BuyDao(request.app.locals.dbConnection);
    var Id = request.body.id;

    try{
        buyDao.delete(Id);
        helper.log("Wurde erfolgreich aus der Datenbank gelöscht");
        response.status(200).json(helper.jsonMsgOK({respo : "Erfolgreich gekauft", id : Id}))
    }
    catch (ex){
        helper.logError("Service Buy: Error buying car, Exception occured: " + ex.message);
        response.status(401).json(helper.jsonMsgError(ex.message));


    }
});

serviceRouter.delete("/register/:id", function(request, response) {
    helper.log("Service Register: Client requested deletion of record, id=" + request.params.id);

    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try {
        var obj = registerDao.loadById(request.params.id);
        registerDao.delete(request.params.id);
        helper.log("Service Register: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Register: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;