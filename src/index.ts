import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Registry } from 'monaco-textmate';
import { wireTmGrammars } from 'monaco-editor-textmate';
import { loadWASM } from 'onigasm';
import { InitFormatterVersionSelection } from './selectVersion';
import { initialEditorValue, getBugReportLinkBody } from './utils';
import { getGrammar } from './grammar';
import { getTheme } from './theme';
import { formatters } from '../npm_packages/sass-formatter/superGlue';

let currentFormatter: string | null = null;

export const setCurrentFormatter = (v: string) => (currentFormatter = v);

InitFormatterVersionSelection();

(async () => {
  await loadWASM(require('onigasm/lib/onigasm.wasm'));

  monaco.editor.defineTheme('dark', await getTheme('dark+'));

  monaco.languages.register({ id: 'sass' });
  const registry = new Registry({
    getGrammarDefinition: async () => ({
      format: 'json',
      content: await getGrammar('sass')
    })
  });

  const grammars = new Map();

  grammars.set('sass', 'source.sass');

  await wireTmGrammars(monaco, registry, grammars);

  monaco.editor.setTheme('dark');

  const editorContainer = document.getElementById('editor')!;
  const loader = document.getElementById('loader')!;
  const bugReport = document.getElementById('bug-report') as HTMLAnchorElement;

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

  bugReport.addEventListener('mousedown', () => {
    bugReport.href = `https://github.com/TheRealSyler/sass-formatter/issues/new?assignees=TheRealSyler&labels=bug&template=bug_report.md&title=${getBugReportLinkBody(
      editor.getModel()?.getValue()
    )}`;
  });

  window.addEventListener('resize', () => {
    editor.layout();
  });

  window.addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 's' && e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      let value = '';

      value = formatters[currentFormatter!](editor.getValue());

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
