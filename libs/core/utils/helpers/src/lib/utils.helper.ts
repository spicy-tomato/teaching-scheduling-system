export class UtilsHelper {
  public static generateSchoolYears(currentTerm: string): string[] {
    const curr = +currentTerm.split('_')[0] + 1;
    const result = [];

    for (let i = 0; i < 3; i++) {
      result.unshift(`${curr - i}_${curr - i + 1}`);
    }

    return result;
  }
}
