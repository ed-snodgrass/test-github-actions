const https = require('https');
const WHERE = 'UPPER%28CONDITION%29+IN+%28%27POOR%27%2C+%27LOW%27%2C+%27WORN+OUT%27%29+OR+%28UPPER%28OWNER_CITY%29+%3C%3E+%27OMAHA%27+AND+UPPER%28OWNER_STAT%29+%3D+%27NE%27+AND+UPPER%28PROP_CITY%29+%3D+%27OMAHA%27%29+OR+UPPER%28OWNER_STAT%29+%3C%3E+%27NE%27';

https.get(`https://gis.dogis.org/arcgis/rest/services/OpenData_Layers/MapServer/38/query?where=${WHERE}&returnCountOnly=true&f=json`, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        process.stdout.write(d);
    });

}).on('error', (e) => {
    console.error(e);
});