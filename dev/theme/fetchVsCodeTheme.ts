import { writeFileSync } from 'fs';

import Merge from 'deepmerge';
import { getData, reset, white } from '../utils';

const baseUrl =
  'https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/themes/dark_defaults.json';

const darkUrl =
  'https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/themes/dark_vs.json';

const darkPlusUrl =
  'https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/themes/dark_plus.json';

export async function fetchVscodeTheme() {
  console.log(white, 'Start Fetching Vscode Theme', reset);
  const base = await getData(baseUrl);
  const dark = await getData(darkUrl);
  const darkPlus = await getData(darkPlusUrl);
  const theme: any = Merge(
    Merge(
      {
        name: 'TO BE FETCHED',
        inherit: false,
        base: 'vs-dark',
        colors: {},
        tokenColors: [
          {
            scope: '',
            settings: {
              foreground: '#9cdcfe',
              background: '#1E1E1E'
            }
          }
        ]
      },
      base
    ),
    Merge(dark, darkPlus)
  );
  delete theme.include;
  delete theme['$schema'];
  writeFileSync('dev/theme/vscode-dark-plus-raw.json', JSON.stringify(theme, null, 2));
  console.log(white, 'Fetched Vscode Theme', reset);
}
