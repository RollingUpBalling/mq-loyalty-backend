export function delay(timeout = 0) {
  return new Promise((res) => setTimeout(res, timeout));
}
