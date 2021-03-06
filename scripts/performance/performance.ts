import { LogTable, styler } from '@sorg/log';

// import { SassFormatter } from 'sass-formatter';

import { grey } from './performance.utils';
import { formatters } from '../../npm_packages/sass-formatter/superGlue';
import { testWrapper } from './performance.check';

// function devSassFormat(text: string, options?: any) {
//   return SassFormatter.Format(text, options);
// }

const bold = (n: string | number) => styler(n.toString(), { 'font-weight': 'bold' });

// Execution start
(async () => {
  const firstRes = grey('(First)');
  const registry = await import('../../files/sass-formatter-registry.json');

  console.log(bold('\nSass Formatter Performance Check.\n'));

  const table: (number | string)[][] = [
    [
      bold('Version'),
      bold('Lines'),
      bold('Times'),
      bold('Total'),
      // firstRes,
      bold('Change(%)*'),
      bold('Median'),
      // firstRes,
      bold('Change(%)*'),
      bold('Average'),
      // firstRes,
      bold('Change(%)*'),
    ],
    [],
  ];

  // for (const version in registry.versions) {
  // table.push(testWrapper({ lines: 1000, times: 1000, func: formatters[version!], version }));
  // table.push(testWrapper({ lines: 10000, times: 100, func: formatters[version!], version }));
  // table.push(testWrapper({ lines: 100000, times: 10, func: formatters[version!], version }));
  // table.push(testWrapper({ lines: 1000000, times: 1, func: formatters[version!], version }));
  // }

  const version = '0.4.4';

  // table.push(testWrapper({ lines: 1000, times: 1000, func: formatters[version!], version }));
  // table.push(testWrapper({ lines: 1000, times: 1000, func: devSassFormat, version: 'dev' }));

  // table.push(testWrapper({ lines: 10000, times: 100, func: formatters[version!], version }));
  // table.push(testWrapper({ lines: 10000, times: 100, func: devSassFormat, version: 'dev' }));

  // table.push(testWrapper({ lines: 100000, times: 1, func: formatters[version!], version }));
  // table.push(testWrapper({ lines: 100000, times: 10, func: devSassFormat, version: 'dev' }));

  // table.push(testWrapper({ lines: 1000000, times: 1, func: formatters[version!], version }));
  // table.push(testWrapper({ lines: 1000000, times: 1, func: devSassFormat, version: 'dev' }));

  console.log(''); // add new line for visual purposes.
  LogTable(table);
  console.log(''); // add new line for visual purposes.
  console.log(bold('* Measured against the first result with the same number of lines.'));
  console.log(''); // add new line for visual purposes.
})();
