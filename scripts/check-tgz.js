const fs = require('fs');
const path = require('path');

// Read package.json manually
const pkgPath = path.resolve('./package.json'); // adjust if needed
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const { name, version } = pkg;

const tarballFolderName = 'packed_versions_tgz';
const tgzName = `${name}-${version}.tgz`;
const tgzPath = path.resolve(tarballFolderName, tgzName);
if (!fs.existsSync(tgzPath)) {
  console.error(`Error: Tarball ${tgzName} not found! Did you forget to run npm auto:pack or test locally?`);
  process.exit(1);
}

console.log(`Found tarball: ${tgzName}. Safe to deploy.`);
