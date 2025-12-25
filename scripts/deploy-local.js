// scripts/deploy-local.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1️⃣ Read package.json to get name and version
const pkgPath = path.resolve('./package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const { name, version } = pkg;

// 2️⃣ Run npm pack to generate .tgz
console.log('Packing the npm package...');
const tarballFolderName = 'packed_versions_tgz';
const tarballName = `${name}-${version}.tgz`;

fs.mkdirSync(tarballFolderName, { recursive: true });

execSync('npm pack', { stdio: 'inherit' });

const generatedTarballPath = path.resolve(tarballName);
const destinationPath = path.resolve(tarballFolderName, tarballName);
fs.renameSync(generatedTarballPath, destinationPath);

// 3️⃣ Verify the tarball exists
if (!fs.existsSync(destinationPath)) {
  console.error(`❌ Tarball ${tarballName} not found!`);
  process.exit(1);
}

// 4️⃣ Install the tarball locally in the current project (or your testing project)
console.log(`Installing ${tarballName} locally...`);
execSync(`npm install ${destinationPath} --no-save`, { stdio: 'inherit' });

console.log(`✅ ${tarballName} installed locally. You can now test your package.`);
