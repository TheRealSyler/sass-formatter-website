type Formatter = (text: string, options?: any) => string;

interface Window {
  latestFormatter: Formatter;
  formatters: {
    [key: string]: Formatter;
  };
}
