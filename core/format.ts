const RESET = "\x1b[0m";

const red = (str: string) => `\x1b[31m${str}${RESET}`;
const green = (str: string) => `\x1b[32m${str}${RESET}`;
const yellow = (str: string) => `\x1b[33m${str}${RESET}`;
const blue = (str: string) => `\x1b[34m${str}${RESET}`;
const magenta = (str: string) => `\x1b[35m${str}${RESET}`;
const cyan = (str: string) => `\x1b[36m${str}${RESET}`;
const white = (str: string) => `\x1b[37m${str}${RESET}`;
const gray = (str: string) => `\x1b[90m${str}${RESET}`;
const black = (str: string) => `\x1b[30m${str}${RESET}`;

const bgRed = (str: string) => `\x1b[41m${str}${RESET}`;
const bgGreen = (str: string) => `\x1b[42m${str}${RESET}`;
const bgYellow = (str: string) => `\x1b[43m${str}${RESET}`;
const bgBlue = (str: string) => `\x1b[44m${str}${RESET}`;
const bgMagenta = (str: string) => `\x1b[45m${str}${RESET}`;
const bgCyan = (str: string) => `\x1b[46m${str}${RESET}`;
const bgWhite = (str: string) => `\x1b[47m${str}${RESET}`;
const bgGray = (str: string) => `\x1b[100m${str}${RESET}`;
const bgBlack = (str: string) => `\x1b[40m${str}${RESET}`;

export const Colors = {
  red,
  green,
  yellow,
  blue,
  magenta,
  cyan,
  white,
  gray,
  black,
  bgRed,
  bgGreen,
  bgYellow,
  bgBlue,
  bgMagenta,
  bgCyan,
  bgWhite,
  bgGray,
  bgBlack,
};

export const bold = (str: string) => `\x1b[1m${str}\x1b[22m`;
export const dim = (str: string) => `\x1b[2m${str}\x1b[22m`;
export const italic = (str: string) => `\x1b[3m${str}\x1b[23m`;
export const underline = (str: string) => `\x1b[4m${str}\x1b[24m`;
export const inverse = (str: string) => `\x1b[7m${str}\x1b[27m`;
export const hidden = (str: string) => `\x1b[8m${str}\x1b[28m`;
export const strikethrough = (str: string) => `\x1b[9m${str}\x1b[29m`;

export const reset = (str: string) => `${str}${RESET}`;
