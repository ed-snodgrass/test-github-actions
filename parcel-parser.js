const path = require("path");
const fse = require("fs-extra");

const directoryName = "src/test-directory";

// parseAndWrite('new-file.txt', 'hello world').then(() => {
//     console.log('Loaded repo');
// });

async function parseAndWrite(parcels) {
    await fse.ensureDir(directoryName);
    await fse.writeFile(path.join(directoryName, 'new-file.txt'), 'hello world');
}
module.exports = {parseAndWrite}