import { white, reset, getData } from './utils';

import { writeFileSync } from 'fs';

const sassGrammarUrl =
  'https://raw.githubusercontent.com/TheRealSyler/vscode-sass-indented/master/syntaxes/sass.tmLanguage.json';

export async function fetchSassGrammar() {
  console.log(white, 'Start Fetching Sass Grammar', reset);
  const grammar = await getData(sassGrammarUrl, false);

  writeFileSync('src/grammars/sass.tmLanguage.json', JSON.stringify(grammar, null, 2));
  console.log(white, 'Fetched Sass Grammar', reset);
}
