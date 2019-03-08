var main = function parseInputCsv() {
  console.log(new Date() + " I am inside parseInputCsv");

  const csvFilePath = "ct_parcels_file_2.csv";
  const csv = require("csvtojson");
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      //console.log(jsonObj);
      var uniqueAddressList = getUniqueAddresses(jsonObj);
      generateCsvOfUniqueAddressList(uniqueAddressList);
    });
};

function getUniqueAddresses(jsonObj) {
  // unique parcel === unique address
  var uniqueParcelList = new Array();
  var uniqueAddressList = new Array();

  jsonObj.forEach(element => {
    if (!uniqueParcelList.includes(element.parcel_apn)) {
      uniqueParcelList.push(element.parcel_apn);
      uniqueAddressList.push(element);
    }
  });
  console.log(new Date() + " uniqueParcelList.count: " + uniqueParcelList.length);
  return uniqueAddressList;
}

function generateCsvOfUniqueAddressList(jsonObj) {
  // "id","parcel_apn","sthsnum","ststname","stsuffix","stcity","ststate","stzip"
  const Json2csvParser = require("json2csv").Parser;
  const fields = [
    "id",
    "parcel_apn",
    "sthsnum",
    "ststname",
    "stsuffix",
    "stcity",
    "ststate",
    "stzip"
  ];
  const opts = { fields };

  try {
    const parser = new Json2csvParser(opts);
    const csv = parser.parse(jsonObj);
    //console.log(console.log(csv);

    const fs = require("fs");

    // Data which will write in a file.
    let data = "Learning how to write in a file.";

    // Write data in 'Output.txt' .
    fs.writeFile("UniqueAddress.csv", csv, err => {
      // In case of a error throw err.
      if (err) throw err;
    });
  } catch (err) {
    console.error(err);
  }
}

main();
