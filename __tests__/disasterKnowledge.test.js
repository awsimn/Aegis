

const { CONTENT_MAP, NAV_TREE } = require('../src/data/disasterKnowledge');

describe('Disaster Knowledge Base', () => {
  
  describe('CONTENT_MAP Structure', () => {
    test('should export a non-empty CONTENT_MAP', () => {
      expect(Object.keys(CONTENT_MAP).length).toBeGreaterThan(0);
    });

    test('every entry should have required fields', () => {
      Object.entries(CONTENT_MAP).forEach(([key, entry]) => {
        expect(entry).toHaveProperty('id');
        expect(entry).toHaveProperty('title');
        expect(entry).toHaveProperty('category');
        expect(entry).toHaveProperty('phase');
        expect(entry).toHaveProperty('tags');
        expect(entry).toHaveProperty('summary');
        expect(entry).toHaveProperty('steps');
      });
    });

    test('every entry id should match its map key', () => {
      Object.entries(CONTENT_MAP).forEach(([key, entry]) => {
        expect(entry.id).toBe(key);
      });
    });

    test('every entry should have a non-empty title', () => {
      Object.values(CONTENT_MAP).forEach((entry) => {
        expect(typeof entry.title).toBe('string');
        expect(entry.title.length).toBeGreaterThan(0);
      });
    });

    test('every entry should have a valid category', () => {
      const validCategories = [
        'earthquake', 'flood', 'fire', 'storm',
        'drought', 'epidemic', 'firstaid', 'survival',
      ];
      Object.values(CONTENT_MAP).forEach((entry) => {
        expect(validCategories).toContain(entry.category);
      });
    });

    test('every entry should have a valid phase', () => {
      const validPhases = ['before', 'during', 'after'];
      Object.values(CONTENT_MAP).forEach((entry) => {
        expect(validPhases).toContain(entry.phase);
      });
    });

    test('tags should be non-empty arrays of strings', () => {
      Object.values(CONTENT_MAP).forEach((entry) => {
        expect(Array.isArray(entry.tags)).toBe(true);
        expect(entry.tags.length).toBeGreaterThan(0);
        entry.tags.forEach((tag) => {
          expect(typeof tag).toBe('string');
          expect(tag.length).toBeGreaterThan(0);
        });
      });
    });

    test('steps should be non-empty arrays of strings', () => {
      Object.values(CONTENT_MAP).forEach((entry) => {
        expect(Array.isArray(entry.steps)).toBe(true);
        expect(entry.steps.length).toBeGreaterThan(0);
        entry.steps.forEach((step) => {
          expect(typeof step).toBe('string');
          expect(step.length).toBeGreaterThan(0);
        });
      });
    });

    test('priority field (when present) should be valid', () => {
      const validPriorities = ['critical', 'high', 'medium'];
      Object.values(CONTENT_MAP).forEach((entry) => {
        if (entry.priority) {
          expect(validPriorities).toContain(entry.priority);
        }
      });
    });
  });

  
  describe('Content Coverage', () => {
    test('should have earthquake content', () => {
      const eq = Object.values(CONTENT_MAP).filter((e) => e.category === 'earthquake');
      expect(eq.length).toBeGreaterThanOrEqual(3);
    });

    test('should have flood content', () => {
      const fl = Object.values(CONTENT_MAP).filter((e) => e.category === 'flood');
      expect(fl.length).toBeGreaterThanOrEqual(2);
    });

    test('should have fire content', () => {
      const fi = Object.values(CONTENT_MAP).filter((e) => e.category === 'fire');
      expect(fi.length).toBeGreaterThanOrEqual(1);
    });

    test('should have storm content', () => {
      const st = Object.values(CONTENT_MAP).filter((e) => e.category === 'storm');
      expect(st.length).toBeGreaterThanOrEqual(1);
    });

    test('should have first aid content', () => {
      const fa = Object.values(CONTENT_MAP).filter((e) => e.category === 'firstaid');
      expect(fa.length).toBeGreaterThanOrEqual(3);
    });

    test('should have survival content', () => {
      const sv = Object.values(CONTENT_MAP).filter((e) => e.category === 'survival');
      expect(sv.length).toBeGreaterThanOrEqual(1);
    });

    test('should have critical-priority entries', () => {
      const criticals = Object.values(CONTENT_MAP).filter(
        (e) => e.priority === 'critical'
      );
      expect(criticals.length).toBeGreaterThanOrEqual(5);
    });
  });

  
  describe('NAV_TREE Structure', () => {
    test('should export a non-empty NAV_TREE', () => {
      expect(NAV_TREE.length).toBeGreaterThan(0);
    });

    test('every category node should have required fields', () => {
      NAV_TREE.forEach((cat) => {
        expect(cat).toHaveProperty('id');
        expect(cat).toHaveProperty('title');
        expect(cat).toHaveProperty('icon');
        expect(cat).toHaveProperty('color');
        expect(cat).toHaveProperty('description');
        expect(cat).toHaveProperty('sections');
      });
    });

    test('all section IDs should reference valid CONTENT_MAP entries', () => {
      NAV_TREE.forEach((cat) => {
        cat.sections.forEach((section) => {
          section.ids.forEach((id) => {
            expect(CONTENT_MAP[id]).toBeDefined();
          });
        });
      });
    });

    test('every section should have a valid phase', () => {
      const validPhases = ['before', 'during', 'after'];
      NAV_TREE.forEach((cat) => {
        cat.sections.forEach((section) => {
          expect(validPhases).toContain(section.phase);
        });
      });
    });

    test('colors should be valid hex strings', () => {
      const hexRegex = /^#[0-9A-Fa-f]{6}$/;
      NAV_TREE.forEach((cat) => {
        expect(hexRegex.test(cat.color)).toBe(true);
      });
    });
  });
});
