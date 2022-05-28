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
  const versions = Object.keys(registry.versions);
  for (let i = 0; i < versions.length; i++) {
    const key = versions[i];
    const [major, minor] = key.split('.')
    const [nextMajor, nextMinor] = versions[i + 1]?.split('.') || []

    if (major === nextMajor && minor === nextMinor && key !== '0.0.1') {
      logSassFormatterInfo('Skip', key);
    } else {
      if (registry.versions.hasOwnProperty(key)) {
        const version = registry.versions[key];

        const currentPackagePath = `${basePath}/${key}`;

        if (!existsSync(`${currentPackagePath}/package.json`)) {
          await ensureDir(currentPackagePath);
          logSassFormatterInfo('Downloading', key);
          await downloadPackage(version.dist.tarball, currentPackagePath);
        } else {
          logSassFormatterInfo('Skip Download', key);
        }

        if (!existsSync(`${currentPackagePath}/node_modules`)) {
          logSassFormatterInfo('Installing', key);
          await installNpmPackage(currentPackagePath, false);
          logSassFormatterInfo('Installed', key, '#0f0');
        } else {
          logSassFormatterInfo('Skip Install', key, '#2fa');
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
  }

  const action = (p: string) => (existsSync(p) ? 'Update' : 'Write');

  const superGlueFilePath = `${basePath}/superGlue.ts`;
  await ensureFile(superGlueFilePath);
  writeFileSync(superGlueFilePath, getSuperGlueFile(superGlue));
  logAction(action(superGlueFilePath), superGlueFilePath);

  await ensureFile(registryFilePath);
  writeFileSync(registryFilePath, JSON.stringify(registry, null, 2));
  logAction(action(registryFilePath), registryFilePath);

  logInfo('Finished Checking packages.');
}
