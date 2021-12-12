export function enumCompare<T>(a: T, b: T) {
  return ((a) => a) === ((b) => b);
}
