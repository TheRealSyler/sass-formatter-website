import Merge from 'deepmerge';
import { getData } from './utils';

const themeUrls = {
  base:
    'https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/themes/dark_defaults.json',
  dark:
    'https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/themes/dark_vs.json',
  darkPlus:
    'https://raw.githubusercontent.com/microsoft/vscode/master/extensions/theme-defaults/themes/dark_plus.json',
};

type Themes = 'dark+';

export async function getTheme(key: Themes) {
  switch (key) {
    case 'dark+':
      return require('./assets/dark-plus.theme.json');
  }
}
//! DON'T REMOVE, Use with fetchVscodeDarkPlusTheme to get updated theme
// function ConvertVscodeTheme(theme: any) {
//   const newTheme = Object.create(theme);
//   newTheme.name = theme.name;
//   newTheme.base = theme.base;
//   newTheme.inherit = theme.inherit;
//   newTheme.colors = theme.colors;
//   newTheme.rules = [];

//   for (let i = 0; i < theme.tokenColors.length; i++) {
//     const rule = theme.tokenColors[i];
//     if (typeof rule.scope === 'string') {
//       newTheme.rules.push({
//         token: rule.scope,
//         ...rule.settings,
//       } as any);
//     } else {
//       for (let k = 0; k < rule.scope.length; k++) {
//         const scope = rule.scope[k];
//         newTheme.rules.push({
//           token: scope,
//           ...rule.settings,
//         } as any);
//       }
//     }
//   }
//   return newTheme;
// }
//! DON'T REMOVE, Use with ConvertVscodeTheme to get updated theme
// async function fetchVscodeDarkPlusTheme() {
//   const base = await getData(themeUrls.base);
//   const dark = await getData(themeUrls.dark);
//   const darkPlus = await getData(themeUrls.darkPlus);
//   const theme: any = Merge(
//     Merge(
//       {
//         name: 'TO BE FETCHED',
//         inherit: false,
//         base: 'vs-dark',
//         colors: {},
//         tokenColors: [
//           {
//             scope: '',
//             settings: {
//               foreground: '#9cdcfe',
//               background: '#1E1E1E',
//             },
//           },
//         ],
//       },
//       base
//     ),
//     Merge(dark, darkPlus)
//   );
//   delete theme.include;
//   delete theme['$schema'];
//   return theme;
// }
