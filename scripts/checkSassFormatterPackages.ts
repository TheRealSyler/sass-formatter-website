import { writeFileSync, existsSync, ensureDir, ensureFile } from 'fs-extra';
import { resolve } from 'path';
import fetch from 'node-fetch';
import {
  logInfo,
  logAction,
  logSassFormatterInfo,
  unpackPackage,
  installNpmPackages
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
    keys: []
  };

  let i = 0;
  for (const key in registry.versions) {
    if (registry.versions.hasOwnProperty(key)) {
      const version = registry.versions[key];

      const currentPackagePath = `${basePath}/${key}`;

      if (!existsSync(`${currentPackagePath}/package.json`)) {
        await ensureDir(currentPackagePath);
        logSassFormatterInfo('Downloading', key);
        await unpackPackage(version.dist.tarball, currentPackagePath);
      }

      if (!existsSync(`${currentPackagePath}/node_modules`)) {
        logSassFormatterInfo('Installing', key);
        await installNpmPackages(currentPackagePath, true);
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

      i++;
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
