class Storage {
  load = (key) => {
    const value = localStorage.getItem(key);
    return JSON.parse(value);
  };

  save = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  };
}

const storage = new Storage();

export { storage };
