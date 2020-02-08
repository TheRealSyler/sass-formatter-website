import { npmRegistry } from './interfaces';

import { setLoadedAllFormatters, setCurrentFormatter } from './index';
import { ensureAllFormattersAreLoaded } from './utils';

export async function InitFormatterVersionSelection() {
  const registry: npmRegistry = await (await fetch('http://localhost:4040/cdn/registry')).json();

  await ensureAllFormattersAreLoaded();
  setLoadedAllFormatters(true);

  const versionSelector = document.getElementById('formatter-versions')! as HTMLSelectElement;
  versionSelector.disabled = false;
  versionSelector.innerHTML = '';

  for (const version in registry.versions) {
    const option = document.createElement('option');
    option.value = version;
    option.text = `sass-formatter@${version}`;
    option.selected = true;
    option.className = 'TEST';
    setCurrentFormatter(version);
    versionSelector.prepend(option);
  }

  versionSelector.addEventListener('change', () => setCurrentFormatter(versionSelector.value));
}
