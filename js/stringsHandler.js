class StringsHandler {
    static TAG = "String"
    /**
       * Returns sections
       * @param {Function} callback callback for handling response
       */
     static get = (callBack) => {
        buildfire.publicData.search({isActive: false}, StringsHandler.TAG, (error, record) => {

          if (error) callBack(err,null);
          if(record[0]){
              if(record[0].data)
                return callBack(null,record[0].data);
            return(callBack(null,null));
          }
             
        });
      };


      /**
   * Updates barcode
   * @param {Object} data data to be updated
   * @param {Function} callback callback for handling response 
   */
  static set = (data, callback) => {
    const cmd = {
      $set: {
        actionItems: data,
        lastUpdatedOn: new Date()
      }
    };

    buildfire.publicData.save(data, StringsHandler.TAG, (error, record) => {
      if (error) return callback(error);

      if (record) {
        console.log(record);
        return callback(null, record);
      };
    });
  };
  };