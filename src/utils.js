const renameKey = (obj, old_key, new_key) => {
  if (old_key !== new_key) {
    Object.defineProperty(
      obj,
      new_key,
      Object.getOwnPropertyDescriptor(obj, old_key)
    );
    delete obj[old_key];
  }
};

/**
 *
 * @param {Date} datetime
 * @returns
 */
const toLocaleTimeString = (datetime) => {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };
  datetime = datetime.toLocaleTimeString("en-us", options);
  return datetime;
};

const toCSV = (obj, header) => {
  if (header) obj.unshift(header);

  const array = typeof obj != "object" ? JSON.parse(obj) : obj;
  let str = "";
  for (let i = 0; i < array.length; i++) {
    let line = "";
    for (let index in array[i]) {
      if (line != "") line += ",";
      line += array[i][index];
    }
    str += line + "\r\n";
  }
  return str;
};

module.exports = {
  renameKey,
  toLocaleTimeString,
  toCSV,
};
