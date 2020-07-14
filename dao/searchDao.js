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
        if (marke === "Marke auswählen"){
            throw new Error("Marke not defined. Please Select Marke");
        }
        if (modell == null){
            throw new Error("Please select Modell");
        }
        if (erstzulassung === "Erstzulassung auswählen"){            
            throw new Error("Erstzulassung not defined. Please Select Erstzulassung");
        }
        if (km == null){
            throw new Error("Please insert Kilometer");
        }        
        if (region === "Region auswählen"){
            region = "Baden-Württemberg";
        }
        if (preis == null){
            throw new Error("Please insert Preis");
        }
        if (kraftstoffart === "Kraftstoffart auswählen"){
            throw new Error("Kraftstoffart not defined. Please Select Kraftstoffart");
        }
        
        var sql = "SELECT * FROM Autos WHERE Marke=? AND Modell=? AND Erstzulassung=? AND Kilometer <= ? AND Region=? AND Adresse=? AND Preis <=? AND Kraftstoffart=? AND Verkauft=0";
        var statement = this._conn.prepare(sql);
        var result = statement.all(marke,modell,erstzulassung,km,region,adresse,preis,kraftstoffart);
       

        result = helper.objectKeysToLower(result);
        //helper.log("Ergebnis: " + JSON.stringify(result));  
        helper.log("Das auto: " + result);        
            
        if (helper.isUndefined(result)) 
            throw new Error("No Record found");  

        return result;
    } 

    loadByMarke(marke) {

        var sql = "SELECT * FROM Autos WHERE Marke=? AND Verkauft=0";
        var statement = this._conn.prepare(sql);
        var result = statement.all(marke);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + marke);

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