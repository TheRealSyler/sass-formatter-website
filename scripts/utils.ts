import { styler } from '@sorg/log';
import { existsSync } from 'fs-extra';
import { get } from 'https';
import { x } from 'tar';
import { Exec } from 'suf-node';

export const red = '\x1b[1;38;2;255;0;0m';
export const reset = '\x1b[0m';
export const white = '\x1b[1;38;2;255;255;255m';

export const logInfo = (message: string) =>
  console.log(
    styler(`\n${message}\n`, {
      color: '#eee',
      'font-weight': 'bold',
    })
  );
export const logErr = (message: string) =>
  console.log(
    styler(message, {
      'font-weight': 'bold',
      color: 'red',
    })
  );

const faintText = (text: string) => styler(text, '#aaa');
const openBracket = faintText('[');
const closeBracket = faintText(']');

export const logAction = (action: string, message: string, additionalInfo?: string) =>
  console.log(
    `${openBracket}${faintText(action.padEnd(13))}${closeBracket} ${styler(message, {
      'font-weight': 'bold',
      color: '#f46',
    })} ${styler(additionalInfo ? additionalInfo : '', '#ccc')}`
  );

export const logSassFormatterInfo = (action: string, version: string, color?: string) =>
  console.log(
    `${openBracket}${color
      ? styler(action.padEnd(13), { color, 'font-weight': 'bold' })
      : faintText(action.padEnd(13))
    }${closeBracket} ${sassFormatterVersion(version)}`
  );

export const sassFormatterVersion = (version: string) =>
  styler(version, {
    'font-weight': 'bold',
    color: '#aff',
  });

export async function installNpmPackages(path: string, verbose = false) {
  if (verbose) {
    //@ts-ignore
    const { stderr, stdout } = await Exec(`cd ${path} && yarn`);
    if (stderr) {
      console.log(stderr);
    }
    console.log(stdout);
  } else {
    await Exec(`cd ${path} && yarn`);
  }

  if (!existsSync(`${path}/node_modules`)) {
    logErr(`Could not install dependencies in ${path}
  
  Retrying...
  `);
    await installNpmPackages(path, verbose);
  }
}

export async function downloadPackage(url: string, path: string): Promise<void> {
  return new Promise(async (res) => {
    get(url, (r) => {
      r.pipe(
        x({
          strip: 1,
          C: path,
        }) as any
      );
    }).on('finish', () => res());
  });
}
