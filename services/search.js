const helper = require("../helper.js");
const SearchDao = require("../dao/searchDao.js");
const express = require("express");
const { Integer } = require("better-sqlite3");
var serviceRouter = express.Router();

serviceRouter.post("/auto", function(request,response){
    //?marke=?&modell=?&erstzulassung=?&kilometer=?&region=?&adresse=?&preis=?&kraftstoffart=?
    const searchDao = new SearchDao(request.app.locals.dbConnection);
    try{
        
        var result = searchDao.loadByAll(request.body.marke,request.body.modell,request.body.erstzulassung,
                                                        request.body.maxkm, request.body.region,request.body.address, request.body.price, request.body.sprit);
        helper.log(result);
        helper.log("Service Search: " + result.length + " Cars loaded");
        response.status(200).json(helper.jsonMsgOK(result));
    }
    catch (ex){
        helper.logError("Service Search: Error loading Cars: Exception occurred: " + ex.message);
        response.status(401).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/auto/suche", function(request, response){
    const searchDao = new SearchDao(request.app.locals.dbConnection);
    try{
        var result = searchDao.loadByMarke(request.body.searchbar);
        helper.log(result);
        helper.log("Service Search: " + result.length + " Cars loaded")
        response.status(200).json(helper.jsonMsgOK(result));
    }
    catch (ex){
        helper.logError("Service Search: Error loading Cars: Exception occurred: " + ex.message);
        response.status(401).json(helper.jsonMsgError(ex.message));
    }
})

serviceRouter.get("/auto/alle", function(request, response) {
    helper.log("Service Search: Client requested all cars");

    const searchDao = new SearchDao(request.app.locals.dbConnection);
    try {        
        
        var result = searchDao.loadAll(); 
        helper.log(result)
        helper.log("Service Search: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Search: Error loading all cars. Exception occured: " + ex.message);
        response.status(401).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.delete("/auto/:id", function(request, response) {
    helper.log("Service Register: Client requested deletion of record, id=" + request.params.id);

    const searchDao = new SearchDao(request.app.locals.dbConnection);
    try {
        var obj = searchDao.loadById(request.params.id);
        registerDao.delete(request.params.id);
        helper.log("Service Search: Deletion of record successfull, id=" + request.params.id);
        response.status(200).json(helper.jsonMsgOK({ "gelöscht": true, "eintrag": obj }));
    } catch (ex) {
        helper.logError("Service Search: Error deleting record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

module.exports = serviceRouter;