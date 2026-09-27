

const { PREP_DATA } = require('../src/data/prepData');

describe('Preparedness Data', () => {
  
  describe('Data Structure', () => {
    test('should export a non-empty PREP_DATA array', () => {
      expect(Array.isArray(PREP_DATA)).toBe(true);
      expect(PREP_DATA.length).toBeGreaterThan(0);
    });

    test('every disaster type should have required fields', () => {
      PREP_DATA.forEach((category) => {
        expect(category).toHaveProperty('id');
        expect(category).toHaveProperty('title');
        expect(category).toHaveProperty('icon');
        expect(category).toHaveProperty('gradient');
        expect(category).toHaveProperty('description');
        expect(category).toHaveProperty('checklists');
      });
    });

    test('every category should have a unique ID', () => {
      const ids = PREP_DATA.map((c) => c.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  
  describe('Checklist Structure', () => {
    test('every category should have at least one checklist', () => {
      PREP_DATA.forEach((category) => {
        expect(category.checklists.length).toBeGreaterThanOrEqual(1);
      });
    });

    test('every checklist should have required fields', () => {
      PREP_DATA.forEach((category) => {
        category.checklists.forEach((checklist) => {
          expect(checklist).toHaveProperty('id');
          expect(checklist).toHaveProperty('title');
          expect(checklist).toHaveProperty('description');
          expect(checklist).toHaveProperty('items');
        });
      });
    });

    test('every checklist should have at least 5 items', () => {
      PREP_DATA.forEach((category) => {
        category.checklists.forEach((checklist) => {
          expect(checklist.items.length).toBeGreaterThanOrEqual(5);
        });
      });
    });

    test('every checklist ID should be unique', () => {
      const allIds = [];
      PREP_DATA.forEach((category) => {
        category.checklists.forEach((checklist) => {
          allIds.push(checklist.id);
        });
      });
      expect(new Set(allIds).size).toBe(allIds.length);
    });

    test('every checklist item should be a non-empty string', () => {
      PREP_DATA.forEach((category) => {
        category.checklists.forEach((checklist) => {
          checklist.items.forEach((item) => {
            expect(typeof item).toBe('string');
            expect(item.trim().length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  
  describe('Disaster Type Coverage', () => {
    test('should have earthquake prep data', () => {
      expect(PREP_DATA.find((d) => d.id === 'earthquake')).toBeDefined();
    });

    test('should have flood prep data', () => {
      expect(PREP_DATA.find((d) => d.id === 'flood')).toBeDefined();
    });

    test('should have fire prep data', () => {
      expect(PREP_DATA.find((d) => d.id === 'fire')).toBeDefined();
    });

    test('should have storm prep data', () => {
      expect(PREP_DATA.find((d) => d.id === 'storm')).toBeDefined();
    });

    test('should have general readiness data', () => {
      expect(PREP_DATA.find((d) => d.id === 'general')).toBeDefined();
    });

    test('should have drought prep data', () => {
      expect(PREP_DATA.find((d) => d.id === 'drought')).toBeDefined();
    });

    test('should have epidemic prep data', () => {
      expect(PREP_DATA.find((d) => d.id === 'epidemic')).toBeDefined();
    });
  });

  
  describe('Gradient Validation', () => {
    test('every gradient should have at least 2 colors', () => {
      PREP_DATA.forEach((category) => {
        expect(Array.isArray(category.gradient)).toBe(true);
        expect(category.gradient.length).toBeGreaterThanOrEqual(2);
      });
    });

    test('every gradient color should be a valid hex string', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      PREP_DATA.forEach((category) => {
        category.gradient.forEach((color) => {
          expect(hexRegex.test(color)).toBe(true);
        });
      });
    });
  });
});
