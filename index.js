const parcelRetriever = require('./parcel-retriever');
const parcelParser = require('./parcel-parser');

// parcelRetriever.retrieveParcels().then(parcelsRetrieved => {
//     console.log(`Retrieved ${parcelsRetrieved.length} parcels.`);
    parcelParser.parseAndWrite(null).then(() => {
        console.log('wrote file');
    });
// });