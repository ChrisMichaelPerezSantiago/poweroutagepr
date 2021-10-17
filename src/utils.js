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

module.exports = {
  renameKey,
  toLocaleTimeString,
};
