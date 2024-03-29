const { Client } = require("@elastic/elasticsearch");
const client = new Client({ node: "http://elasticsearch:9200" });

var config = require("../config/config");

// CAUTION: The elasticsearch requests are limited to the range 0 to 5000
//  if more than 5000 logs were generated queries might not return all generated logs!
//  This is for demonstrating purposes - in real world scenarions "scroll" or
//  chunk loading should be used

/**
 * Gets all the logs that are associated to the user.
 *  These could be logs created by actions of the user himself or logs
 *  containing data that is owned by the user.
 *
 * @param {string} reqUsername The username of the user that is requesting the logs.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.getUserLogs = function (reqUsername, resCallback) {
  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          multi_match: {
            query: reqUsername, // if at least one of the fields includes reqUsername
            fields: ["user_name", "data_owner"], // include in response
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching logs from elasticsearch.");
        resCallback(500, err);
        return;
      }

      var response = {
        total: result.body.hits.total,
        logs: result.body.hits.hits,
      };

      if (config.CONSOLE_LOGGING)
        console.log(
          `fetched ${result.body.hits.total} logs for user ${reqUsername}!`
        );

      resCallback(200, response);
    }
  );
};

/**
 * Gets the log entries for the fileId that are associated with file sharing.
 *
 * @param {string} reqUsername The username of the current user.
 * @param {string} dataId The fileId of the file.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.getSharedInstances = function (reqUsername, dataId, resCallback) {
  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          bool: {
            must: [
              {
                multi_match: {
                  query: reqUsername, // if at least one of the fields includes reqUsername
                  fields: ["user_name", "data_owner"], // include in response
                },
              },
              {
                multi_match: {
                  query: "share", // only include logs with category "share"
                  fields: ["category"],
                },
              },
              {
                term: {
                  data_id: dataId,
                },
              },
            ],
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching logs from elasticsearch.");
        resCallback(500, err);
        return;
      }

      var response = {
        total: result.body.hits.total,
        logs: result.body.hits.hits,
      };

      if (config.CONSOLE_LOGGING)
        console.log(
          `fetched ${result.body.hits.total} logs of data sharing for user ${reqUsername} and file id ${dataId}!`
        );

      resCallback(200, response);
    }
  );
};

/**
 * Allows filtering of logs.
 *
 * @param {string} reqUsername The username of the current user.
 * @param {*} reqQuery The query with the query parameters for the filters.
 * @param {*} resCallback The callback for the Router containing the status and message.
 */
exports.filterLogs = function (reqUsername, reqQuery, resCallback) {
  if (!reqQuery || Object.keys(reqQuery).length === 0) {
    resCallback(
      404,
      "Request contained no queries for filtering. Possible queries: prios, categories, dataId."
    );
    return;
  }

  // default to all prios if no prio was provided
  var prios = [1, 2, 3, 4];
  if (reqQuery.prios != undefined) {
    prios = reqQuery.prios.split(",");
  }

  var queries = [];
  queries.push({
    terms: {
      priority: prios,
    },
  });

  // add categories to filter (filter by category)
  if (reqQuery.categories != undefined) {
    categories = reqQuery.categories.split(",");
    queries.push({
      terms: {
        category: categories,
      },
    });
  }

  // add dataIDs to filter (filter by file ID)
  if (reqQuery.dataId != undefined) {
    queries.push({
      term: {
        data_id: reqQuery.dataId,
      },
    });
  }

  // add data names to filter (filter by file name)
  if (reqQuery.dataName != undefined) {
    queries.push({
      query_string: {
        default_field: "data_name",
        query: `*${reqQuery.dataName}*`,
      },
    });
  }

  // add session id to filter (filter by session id)
  if (reqQuery.session != undefined) {
    queries.push({
      query_string: {
        default_field: "session",
        query: `${reqQuery.session.replace("{", "").replace("}", "")}`,
      },
    });
  }

  // add user name to filter (filter by user name)
  if (reqQuery.user != undefined) {
    queries.push({
      query_string: {
        default_field: "user_name",
        query: `*${reqQuery.user}*`,
      },
    });
  }

  // add user ip to filter (filter by user ip)
  if (reqQuery.user_ip != undefined) {
    queries.push({
      query_string: {
        default_field: "user_ip",
        query: `${reqQuery.user_ip.replace("{", "").replace("}", "")}`,
      },
    });
  }

  client.search(
    {
      index: "logs-*",
      body: {
        from: 0,
        size: 5000,
        query: {
          bool: {
            must: {
              multi_match: {
                query: reqUsername, // if at least one of the fields includes reqUsername
                fields: ["user_name", "data_owner"], // include in response
              },
            },
            must: [queries], // add filters to search request
          },
        },
      },
    },
    (err, result) => {
      if (err) {
        console.log("Error while fetching files.");
        console.log(err);
        resCallback(500, err);
        return;
      }

      var response = {
        total: result.body.hits.total,
        logs: result.body.hits.hits,
      };

      if (config.CONSOLE_LOGGING)
        console.log(
          `fetched ${result.body.hits.total} logs for user ${reqUsername}!`
        );
      resCallback(200, response);
    }
  );
};
