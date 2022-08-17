import { ObjectHelper } from './object.helper';

describe('ObjectHelper', () => {
  describe('toArray', () => {
    it('returns correctly', () => {
      const obj = { first: 1, second: 2, third: 3, foo: 0, bar: 0 };
      expect(ObjectHelper.toArray(obj)).toEqual([
        {
          id: 'first',
          value: 1,
        },
        {
          id: 'second',
          value: 2,
        },
        {
          id: 'third',
          value: 3,
        },
        {
          id: 'foo',
          value: 0,
        },
        {
          id: 'bar',
          value: 0,
        },
      ]);
      expect(ObjectHelper.toArray(obj, { uniqueValue: true })).toEqual([
        {
          id: 'first',
          value: 1,
        },
        {
          id: 'second',
          value: 2,
        },
        {
          id: 'third',
          value: 3,
        },
        {
          id: 'foo',
          value: 0,
        },
      ]);
    });
  });

  describe('isNullOrUndefined', () => {
    it('returns correctly', () => {
      expect(ObjectHelper.isNullOrUndefined({})).toEqual(false);
      expect(ObjectHelper.isNullOrUndefined(null)).toEqual(true);
      expect(ObjectHelper.isNullOrUndefined(undefined)).toEqual(true);
    });
  });

  describe('toSnakeCase', () => {
    it('returns correctly', () => {
      const value = {
        id: 1,
        name: 'Harry',
        firstProp: 'first',
        secondProp: [],
        thirdProp: undefined,
        forthProp: {},
        fifthProp: [{ id: 123, initValue: 'Chris' }],
      };
      const myExpect = {
        id: 1,
        name: 'Harry',
        first_prop: 'first',
        second_prop: [],
        third_prop: undefined,
        forth_prop: {},
        fifth_prop: [{ id: 123, init_value: 'Chris' }],
      };
      expect(ObjectHelper.toSnakeCase(value)).toEqual(myExpect);
    });
  });

  describe('parseDateProperties', () => {
    it('returns correctly', () => {
      const value = {
        id: 1,
        firstProp: 14082001000,
        secondProp: '2022/07/30 15:30:00',
      };
      const myExpect = {
        id: 1,
        firstProp: new Date(1970, 5, 13, 7, 40, 1),
        secondProp: new Date(2022, 6, 30, 15, 30, 0),
      };
      expect(ObjectHelper.parseDateProperties(value, ['firstProp', 'secondProp'])).toEqual(myExpect);
    });
  });
});
