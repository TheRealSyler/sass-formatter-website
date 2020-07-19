import { writeFileSync, existsSync, ensureDir, ensureFile } from 'fs-extra';
import { resolve } from 'path';
import fetch from 'node-fetch';
import {
  logInfo,
  logAction,
  logSassFormatterInfo,
  downloadPackage,
  installNpmPackages as installNpmPackage,
} from './utils';
import { npmRegistry } from './interfaces';
import { before02GlueCode, after02GlueCode, superGlueObj, getSuperGlueFile } from './glueTemplates';

export async function CheckSassFormatterPackages() {
  logInfo('Checking sass-formatter packages.');

  const registryUrl = 'https://registry.npmjs.org/sass-formatter/';
  const registryFilePath = resolve(`${__dirname}/../files/sass-formatter-registry.json`);
  const npm_packagesPath = resolve(`${__dirname}/../npm_packages`);
  const basePath = `${npm_packagesPath}/sass-formatter`;

  const registry: npmRegistry = await (await fetch(registryUrl)).json();
  logAction('Fetch', registryUrl);

  const superGlue: superGlueObj = {
    imports: [],
    keys: [],
  };
  const versions = getVersionToDownload(registry);
  for (let i = 0; i < versions.length; i++) {
    const key = versions[i];

    if (registry.versions.hasOwnProperty(key)) {
      const version = registry.versions[key];

      const currentPackagePath = `${basePath}/${key}`;

      if (!existsSync(`${currentPackagePath}/package.json`)) {
        await ensureDir(currentPackagePath);
        logSassFormatterInfo('Downloading', key);
        await downloadPackage(version.dist.tarball, currentPackagePath);
      }

      if (!existsSync(`${currentPackagePath}/node_modules`)) {
        logSassFormatterInfo('Installing', key);
        await installNpmPackage(currentPackagePath, false);
        logSassFormatterInfo('Installed', key, true);
      }

      const gluePath = `${currentPackagePath}/glue.ts`;
      if (!existsSync(gluePath)) {
        if (+key.split('.')[1] <= 2) {
          writeFileSync(gluePath, before02GlueCode);
          logAction('Write', gluePath, 'before @0.2.0');
        } else {
          writeFileSync(gluePath, after02GlueCode);
          logAction('Write', gluePath, 'after @0.2.0');
        }
      }

      superGlue.imports.push(`import { format as format${i} } from './${key}/glue';`);
      superGlue.keys.push(`'${key}': format${i},`);
    }
  }

  const action = (p: string) => (existsSync(p) ? 'Update' : 'Write');

  const superGlueFilePath = `${basePath}/superGlue.ts`;

  writeFileSync(superGlueFilePath, getSuperGlueFile(superGlue));
  logAction(action(superGlueFilePath), superGlueFilePath);

  await ensureFile(registryFilePath);
  writeFileSync(registryFilePath, JSON.stringify(registry, null, 2));
  logAction(action(registryFilePath), registryFilePath);

  logInfo('Finished Checking packages.');
}
function getVersionToDownload(registry: npmRegistry) {
  const tempVersions = Object.values(registry.versions).reduce<{
    [key: string]: { [key: string]: number };
  }>((acc, val) => {
    const ver = val.version.split('.');
    if (!acc[ver[0]]) {
      acc[ver[0]] = {};
    }

    if (!acc[ver[0]][ver[1]] || acc[ver[0]][ver[1]] < +ver[2]) {
      acc[ver[0]][ver[1]] = +ver[2];
    }
    return acc;
  }, {});
  const versions: string[] = [];
  for (const key in tempVersions) {
    if (Object.prototype.hasOwnProperty.call(tempVersions, key)) {
      const majorObj = tempVersions[key];
      const major = key;
      for (const k in majorObj) {
        if (Object.prototype.hasOwnProperty.call(majorObj, k)) {
          const minor = k;
          const patch = majorObj[k];
          versions.push(`${major}.${minor}.${patch}`);
        }
      }
    }
  }
  return versions;
}
