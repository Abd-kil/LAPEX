export const cleanDescription = (text: string): string => {
  return text
    .split('\n')
    .map(line => line.trim())
    .filter(line => line)
    .join('\n');
};