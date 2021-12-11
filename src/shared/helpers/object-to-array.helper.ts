type Item = {
  id: number | string;
  value: string;
};

export function objectToArrayHelper(
  obj: Record<number | string, string>
): Item[] {
  const array: Item[] = [];
  Object.keys(obj).forEach((key) => {
    array.push({ id: key, value: obj[key] });
  });
  return array;
}
