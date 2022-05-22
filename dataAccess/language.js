const Languages = {
    TAG: "$bfLanguageSettings_en-us",
    get: async (callback) => {
      await buildfire.datastore.get(Languages.TAG, (err, res) => {
        if (err) return callback(err, null);
        else return callback(null, res);
      });
    },
    save: async (obj, callback) => {
      await buildfire.datastore.save(
        new Language(obj),
        Languages.TAG,
        (err, res) => {
          if (err) return callback(err, null);
          else return callback(null, res);
        }
      );
    },
    update: async (id, obj, callback) => {
      await buildfire.datastore.update(id, obj, Languages.TAG, (err, res) => {
        if (err) return callback(err, null);
        else return callback(null, res);
      });
    },
    onUpdate: async (callback) => {
      await buildfire.datastore.onUpdate((e) => {
        return callback(e);
      });
    },
};