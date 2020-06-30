const helper = require("../helper.js");
const { request } = require("express");


class SearchDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadByAll(marke,modell,erstzulassung,km,region,adresse,preis,kraftstoffart) {
        var list = [];
        if (erstzulassung === "Erstzulassung auswählen"){
            erstzulassung = null;
        }
        
        var sql = "SELECT * FROM Autos WHERE Marke=? AND Modell=? AND Erstzulassung=? AND Kilometer <= "+km+" AND Region=? AND Adresse=? AND Preis=? AND Kraftstoffart=?";
        var statement = this._conn.prepare(sql);
        var result = statement.all(marke,modell,erstzulassung,region,adresse,preis,kraftstoffart);

        result = helper.objectKeysToLower(result);
        //helper.log("Ergebnis: " + JSON.stringify(result));          
            
        if (helper.isUndefined(result)) 
            throw new Error("No Record found");  

        return result;
    } 

    loadByMarke(marke) {
        
        var sql = "SELECT * FROM Autos WHERE Marke=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(marke);
        
        if (helper.isUndefined(result)) 
            throw new Error("No Record found by Marke=" + marke);

        result = helper.objectKeysToLower(result);
        

        return result;
    } 

    loadById(id) {

        var sql = "SELECT * FROM Autos WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + id);

        result = helper.objectKeysToLower(result);


        return result;
    }

    loadByModell(modell){
        var sql = "SELECT * FROM Autos WHERE Modell=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(modell);

        if (helper.isUndefined(result)){
            throw new Error("No Record found by Modell=" + modell);
        }
        return result;
    }

    loadByErstzulassung(zulassung){
        var sql = "SELECT * FROM Autos WHERE Erstzulassung=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(zulassung);

        if (helper.isUndefined(result)){
            throw new Error("No Record found by Erstzulassung=" + zulassung);
        }
        return result;
    }

    loadByKilometer(km){
        var sql = "SELECT * FROM Autos WHERE Kilometer=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(km);

        if (helper.isUndefined(result)){
            throw new Error("No Record found by Kilometer=" + km);
        }
        return result;
    }

    loadByRegion(region){
        var sql = "SELECT * FROM Autos WHERE Region=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(region);

        if (helper.isUndefined(result)){
            throw new Error("No Record found by Region=" + region);
        }
        return result;
    }

    loadByAdresse(adresse){
        var sql = "SELECT * FROM Autos WHERE Adresse=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(adresse);

        if (helper.isUndefined(result)){
            throw new Error("No Record found by Adresse=" + adresse);
        }
        return result;
    }

    loadByPreis(preis){
        var sql = "SELECT * FROM Autos WHERE Preis=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(preis);

        if (helper.isUndefined(result)){
            throw new Error("No Record found by Preis=" + preis);
        }
        return result;
    }

    loadByKraftstoffart(ksa){
        var sql = "SELECT * FROM Autos WHERE Kraftstoffart=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(ksa);

        if (helper.isUndefined(result)){
            throw new Error("No Record found by Kraftstoffart=" + ksa);
        }
        return result;
    }

    loadAll() {

        var sql = "SELECT * FROM Autos";
        
        var statement = this._conn.prepare(sql);
         
        var result = statement.all();
        
        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);     

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Autos WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Autos WHERE ID=?";
            var statement = this._conn.prepare(sql);
            var result = statement.run(id);

            if (result.changes != 1) 
                throw new Error("Could not delete Record by id=" + id);

            return true;
        } catch (ex) {
            throw new Error("Could not delete Record by id=" + id + ". Reason: " + ex.message);
        }
    }

    toString() {
        helper.log("SearchDao [_conn=" + this._conn + "]");
    }
}

module.exports = SearchDao;