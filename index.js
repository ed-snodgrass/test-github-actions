const httpsPromise = require('./https-promise');
const WHERE = 'UPPER%28CONDITION%29+IN+%28%27POOR%27%2C+%27LOW%27%2C+%27WORN+OUT%27%29+OR+%28UPPER%28OWNER_CITY%29+%3C%3E+%27OMAHA%27+AND+UPPER%28OWNER_STAT%29+%3D+%27NE%27+AND+UPPER%28PROP_CITY%29+%3D+%27OMAHA%27%29+OR+UPPER%28OWNER_STAT%29+%3C%3E+%27NE%27';

getParcelsCount().then(count => {

    console.log(`Requesting ${count} parcels.`);
    makeDataRequests(count, 1000).then(r => {
        console.log(`Retrieved ${r.length} parcels.`);
    });
});

async function getParcelsCount() {
    const count = await httpsPromise(`https://gis.dogis.org/arcgis/rest/services/OpenData_Layers/MapServer/38/query?where=${WHERE}&returnCountOnly=true&f=json`);
    return JSON.parse(count.body).count;
}

const FIELDS = 'OBJECTID, PIN, OWNER_NAME, ADDRESS1, ADDRESS2, OWNER_CITY, OWNER_STAT, OWNER_ZIP, PROPERTY_A, HOUSE, APARTMENT, PROP_CITY, PROP_ZIP, BLOCK, LOT, CLASS, QUALITY, CONDITION, ADDRESS_LA';
const getParcelsUrl = (resultOffset, resultRecordCount) => `https://gis.dogis.org/arcgis/rest/services/OpenData_Layers/MapServer/38/query?where=${WHERE}&text=&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=${FIELDS}&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=${resultOffset}&resultRecordCount=${resultRecordCount}&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&featureEncoding=esriDefault&f=json`;

async function getParcels(page, pageSize) {
    const pageUrl = getParcelsUrl(page, pageSize);
    console.log(pageUrl);
    const parcelsFeaturesResponse = await httpsPromise(pageUrl);
    const parcelsFeatures = JSON.parse(parcelsFeaturesResponse.body);
    return parcelsFeatures.features;
}

const makeDataRequests = async (count, pageSize) => {
    if (pageSize <= 0) {
        console.warn('Page size should be greater than 0.');
        return [];
    }

    const parcels = [];
    const pageCount = count / pageSize;
    for (let i = 0; i < pageCount; i++) {
        console.time(`${i}`);
        const pageParcels = await getParcels(i, i === pageCount - 1 ? count % pageSize : pageSize);
        parcels.push(...pageParcels.map(pageParcel => pageParcel.attributes));
        console.timeEnd(`${i}`);
    }
    console.log(parcels.length);
    return parcels;
}