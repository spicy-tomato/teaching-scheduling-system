import { Md5 } from 'ts-md5';
import { ArrayHelper } from './array.helper';

export class StringHelper {
  static toSnakeCase(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }

  static toLatinText(text: string): string {
    if (!text) return '';

    text = text.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    text = text.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    text = text.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    text = text.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    text = text.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    text = text.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    text = text.replace(/đ/g, 'd');

    text = text.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
    text = text.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
    text = text.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
    text = text.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
    text = text.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
    text = text.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
    text = text.replace(/Đ/g, 'D');

    return text;
  }

  static shortenName(text: string): string {
    const words = text.split(' ');
    return words
      .map((word, i) => (i === words.length - 1 ? ` ${word}` : word[0]))
      .join('.');
  }

  static md5(text: string): string {
    return new Md5().appendStr(text).end() as string;
  }

  static nameCompareFn(a: string, b: string): number {
    const getName = (fullName: string): string =>
      ArrayHelper.lastItemTruthy(fullName.split(' '));

    const name1 = getName(StringHelper.toLatinText(a));
    const name2 = getName(StringHelper.toLatinText(b));
    return name1 < name2 ? -1 : name1 > name2 ? 1 : a < b ? -1 : a > b ? 1 : 0;
  }
}
