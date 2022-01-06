export function notContainValueFactory(context: string): string {
  return `${context ? context : 'Giá trị'} không hợp lệ!`;
}
