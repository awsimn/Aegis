

describe('Gamification Logic', () => {
  const calculateLevel = (xp) => Math.floor(xp / 100) + 1;

  describe('XP and Level Calculation', () => {
    test('0 XP = level 1', () => expect(calculateLevel(0)).toBe(1));
    test('50 XP = level 1', () => expect(calculateLevel(50)).toBe(1));
    test('99 XP = level 1', () => expect(calculateLevel(99)).toBe(1));
    test('100 XP = level 2', () => expect(calculateLevel(100)).toBe(2));
    test('200 XP = level 3', () => expect(calculateLevel(200)).toBe(3));
    test('500 XP = level 6', () => expect(calculateLevel(500)).toBe(6));
    test('999 XP = level 10', () => expect(calculateLevel(999)).toBe(10));
    test('1000 XP = level 11', () => expect(calculateLevel(1000)).toBe(11));
  });

  describe('Task Completion Logic', () => {
    let completedTasks;
    const completeTask = (taskId) => {
      if (!completedTasks.includes(taskId)) {
        completedTasks = [...completedTasks, taskId];
        return true;
      }
      return false;
    };

    beforeEach(() => { completedTasks = []; });

    test('should add a task', () => {
      expect(completeTask('eq_home')).toBe(true);
      expect(completedTasks).toContain('eq_home');
    });

    test('should not add duplicate tasks', () => {
      completeTask('eq_home');
      expect(completeTask('eq_home')).toBe(false);
      expect(completedTasks.length).toBe(1);
    });

    test('should track multiple tasks', () => {
      completeTask('eq_home');
      completeTask('fl_prevent');
      completeTask('fi_defense');
      expect(completedTasks.length).toBe(3);
    });
  });

  describe('Checklist Progress', () => {
    let progress;
    const updateProgress = (taskId, indices) => {
      progress = { ...progress, [taskId]: indices };
    };
    beforeEach(() => { progress = {}; });

    test('should track progress', () => {
      updateProgress('eq_home', [0, 1, 2]);
      expect(progress['eq_home']).toEqual([0, 1, 2]);
    });

    test('should update existing progress', () => {
      updateProgress('eq_home', [0, 1]);
      updateProgress('eq_home', [0, 1, 2, 3]);
      expect(progress['eq_home']).toEqual([0, 1, 2, 3]);
    });

    test('should track multiple checklists independently', () => {
      updateProgress('eq_home', [0, 1]);
      updateProgress('fl_prevent', [0, 2, 4]);
      expect(progress['eq_home']).toEqual([0, 1]);
      expect(progress['fl_prevent']).toEqual([0, 2, 4]);
    });
  });

  describe('Readiness Score', () => {
    const { PREP_DATA } = require('../src/data/prepData');
    const calculateReadinessScore = (checklistProgress) => {
      let totalItems = 0;
      let completedItems = 0;
      PREP_DATA.forEach((category) => {
        category.checklists.forEach((checklist) => {
          totalItems += checklist.items.length;
          const arr = checklistProgress[checklist.id] || [];
          completedItems += arr.length;
        });
      });
      if (totalItems === 0) return 0;
      return Math.round((completedItems / totalItems) * 100);
    };

    test('should return 0 when no items completed', () => {
      expect(calculateReadinessScore({})).toBe(0);
    });

    test('should return percentage when some items done', () => {
      const score = calculateReadinessScore({ eq_home: [0, 1, 2, 3, 4] });
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('should return 100 when all items completed', () => {
      const progress = {};
      PREP_DATA.forEach((cat) => {
        cat.checklists.forEach((cl) => {
          progress[cl.id] = cl.items.map((_, i) => i);
        });
      });
      expect(calculateReadinessScore(progress)).toBe(100);
    });
  });

  describe('Save Deduplication', () => {
    let savedItems;
    const saveItem = (item) => {
      if (!savedItems.find((i) => i.id === item.id)) {
        savedItems = [item, ...savedItems];
        return true;
      }
      return false;
    };
    beforeEach(() => { savedItems = []; });

    test('should save a new item', () => {
      expect(saveItem({ id: '1', title: 'Q1' })).toBe(true);
      expect(savedItems.length).toBe(1);
    });

    test('should not save duplicate', () => {
      saveItem({ id: '1', title: 'Q1' });
      expect(saveItem({ id: '1', title: 'Q1' })).toBe(false);
      expect(savedItems.length).toBe(1);
    });

    test('new items are prepended', () => {
      saveItem({ id: '1', title: 'Q1' });
      saveItem({ id: '2', title: 'Q2' });
      expect(savedItems[0].id).toBe('2');
    });
  });
});
