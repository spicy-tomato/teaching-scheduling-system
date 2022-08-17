import { ArrayHelper } from './array.helper';

describe('ArrayHelper', () => {
  describe('lastItem', () => {
    it('should return last item if array is empty', () => {
      expect(ArrayHelper.lastItem([])).toEqual(undefined);
    });
    it('should return last item if array is not empty', () => {
      expect(ArrayHelper.lastItem([1, 2, 3])).toEqual(3);
    });
  });

  describe('lastItemTruthy', () => {
    it('should return last item', () => {
      expect(ArrayHelper.lastItem([1, 2, 3])).toEqual(3);
    });
  });

  describe('onlyIn', () => {
    it('returns correctly', () => {
      expect(ArrayHelper.onlyIn([1, 2, 3, 4, 5, 6], [0, 2, 4])).toEqual([
        1, 3, 5, 6,
      ]);
      expect(ArrayHelper.onlyIn([1, 2, 3], [])).toEqual([1, 2, 3]);
      expect(ArrayHelper.onlyIn([], [1, 2, 3])).toEqual([]);
    });
  });

  describe('isSubset', () => {
    it('returns correctly', () => {
      expect(ArrayHelper.isSubset([], [])).toEqual(true);
      expect(ArrayHelper.isSubset([], [1, 2, 3])).toEqual(true);
      expect(ArrayHelper.isSubset([1], [1, 2, 3])).toEqual(true);
      expect(ArrayHelper.isSubset([1, 2, 3], [1, 2, 3])).toEqual(true);
      expect(ArrayHelper.isSubset([2, 3, 4], [1, 2, 3])).toEqual(false);
    });
  });

  describe('filterTwoParts', () => {
    it('returns correctly', () => {
      expect(
        ArrayHelper.filterTwoParts(
          [2, 3, 4, 5, 6],
          (value, index) => value % 2 === 0 && index > 0
        )
      ).toEqual([
        [4, 6],
        [2, 3, 5],
      ]);
      expect(
        ArrayHelper.filterTwoParts(
          [-4, -2, 0, 2, 4, 6, 8],
          (value) => value % 3 === 0
        )
      ).toEqual([
        [0, 6],
        [-4, -2, 2, 4, 8],
      ]);
    });
  });

  describe('mergeWith', () => {
    it('returns correctly', () => {
      expect(
        ArrayHelper.mergeWith(
          'id',
          [
            { id: 0, value: 0 },
            { id: 1, value: 1 },
          ],
          [{ id: 0, value: 1 }]
        )
      ).toEqual([
        { id: 0, value: 0 },
        { id: 1, value: 1 },
      ]);
    });
  });

  describe('equals', () => {
    it('returns correctly', () => {
      expect(ArrayHelper.equals([0, 0, 1, 2], [0, 1, 2, 2, 0])).toEqual(true);
      expect(ArrayHelper.equals([0, 0, 2], [0, 1, 2, 2, 0])).toEqual(false);
    });
  });
});
