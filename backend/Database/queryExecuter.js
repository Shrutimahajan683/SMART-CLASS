const { response } = require("express");
const pool = require("../server");

exports.queryExecutor = async (query) => {
  let results = {};
  try {
    //console.log(query)
    results = await pool.pool.query(query);
  } catch (e) {
    return e
    // console.log(query);
  }
  return results;
};
