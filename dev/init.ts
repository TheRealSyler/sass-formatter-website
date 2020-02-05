import { ConvertVscodeTheme } from './theme/convertTheme';
import { fetchVscodeTheme } from './theme/fetchVsCodeTheme';

(async () => {
  await fetchVscodeTheme();
  ConvertVscodeTheme();
})();
