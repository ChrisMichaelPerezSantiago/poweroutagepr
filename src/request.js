const {
  axios,
  flexFetch: { flexF, responseLookup },
} = require("./common");

/**
 * @param  {String} url
 */
module.exports = (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = responseLookup(
        await flexF(axios)({
          method: "get",
          url: url,
          requestConfig: {
            responseType: "json",
          },
        })
      );
      const json = response("status") === 200 ? response("data") : null;
      resolve(json);
    } catch (error) {
      const e = new Error(error);
      reject(e);
    }
  });
};
