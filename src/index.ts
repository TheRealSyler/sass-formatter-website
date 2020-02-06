import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

import { loadWASM } from 'onigasm';

(async () => {
  console.log('INIT EDITOR');
  await loadWASM(require('onigasm/lib/onigasm.wasm'));

  monaco.editor.defineTheme(
    'dark',
    await (await fetch('http://localhost:4040/themes/dark-plus')).json()
  );

  // await import('./theme/dark-theme.json').then(data => {
  //   monaco.editor.defineTheme('dark', data as any);
  // });

  monaco.languages.register({ id: 'sass' });
  const registry = new Registry({
    getGrammarDefinition: async () => ({
      format: 'json',
      content: (await import('./grammars/sass.tmLanguage.json')) as any
    })
  });

  const grammars = new Map();

  grammars.set('sass', 'source.sass');

  await wireTmGrammars(monaco, registry, grammars);

  monaco.editor.setTheme('dark');

  const inputEditorContainer = document.getElementById('input-editor')!;
  const outputEditorContainer = document.getElementById('output-editor')!;
  const loader = document.getElementById('loader')!;

  const editorSettings: monaco.editor.IStandaloneEditorConstructionOptions = {
    value: '.class\n  margin: 200rem',
    language: 'sass',
    minimap: {
      enabled: false
    },
    autoIndent: 'full',
    renderWhitespace: 'all'
  };
  const inputEditor = monaco.editor.create(inputEditorContainer, editorSettings);

  const outputEditor = monaco.editor.create(outputEditorContainer, {
    readOnly: true,
    ...editorSettings
  });

  window.addEventListener('resize', () => {
    inputEditor.layout();
    outputEditor.layout();
  });

  inputEditor.onKeyUp(() => outputEditor.setValue(inputEditor.getValue()));

  loader.style.display = 'none';
})();
