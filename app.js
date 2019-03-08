var main = function parseInputCsv() {
  console.log(new Date() + " I am inside parseInputCsv");

  const csvFilePath = "ct_parcels_file_2.csv";
  const csv = require("csvtojson");
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      var uniqueAddressList = getStats(jsonObj);
      //generateCsvOfUniqueAddressList(uniqueAddressList);
    });
};

function getStats(jsonObj) {
  var HashMap = require("hashmap");

  var parcelMap = new HashMap();
  var zipcodeMap = new HashMap();
  var cityMap = new HashMap();

  var maxDuplicateParcels = 0;

  jsonObj.forEach(element => {
    // group by parcel
    var parcelKey = element.parcel_apn;
    if (!parcelMap.has(parcelKey)) {
      parcelMap.set(parcelKey, 1);
    } else {
      var currentCount = parcelMap.get(parcelKey);
      parcelMap.set(parcelKey, currentCount + 1);
      if (currentCount + 1 > maxDuplicateParcels) {
        maxDuplicateParcels = currentCount + 1;
      }
    }

    // group by zipcode
    var zipKey = element.stzip;
    if (!zipcodeMap.has(zipKey)) {
      zipcodeMap.set(zipKey, 1);
    } else {
      zipcodeMap.set(zipKey, zipcodeMap.get(zipKey) + 1);
    }

    // group by city
    var cityKey = element.ststate + "-" + element.stcity;
    if (!cityMap.has(cityKey)) {
      cityMap.set(cityKey, 1);
    } else {
      cityMap.set(cityKey, cityMap.get(cityKey) + 1);
    }
  });

  console.log(new Date() + " uniqueParcelList.count: " + parcelMap.size);

  console.log(
    "Number of duplicate entries in the File: " +
      (jsonObj.length - parcelMap.size)
  );
  console.log("Grouping of row count by Zip Code: " + zipcodeMap.size);
  console.log("Grouping of row count by City: " + cityMap.size);
  console.log(
    "Address with the most amount of duplicates (" +
      maxDuplicateParcels +
      "): " +
      parcelMap.search(maxDuplicateParcels)
  );

  var minCity = null;
  var minCityCount = null;
  cityMap.forEach(function(value, key) {
    if (minCityCount == null || minCityCount < value) {
      minCityCount = value;
      minCity = key;
    }
  });
  console.log("City with the least # of addresses (" + minCityCount + "): " + minCity);

  var uniqueAddressList = new Array();
  parcelMap.forEach(function(value, key) {
    uniqueAddressList.push(value);
  });

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
