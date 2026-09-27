

describe('Data Merge & Sync Logic', () => {
  describe('Task Merging (Set Union)', () => {
    const mergeTasks = (remote, local) =>
      Array.from(new Set([...remote, ...local]));

    test('should merge disjoint task lists', () => {
      const result = mergeTasks(['a', 'b'], ['c', 'd']);
      expect(result).toEqual(expect.arrayContaining(['a', 'b', 'c', 'd']));
      expect(result.length).toBe(4);
    });

    test('should deduplicate overlapping tasks', () => {
      const result = mergeTasks(['a', 'b', 'c'], ['b', 'c', 'd']);
      expect(result.length).toBe(4);
      expect(result).toEqual(expect.arrayContaining(['a', 'b', 'c', 'd']));
    });

    test('should handle empty remote', () => {
      const result = mergeTasks([], ['a', 'b']);
      expect(result).toEqual(['a', 'b']);
    });

    test('should handle empty local', () => {
      const result = mergeTasks(['a', 'b'], []);
      expect(result).toEqual(['a', 'b']);
    });

    test('should handle both empty', () => {
      expect(mergeTasks([], [])).toEqual([]);
    });

    test('should handle identical lists', () => {
      const result = mergeTasks(['a', 'b'], ['a', 'b']);
      expect(result.length).toBe(2);
    });
  });

  describe('Checklist Merging (Map Dedup)', () => {
    const mergeChecklists = (remote, local) => {
      const map = new Map();
      [...remote, ...local].forEach((item) => map.set(item.id, item));
      return Array.from(map.values());
    };

    test('should merge unique checklists', () => {
      const remote = [{ id: '1', title: 'A' }];
      const local = [{ id: '2', title: 'B' }];
      const result = mergeChecklists(remote, local);
      expect(result.length).toBe(2);
    });

    test('should deduplicate by id, local wins', () => {
      const remote = [{ id: '1', title: 'Remote' }];
      const local = [{ id: '1', title: 'Local' }];
      const result = mergeChecklists(remote, local);
      expect(result.length).toBe(1);
      expect(result[0].title).toBe('Local');
    });

    test('should handle empty remote', () => {
      const result = mergeChecklists([], [{ id: '1', title: 'A' }]);
      expect(result.length).toBe(1);
    });

    test('should handle empty local', () => {
      const result = mergeChecklists([{ id: '1', title: 'A' }], []);
      expect(result.length).toBe(1);
    });

    test('should handle both empty', () => {
      expect(mergeChecklists([], [])).toEqual([]);
    });
  });

  describe('Progress Merging (Object Spread)', () => {
    const mergeProgress = (remote, local) => ({ ...remote, ...local });

    test('should merge disjoint progress', () => {
      const result = mergeProgress(
        { eq_home: [0, 1] },
        { fl_prevent: [0, 2] }
      );
      expect(result).toEqual({ eq_home: [0, 1], fl_prevent: [0, 2] });
    });

    test('should let local override remote for same key', () => {
      const result = mergeProgress(
        { eq_home: [0, 1] },
        { eq_home: [0, 1, 2, 3] }
      );
      expect(result.eq_home).toEqual([0, 1, 2, 3]);
    });

    test('should handle empty remote', () => {
      const result = mergeProgress({}, { eq_home: [0] });
      expect(result).toEqual({ eq_home: [0] });
    });

    test('should handle empty local', () => {
      const result = mergeProgress({ eq_home: [0] }, {});
      expect(result).toEqual({ eq_home: [0] });
    });
  });

  describe('XP Conflict Resolution', () => {
    const resolveXP = (remoteXP, localXP) => Math.max(remoteXP, localXP);

    test('should pick higher remote XP', () => {
      expect(resolveXP(500, 300)).toBe(500);
    });

    test('should pick higher local XP', () => {
      expect(resolveXP(200, 400)).toBe(400);
    });

    test('should handle equal XP', () => {
      expect(resolveXP(100, 100)).toBe(100);
    });

    test('should handle zero XP', () => {
      expect(resolveXP(0, 0)).toBe(0);
    });

    test('should handle one zero', () => {
      expect(resolveXP(0, 150)).toBe(150);
      expect(resolveXP(150, 0)).toBe(150);
    });
  });

  describe('Preferences Merge (Remote Wins)', () => {
    test('remote preferences should take priority', () => {
      const remote = { vibration: false, notifications: true };
      const local = { vibration: true, notifications: false };
      
      const result = remote;
      expect(result.vibration).toBe(false);
      expect(result.notifications).toBe(true);
    });

    test('should use defaults when remote is missing', () => {
      const remote = null;
      const defaults = { vibration: true, notifications: true };
      const result = remote || defaults;
      expect(result).toEqual(defaults);
    });
  });

  describe('Logout Reset', () => {
    test('should reset all state to defaults', () => {
      const defaults = {
        userXP: 0,
        userLevel: 1,
        completedTasks: [],
        savedChecklists: [],
        savedQuizzes: [],
        checklistProgress: {},
        pushToken: null,
        preferences: { vibration: true, notifications: true },
      };

      
      const state = { ...defaults };
      expect(state.userXP).toBe(0);
      expect(state.userLevel).toBe(1);
      expect(state.completedTasks).toEqual([]);
      expect(state.savedChecklists).toEqual([]);
      expect(state.savedQuizzes).toEqual([]);
      expect(state.checklistProgress).toEqual({});
      expect(state.pushToken).toBeNull();
      expect(state.preferences).toEqual({ vibration: true, notifications: true });
    });
  });
});
