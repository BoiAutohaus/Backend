const helper = require("../helper.js");
const SearchDao = require("../dao/searchDao.js");
const express = require("express");
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
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

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

serviceRouter.get("/auto/existiert/:id", function(request, response) {
    helper.log("Service Search: Client requested check, if car exists, id=" + request.params.id);

    const searchDao = new SearchDao(request.app.locals.dbConnection);
    try {
        var result = searchDao.exists(request.params.id);
        helper.log("Service Search: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Search: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

/*serviceRouter.post("/register", function(request, response) {
    helper.log("Service Register: Client requested creation of new record");
    helper.log(request.body.passwort)
    var errorMsgs=[];
    if (helper.isUndefined(request.body.strasse)) 
        errorMsgs.push("strasse fehlt");
    if (helper.isUndefined(request.body.hausnummer)) 
        errorMsgs.push("hausnummer fehlt");
    if (helper.isUndefined(request.body.plz)) 
        errorMsgs.push("plz fehlt");
    if (helper.isUndefined(request.body.ort)) 
        errorMsgs.push("ort fehlt");
    
    
    if (errorMsgs.length > 0) {
        helper.log("Service Register: Creation not possible, data missing");
        response.status(400).json({respo :"Hinzufügen nicht möglich. Fehlende Daten: " });
        return;
    }

    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try {
        var result = registerDao.create(request.body.mail,request.body.vorname,request.body.nachname,request.body.strasse, request.body.hausnummer, request.body.ort, request.body.plz, request.body.passwort);
        helper.log("Service Register: Record inserted");
        response.status(200).json({ email:'erfolgreich' , password: 'registriert'});

    } catch (ex) {
        helper.logError("Service Register: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json({respo : 'Couldnt create new record.'});
    }    
});

serviceRouter.put("/register", function(request, response) {
    helper.log("Service Register: Client requested update of existing record");

    var errorMsgs=[];
    if (helper.isUndefined(request.body.id)) 
        errorMsgs.push("id fehl");
    if (helper.isUndefined(request.body.strasse)) 
        errorMsgs.push("strasse fehl");
    if (helper.isUndefined(request.body.hausnummer)) 
        errorMsgs.push("hausnummer fehl");
    if (helper.isUndefined(request.body.plz)) 
        errorMsgs.push("plz fehl");
    if (helper.isUndefined(request.body.ort)) 
        errorMsgs.push("ort fehl");

    if (errorMsgs.length > 0) {
        helper.log("Service Register: Update not possible, data missing");
        response.status(400).json(helper.jsonMsgError("Update nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try {
        var result = registerDao.update(request.body.id, request.body.strasse, request.body.hausnummer, request.body.adresszusatz, request.body.plz, request.body.ort);
        helper.log("Service Register: Record updated, id=" + request.body.id);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Register: Error updating record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }    
});*/

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