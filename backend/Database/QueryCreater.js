exports.insertQuery = (table_name, params) => {
    let column_array = "";
    let column_value_array = "";
    if (params == undefined) {
      console.log("empty params");
    }
    Object.keys(params).map((item, index) => {
      column_array = column_array + `"${item}"`;
      if (String(params[`${item}`]).match(/current/gi) == null) {
        column_value_array = column_value_array + `'${params[`${item}`]}'`;
      } else {
        column_value_array = column_value_array + `${params[`${item}`]}`;
      }
      if (index < Object.keys(params).length - 1) {
        column_array = column_array + ",";
        column_value_array = column_value_array + ",";
      }
    });
  
    let query = `insert into ${table_name} (${column_array}) values (${column_value_array})`;
    return query;
  };
  ///select quer Creator
  exports.selectQuery = (table_name, params, operators) => {
    let search_query = "";
    Object.keys(params).map((item, index) => {
      if (String(params[`${item}`]).match(/current/gi) == null) {
        search_query = search_query + `${item}='${params[`${item}`]}'` + " ";
      } else {
        search_query = search_query + `${item}=${params[`${item}`]}` + " ";
      }
  
      if (index < Object.keys(params).length - 1) {
        search_query = search_query + `${operators[index]} `;
      }
    });
  
    let query = `select * from ${table_name} where ${search_query}`;
    return query;
  };
  