import {
  getMedian,
  infoHeader,
  getSassFile,
  getChange,
  num,
  ms,
  p,
  info
} from './performance.utils';

import { grey } from './performance.utils';

import { readFileSync } from 'fs-extra';
import { sassFormatterVersion } from '../utils';

interface PerformanceInfo {
  total: BigInt;
  median: number;
  average: BigInt;
}

interface WrapperArgs {
  lines: number;
  times: number;
  version: string;
  func: (text: string) => any;
}
interface TestArgs extends WrapperArgs {
  file: string;
}

const first: {
  [key: string]: PerformanceInfo;
} = {};

function testPerformance({ file, func, lines, times, version }: TestArgs) {
  const start = process.hrtime.bigint();
  const medianArr: number[] = [];
  for (let i = 0; i < times; i++) {
    const medianStart = process.hrtime.bigint();
    try {
      func(file);
    } catch (e) {
      return [sassFormatterVersion(version), `\x1b[1;38;2;255;0;0mERROR\x1b[m`];
    }
    medianArr.push(Number((process.hrtime.bigint() - medianStart) / BigInt(1e6)));
  }

  const totalTime = (process.hrtime.bigint() - start) / BigInt(1e6);
  const median = getMedian(medianArr);
  const average = totalTime / BigInt(times);

  if (!first[lines]) {
    first[lines] = {
      average,
      median,
      total: totalTime
    };
  }

  const firstData = first[lines];

  console.log(infoHeader('Finished:'), sassFormatterVersion(version), info(`Lines: ${lines}`));

  return [
    sassFormatterVersion(version),
    num(lines),
    num(times),
    `${num(totalTime.toString())}${ms}`,
    // `${grey(`(${firstData.total}ms)`)}`,
    `${getChange(firstData.total, totalTime)}${p}`,
    `${num(median.toString())}${ms}`,
    // `${grey(`(${firstData.median}ms)`)}`,
    `${getChange(firstData.median, median)}${p}`,
    `${num(average.toString())}${ms}`,
    // `${grey(`(${firstData.average}ms)`)}`,
    `${getChange(firstData.average, average)}${p}`
  ];
}

export function testWrapper({ func, lines, times, version }: WrapperArgs) {
  return testPerformance({
    file: readFileSync(getSassFile(lines)).toString(),
    times,
    lines,
    func,
    version
  });
}
