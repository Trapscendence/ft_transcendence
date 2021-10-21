export const sqlEscaper = function (text: string): string {
  return text.replace(/'/g, '\'\'');
}

