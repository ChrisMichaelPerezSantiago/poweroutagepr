const request = require("./request");
const fs = require("fs");
const {
  cheerio: { load },
  tabletojson,
} = require("./common");
const { renameKey, toLocaleTimeString, toCSV } = require("./utils");

const getDataByRegion = async () => {
  const res = await request(`https://poweroutage.us/area/utility/1489`);
  const $ = load(res);
  const html = $.html();
  let table = tabletojson.convert(html);

  const headerInfo = $("body div.container.body-content div.row:nth(1)")
    .map(
      (_, element) =>
        new Promise((resolve, reject) => {
          try {
            const $element = $(element);
            const customersTracked = $element
              .find("div.col-xs-12.col-sm-4:nth(0)")
              .eq(0)
              .text()
              .split(":")[1]
              .trim();
            const utilityOutage = $element
              .find("div.col-xs-12.col-sm-4:nth(1)")
              .eq(0)
              .text()
              .split(":")[1]
              .trim();
            let datetime = $element
              .find("div.col-xs-12.col-sm-4:nth(2)")
              .eq(0)
              .text()
              .trim();

            datetime =
              datetime &&
              datetime
                .substring(datetime.indexOf(":") + 1)
                .trim()
                .split(" ");

            datetime = new Date(
              `${datetime[0]}, ${datetime[1]} ${datetime[2]} ${datetime[3]}`
            );

            datetime = toLocaleTimeString(datetime);

            resolve({
              CustomersTracked: customersTracked,
              UtilityOutage: utilityOutage,
              LastUpdated: datetime,
            });
          } catch (error) {
            const e = new Error(error);
            reject(e);
          }
        })
    )
    .get();

  const header = await Promise.all(headerInfo);

  table.map((doc) => {
    doc.forEach((obj) =>
      renameKey(obj, "Customers Tracked", "CustomersTracked")
    );
    doc.forEach((obj) => renameKey(obj, "Customers Out", "CustomersOut"));
  });

  table = table[0].map((prop) => ({
    County: prop.County,
    CustomersTracked: parseInt(prop.CustomersTracked.replace(/\,/g, ""), 10),
    CustomersOut: parseInt(prop.CustomersOut.replace(/\,/g, ""), 10),
  }));

  return {
    header,
    table,
  };
};

const dataToCSV = async () => {
  const json = await getDataByRegion();
  const header = {
    County: "County",
    CustomersTracked: "Customers Tracked",
    CustomersOut: "Customers Out",
  };
  const csv = toCSV(json.table, header).trim();

  const fileName = (json.header[0].LastUpdated + ".csv" || "export.csv")
    .trim()
    .replace(new RegExp("/", "g"), "-");

  const path = `csv/${fileName}`;

  fs.exists(path, function (isExist) {
    if (isExist) {
      console.error("Path Exist:", path);
    } else {
      fs.appendFile(path, csv, (err) => {
        console.log(csv);
        if (err) throw err;
      });
    }
  });
};

module.exports = {
  getDataByRegion,
  dataToCSV,
};
