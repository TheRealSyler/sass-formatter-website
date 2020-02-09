import { setCurrentFormatter } from './index';

export async function InitFormatterVersionSelection() {
  const registry = await import('../files/sass-formatter-registry.json');

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
