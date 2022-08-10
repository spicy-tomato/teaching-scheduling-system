import { TestBed } from '@angular/core/testing';
import { RelativeTimePipe } from './relative-time.pipe';

describe('RelativeTimePipe', () => {
  let pipe: RelativeTimePipe;
  let dateValue: number;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [RelativeTimePipe] });
    pipe = TestBed.inject(RelativeTimePipe);
    dateValue = new Date().valueOf();
  });

  it('can load instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return seconds', () => {
    const date = new Date(dateValue - 30 * 1000).toString(); // 30s
    expect(pipe.transform(date)).toMatch(/(29|30|31)/);
    expect(pipe.transform(date)).toContain('giây');
  });

  it('should return minutes', () => {
    const date = new Date(dateValue - 2 * 60 * 1000).toString(); // 2m
    expect(pipe.transform(date)).toContain('2');
    expect(pipe.transform(date)).toContain('phút');
  });

  it('should return hours', () => {
    const date = new Date(dateValue - 60 * 60 * 1000).toString(); // 1h
    expect(pipe.transform(date)).toContain('1');
    expect(pipe.transform(date)).toContain('giờ');
  });

  it('should return days', () => {
    const date = new Date(dateValue - 3 * 24 * 60 * 60 * 1000).toString(); // 3d
    expect(pipe.transform(date)).toContain('3');
    expect(pipe.transform(date)).toContain('ngày');
  });

  it('should return months', () => {
    const date = new Date(dateValue - 5 * 30 * 24 * 60 * 60 * 1000).toString(); // 5 months
    expect(pipe.transform(date)).toContain('5');
    expect(pipe.transform(date)).toContain('tháng');
  });

  it('should return years', () => {
    const date = new Date(
      dateValue - 2 * 12 * 30 * 24 * 60 * 60 * 1000
    ).toString(); // 2y
    expect(pipe.transform(date)).toContain('2');
    expect(pipe.transform(date)).toContain('năm');
  });
});
