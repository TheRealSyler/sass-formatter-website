import theme from './vscode-dark-plus-raw.json';
import { writeFileSync } from 'fs';
import { white, reset } from '../utils';

// *****************************************************
// **** convert vscode dark+ theme to monaco theme. ****
// *****************************************************

export function ConvertVscodeTheme() {
  console.log(white, 'Start Converting Vscode Theme', reset);
  const newTheme = Object.create(theme);
  newTheme.name = theme.name;
  newTheme.base = theme.base;
  newTheme.inherit = theme.inherit;
  newTheme.colors = theme.colors;
  newTheme.rules = [];

  for (let i = 0; i < theme.tokenColors.length; i++) {
    const rule = theme.tokenColors[i];
    if (typeof rule.scope === 'string') {
      newTheme.rules.push({
        token: rule.scope,
        ...rule.settings
      } as any);
    } else {
      for (let k = 0; k < rule.scope.length; k++) {
        const scope = rule.scope[k];
        newTheme.rules.push({
          token: scope,
          ...rule.settings
        } as any);
      }
    }
  }
  console.log(white, 'Converted Vscode Theme', reset);
  writeFileSync('src/theme/dark-theme.json', JSON.stringify(newTheme, null, 2));
}
