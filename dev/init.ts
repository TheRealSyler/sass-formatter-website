import { ConvertVscodeTheme } from './theme/convertTheme';
import { fetchVscodeTheme } from './theme/fetchVsCodeTheme';
import { fetchSassGrammar } from './getSassGrammar';
import { white, reset } from './utils';

(async () => {
  await fetchSassGrammar();
  await fetchVscodeTheme();
  ConvertVscodeTheme();
  console.log(white, '____Init End____', reset);
})();
