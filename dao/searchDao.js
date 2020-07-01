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
        
        if (erstzulassung === "Erstzulassung auswählen"){
            erstzulassung = null;
        }
        if (marke === "Marke wählen"){
            marke = null;
        }
        if (region === "Region auswählen"){
            region = null;
        }
        if (kraftstoffart === "Kraftstoffart auswählen"){
            kraftstoffart = null;
        }
        
        var sql = "SELECT * FROM Autos WHERE Marke=? AND Modell=? AND Erstzulassung=? AND Kilometer <= ? AND Region=? AND Adresse=? AND Preis <=? AND Kraftstoffart=?";
        var statement = this._conn.prepare(sql);
        var result = statement.all(marke,modell,erstzulassung,km,region,adresse,preis,kraftstoffart);

        result = helper.objectKeysToLower(result);
        //helper.log("Ergebnis: " + JSON.stringify(result));          
            
        if (helper.isUndefined(result)) 
            throw new Error("No Record found");  

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