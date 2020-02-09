export const before02GlueCode = `import { SassFormatter, SassTextDocument } from './dist/index';

export function format(text: string, options = {tabSize: 2, insertSpaces: true} as any) {
  return SassFormatter.Format(new SassTextDocument(text), options, options);
}
`;

export const after02GlueCode = `import { SassFormatter } from './dist/index';

export function format(text: string, options?: any) {
  return SassFormatter.Format(text, options);
}
`;

export type superGlueObj = {
  imports: string[];
  keys: string[];
};

export const getSuperGlueFile = (superGlue: superGlueObj) => `${superGlue.imports.join('\n')}

interface formatters {
  [key: string]: (text: string, options?: any) => string;
}

export const formatters: formatters = {
  ${superGlue.keys.join('\n  ').replace(/,\n  $/, '')}
};`;
