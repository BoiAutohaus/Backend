const helper = require("../helper.js");


class RegisterDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
    }

    loadByMail(mail) {

        var sql = "SELECT * FROM Kundenadresse WHERE eMail=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(mail);

        if (helper.isUndefined(result)) 
            throw new Error("No Record found by id=" + mail);

        result = helper.objectKeysToLower(result);


        return result;
    }

    loadAll() {

        var sql = "SELECT * FROM Kundenadresse";
        
        var statement = this._conn.prepare(sql);
         
        var result = statement.all();
        
        if (helper.isArrayEmpty(result)) 
            return [];
        
        result = helper.arrayObjectKeysToLower(result);     

        return result;
    }

    exists(id) {
        var sql = "SELECT COUNT(ID) AS cnt FROM Kundenadresse WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (result.cnt == 1) 
            return true;

        return false;
    }

    create(strasse = "", hausnummer = "", adresszusatz = "", plz = "", ort = "") {
        var sql = "INSERT INTO Kundenadresse (Strasse,Hausnummer,Adresszusatz,PLZ,Ort) VALUES (?,?,?,?,?)";
        var statement = this._conn.prepare(sql);
        var params = [strasse, hausnummer, adresszusatz, plz, ort];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not insert new Record. Data: " + params);

        var newObj = this.loadById(result.lastInsertRowid);
        return newObj;
    }

    update(id, strasse = "", hausnummer = "", adresszusatz = "", plz = "", ort = "") {
        var sql = "UPDATE Kundenadresse SET Strasse=?,Hausnummer=?,Adresszusatz=?,PLZ=?,Ort=? WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var params = [strasse, hausnummer, adresszusatz, plz, ort, id];
        var result = statement.run(params);

        if (result.changes != 1) 
            throw new Error("Could not update existing Record. Data: " + params);

        var updatedObj = this.loadById(id);
        return updatedObj;
    }

    delete(id) {
        try {
            var sql = "DELETE FROM Kundenadresse WHERE ID=?";
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
        helper.log("RegisterDao [_conn=" + this._conn + "]");
    }
}

module.exports = RegisterDao;