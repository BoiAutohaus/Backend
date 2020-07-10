const helper = require("../helper.js");


class BuyDao {

    constructor(dbConnection) {
        this._conn = dbConnection;
    }

    getConnection() {
        return this._conn;
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

    changeById(id){
        var sql = "UPDATE Autos SET Verkauft = 1 WHERE ID=?";
        var statement = this._conn.prepare(sql);
        var result = statement.get(id);

        if (helper.isUndefined(result))
            throw new Error ("Error when buying Car. Contact Admin");
        result = helper.objectKeysToLower(result);
        
        return result;
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
        helper.log("RegisterDao [_conn=" + this._conn + "]");
    }
}

module.exports = BuyDao;