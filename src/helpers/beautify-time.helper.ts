export function beautifyTime(dt: Date): string {
  const hours = `0${dt.getHours()}`.slice(-2);
  const minutes = `0${dt.getMinutes()}`.slice(-2);
  return `${hours}:${minutes}`;
}
