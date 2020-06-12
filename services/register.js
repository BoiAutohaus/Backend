const helper = require("../helper.js");
const RegisterDao = require("../dao/registerDao.js");
const express = require("express");
var serviceRouter = express.Router();

serviceRouter.get("/register/gib/:mail", function(request, response) {
    helper.log("Service Register: Client requested one record, eMail=" + request.params.mail);

    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try {
        var result = registerDao.loadByMail(request.params.mail);
        helper.log("Service Register: Record loaded");
        
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Register: Error loading record by id. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/login", function(request, response){
    helper.log("Service Register: Client tries to login, eMail= " + request.body.mail + " ,Passwort: " + request.body.passwort);
    
    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try{
        
        var mail = registerDao.loadByMail(request.body.mail);
        
        
        if (mail.passwort == request.body.passwort){
            var success = "Successfully logged in";
            helper.log(success);
            response.status(200).json(helper.jsonMsgOK(success));
            window.alert("angemeldet")
        }
        else{
            helper.log("Failed to login! Passwort oder eMail falsch!");
            response.status(401).json(helper.jsonMsgError("Failed to login! eMail oder Passwort falsch"));
        }
        
    } catch (ex){
            helper.logError("Service Register: Error logging in, Exception occured: " + ex.message);
            response.status(400).json(helper.jsonMsgError(ex.message));
        }        
    

});

serviceRouter.get("/register/alle", function(request, response) {
    helper.log("Service Register: Client requested all records");

    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try {        
        var result = registerDao.loadAll(); 
        helper.log(result)       
        helper.log("Service Register: Records loaded, count=" + result.length);
        response.status(200).json(helper.jsonMsgOK(result));
    } catch (ex) {
        helper.logError("Service Register: Error loading all records. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.get("/register/existiert/:id", function(request, response) {
    helper.log("Service register: Client requested check, if record exists, id=" + request.params.id);

    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try {
        var result = registerDao.exists(request.params.id);
        helper.log("Service Register: Check if record exists by id=" + request.params.id + ", result=" + result);
        response.status(200).json(helper.jsonMsgOK({ "id": request.params.id, "existiert": result }));
    } catch (ex) {
        helper.logError("Service Register: Error checking if record exists. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
    }
});

serviceRouter.post("/register", function(request, response) {
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
        response.status(400).json(helper.jsonMsgError("Hinzufügen nicht möglich. Fehlende Daten: " + helper.concatArray(errorMsgs)));
        return;
    }

    const registerDao = new RegisterDao(request.app.locals.dbConnection);
    try {
        var result = registerDao.create(request.body.mail,request.body.vorname,request.body.nachname,request.body.strasse, request.body.hausnummer, request.body.ort, request.body.plz, request.body.passwort);
        helper.log("Service Register: Record inserted");
        response.status(200).json({email:'Erfolgreich ' , password: 'Registriert'});

    } catch (ex) {
        helper.logError("Service Register: Error creating new record. Exception occured: " + ex.message);
        response.status(400).json(helper.jsonMsgError(ex.message));
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