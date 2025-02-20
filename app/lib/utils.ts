export function ensureStartsWith(stringToCheck: string, startsWith: string) {
  return stringToCheck.startsWith(startsWith)
    ? stringToCheck
    : `${startsWith}${stringToCheck}`;
}
