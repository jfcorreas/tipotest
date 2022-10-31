const fs = require("fs");

const saveToDatabase = (DB) => {
    fs.writeFileSync("./src/database/tipotestdb.json", JSON.stringify(DB, null, 2), {
        encoding: "utf8"
    })
};

// https://advancedweb.hu/how-to-use-async-functions-with-array-filter-in-javascript/
const asyncFilter = async (arr, predicate) => 
	arr.reduce(async (memo, e) => 
		[...await memo, ...await predicate(e) ? [e] : []]
	, []);

module.exports = {saveToDatabase , asyncFilter};