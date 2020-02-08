import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';

import { loadWASM } from 'onigasm';
import { InitFormatterVersionSelection } from './selectVersion';
import { ensureLatestFormatterIsLoaded, initialEditorValue } from './utils';

let loadedAllFormatters = false;
let currentFormatter: string | null = null;

export const setLoadedAllFormatters = (v: boolean) => (loadedAllFormatters = v);
export const setCurrentFormatter = (v: string) => (currentFormatter = v);

InitFormatterVersionSelection();

(async () => {
  await loadWASM(require('onigasm/lib/onigasm.wasm'));

  monaco.editor.defineTheme(
    'dark',
    await (await fetch('http://localhost:4040/themes/dark-plus')).json()
  );

  monaco.languages.register({ id: 'sass' });
  const registry = new Registry({
    getGrammarDefinition: async () => ({
      format: 'json',
      content: await (await fetch('http://localhost:4040/grammars/sass')).json()
    })
  });

  const grammars = new Map();

  grammars.set('sass', 'source.sass');

  await wireTmGrammars(monaco, registry, grammars);

  monaco.editor.setTheme('dark');

  const editorContainer = document.getElementById('editor')!;
  const loader = document.getElementById('loader')!;

  const editorSettings: monaco.editor.IStandaloneEditorConstructionOptions = {
    value: initialEditorValue,
    language: 'sass',
    minimap: {
      enabled: false
    },
    autoIndent: 'full',
    renderWhitespace: 'all'
  };
  const editor = monaco.editor.create(editorContainer, editorSettings);

  window.addEventListener('resize', () => {
    editor.layout();
  });

  await ensureLatestFormatterIsLoaded();

  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 's' && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      let value = '';
      if (loadedAllFormatters) {
        value = window.formatters[currentFormatter!](editor.getValue());
      } else {
        value = window.latestFormatter(editor.getValue());
      }
      const model = editor.getModel()!;
      const lineCount = model?.getLineCount();
      const lastCol = model?.getLineMaxColumn(lineCount);
      editor.executeEdits('format', [
        {
          range: new monaco.Range(0, 0, lineCount, lastCol),
          text: value
        }
      ]);
    }
  });

  loader.style.pointerEvents = 'none';
  loader.style.opacity = '0';
})();
