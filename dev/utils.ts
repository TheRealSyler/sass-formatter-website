import Fetch from 'node-fetch';

export const red = '\x1b[1;38;2;255;0;0m';
export const reset = '\x1b[0m';
export const white = '\x1b[1;38;2;255;255;255m';

export async function getData(url: string, replace = true) {
  try {
    const data = await (await Fetch(url)).text();
    return JSON.parse(replace ? data.replace(/"[\t ]*\/\/.*?$/gm, '"') : data);
  } catch (err) {
    console.log(
      `[dev/theme/fetchVsCodeTheme.ts]\nCould not fetch ${white}${url}: ${red} \n`,
      err,
      reset
    );
    process.exit(1);
  }
}
