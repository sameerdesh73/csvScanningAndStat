var main = function parseInputCsv() {
  console.log(new Date() + " I am inside parseInputCsv");

  const csvFilePath = "csv\\ct_parcels_file_1.csv";
  const csv = require("csvtojson");
  csv()
    .fromFile(csvFilePath)
    .then(jsonObj => {
      var uniqueAddressList = getStats(jsonObj);
      generateCsvOfUniqueAddressList(uniqueAddressList);
    });
};

function getStats(jsonObj) {
  var HashMap = require("hashmap");

  var parcelMap = new HashMap();
  var uniqueAddressList = new Array();

  var zipcodeMap = new HashMap();
  var cityMap = new HashMap();

  var maxDuplicateParcel = null;
  var maxDuplicateParcelCount = null;

  var minCity = null;
  var minCityCount = null;

  jsonObj.forEach(element => {
    // group by parcel
    var parcelKey = element.parcel_apn;
    var newParcelCount;
    if (!parcelMap.has(parcelKey)) {
      newParcelCount = 1;
      uniqueAddressList.push(element);
    } else {
      newParcelCount = parcelMap.get(parcelKey) + 1;
    }
    parcelMap.set(parcelKey, newParcelCount);
    if (
      maxDuplicateParcelCount == null ||
      newParcelCount > maxDuplicateParcelCount
    ) {
      maxDuplicateParcelCount = newParcelCount;
      maxDuplicateParcel = parcelKey;
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
    var newCityCount;
    if (!cityMap.has(cityKey)) {
      newCityCount = 1;
    } else {
      newCityCount = cityMap.get(cityKey) + 1;
    }
    cityMap.set(cityKey, newCityCount);
    if (minCityCount == null || newCityCount < minCityCount) {
      minCityCount = newCityCount;
      minCity = cityKey;
    }
  });

  console.log(new Date() + " uniqueParcelList.count: " + parcelMap.size);

  console.log();
  console.log(
    "Number of duplicate entries in the File: " +
      (jsonObj.length - parcelMap.size)
  );

  console.log();
  console.log("Grouping of row count by Zip Code, size: " + zipcodeMap.size);
  zipcodeMap.forEach(function(value, key) {
    console.log("Zip: " + key + ", Count: " + value);
  });

  console.log();
  console.log("Grouping of row count by City, size: " + cityMap.size);
  cityMap.forEach(function(value, key) {
    console.log("City: " + key + ", Count: " + value);
  });

  console.log();
  console.log(
    "Address with the most amount of duplicates (" +
      maxDuplicateParcelCount +
      "): " +
      maxDuplicateParcel
  );

  console.log();
  console.log(
    "City with the least # of addresses (" + minCityCount + "): " + minCity
  );

  return uniqueAddressList;
}

function generateCsvOfUniqueAddressList(jsonObj) {
  // "id","parcel_apn","sthsnum","ststname","stsuffix","stcity","ststate","stzip"

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

  const Json2csvParser = require("json2csv").Parser;
  const parser = new Json2csvParser(opts);

  try {
    const fs = require("fs");
    let writeStream = fs.createWriteStream("csv\\csvUniqueAddress.csv");

    jsonObj.forEach(item => {
      let csv = parser.parse(item);
      writeStream.write(csv);
    });
    // close the stream
    writeStream.end();
  } catch (err) {
    console.error(err);
  }
}

main();
