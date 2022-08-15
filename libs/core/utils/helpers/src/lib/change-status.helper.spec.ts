import { ChangeStatusHelper } from './change-status.helper';

describe('ChangeStatusHelper', () => {
  const funcMap = [
    { code: 100, func: 'isCancelled' },
    { code: 200, func: 'isPending' },
    { code: 300, func: 'isApproved' },
    { code: 400, func: 'isChanged' },
    { code: 500, func: 'isDenied' },
  ] as const;
  const statusMap = [
    { code: 0, status: null },
    { code: 100, status: 'cancel' },
    { code: 200, status: 'pending' },
    { code: 300, status: 'approve' },
    { code: 400, status: 'change' },
    { code: 500, status: 'deny' },
    { code: 600, status: null },
  ] as const;

  funcMap.forEach(({ code, func }) => {
    const lo = code;
    const hi = code + 99;

    describe(func, () => {
      it(`should returns true if value is in [${lo}, ${hi})`, () => {
        expect(ChangeStatusHelper[func](lo)).toEqual(true);
        expect(ChangeStatusHelper[func](hi)).toEqual(true);
      });
      it(`should returns false if value is not in [${lo}, ${hi})`, () => {
        expect(ChangeStatusHelper[func](lo - 1)).toEqual(false);
        expect(ChangeStatusHelper[func](hi + 1)).toEqual(false);
      });
    });
  });

  describe('getType', () => {
    statusMap.forEach(({ code, status }) => {
      it(`should returns ${status} if code is in [${code}, ${code + 100})`, () => {
        expect(ChangeStatusHelper.getType(code)).toEqual(status);
      });
    });
  });

  describe('canExport', () => {
    it('should returns false', () => {
      expect(ChangeStatusHelper.canExport(100)).toEqual(false);
      expect(ChangeStatusHelper.canExport(500)).toEqual(false);
      expect(ChangeStatusHelper.canExport(600)).toEqual(false);
      expect(ChangeStatusHelper.canExport(200)).toEqual(false);
      expect(ChangeStatusHelper.canExport(201)).toEqual(false);
    });
    it('should returns true', () => {
      expect(ChangeStatusHelper.canExport(300)).toEqual(true);
      expect(ChangeStatusHelper.canExport(400)).toEqual(true);
    });
  });

  describe('isBetween', () => {
    it('returns correctly', () => {
      expect(ChangeStatusHelper['isBetween'](100, 100)).toEqual(true);
      expect(ChangeStatusHelper['isBetween'](100, 200)).toEqual(false);

      expect(ChangeStatusHelper['isBetween'](199, 100)).toEqual(true);
      expect(ChangeStatusHelper['isBetween'](199, 200)).toEqual(false);
    });
  });
});
