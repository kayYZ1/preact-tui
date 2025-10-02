const RESET = "\x1b[0m";

export const red = (str: string) => `\x1b[31m${str}${RESET}`;
export const green = (str: string) => `\x1b[32m${str}${RESET}`;
export const yellow = (str: string) => `\x1b[33m${str}${RESET}`;
export const blue = (str: string) => `\x1b[34m${str}${RESET}`;
export const magenta = (str: string) => `\x1b[35m${str}${RESET}`;
export const cyan = (str: string) => `\x1b[36m${str}${RESET}`;
export const white = (str: string) => `\x1b[37m${str}${RESET}`;
export const gray = (str: string) => `\x1b[90m${str}${RESET}`;
export const black = (str: string) => `\x1b[30m${str}${RESET}`;

export const bgRed = (str: string) => `\x1b[41m${str}${RESET}`;
export const bgGreen = (str: string) => `\x1b[42m${str}${RESET}`;
export const bgYellow = (str: string) => `\x1b[43m${str}${RESET}`;
export const bgBlue = (str: string) => `\x1b[44m${str}${RESET}`;
export const bgMagenta = (str: string) => `\x1b[45m${str}${RESET}`;
export const bgCyan = (str: string) => `\x1b[46m${str}${RESET}`;
export const bgWhite = (str: string) => `\x1b[47m${str}${RESET}`;
export const bgGray = (str: string) => `\x1b[100m${str}${RESET}`;
export const bgBlack = (str: string) => `\x1b[40m${str}${RESET}`;

export const bold = (str: string) => `\x1b[1m${str}\x1b[22m`;
export const dim = (str: string) => `\x1b[2m${str}\x1b[22m`;
export const italic = (str: string) => `\x1b[3m${str}\x1b[23m`;
export const underline = (str: string) => `\x1b[4m${str}\x1b[24m`;
export const inverse = (str: string) => `\x1b[7m${str}\x1b[27m`;
export const hidden = (str: string) => `\x1b[8m${str}\x1b[28m`;
export const strikethrough = (str: string) => `\x1b[9m${str}\x1b[29m`;

export const reset = (str: string) => `${str}${RESET}`;
