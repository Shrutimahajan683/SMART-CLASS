exports.ObjecttoArrayConverter = (payload, keytobeExtracted) => {
    // console.log(payload);
    // console.log(keytobeExtracted);
    try {
      let arrayToBereturned = [];
      payload.map((item) => {
        arrayToBereturned.push(item[`${keytobeExtracted}`]);
      });
      return arrayToBereturned;
    } catch (e) {
      console.log(e);
      return arrayToBereturned;
    }
  };
  