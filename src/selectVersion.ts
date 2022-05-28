import { setCurrentFormatter } from './index';
import { formatters } from '../npm_packages/sass-formatter/superGlue'
export async function InitFormatterVersionSelection() {

  const versionSelector = document.getElementById('formatter-versions')! as HTMLSelectElement;
  versionSelector.disabled = false;
  versionSelector.innerHTML = '';

  for (const version in formatters) {
    const option = document.createElement('option');
    option.value = version;
    option.text = `sass-formatter@${version}`;
    option.selected = true;
    setCurrentFormatter(version);
    versionSelector.prepend(option);
  }

  versionSelector.addEventListener('change', () => setCurrentFormatter(versionSelector.value));
}
