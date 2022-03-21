import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenName',
})
export class ShortenNamePipe implements PipeTransform {
  public transform(value: string): string {
    const words = value.split(' ');
    return words
      .map((word, i) => (i === words.length - 1 ? ` ${word}` : word[0]))
      .join('.');
  }
}
