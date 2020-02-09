import { getData } from './utils';

const grammarUrls = {
  sass:
    'https://raw.githubusercontent.com/TheRealSyler/vscode-sass-indented/master/syntaxes/sass.tmLanguage.json'
};

type Grammars = 'sass';

export async function getGrammar(key: Grammars) {
  switch (key) {
    case 'sass':
      return await getData(grammarUrls.sass, false);
  }
}
