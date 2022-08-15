const fs = require("fs");

const saveToDatabase = (DB) => {
    fs.writeFileSync("./src/database/tipotestdb.json", JSON.stringify(DB, null, 2), {
        encoding: "utf8"
    })
};

module.exports = {saveToDatabase};