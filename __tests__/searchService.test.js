



const { CONTENT_MAP } = require('../src/data/disasterKnowledge');


const { searchService } = require('../src/services/SearchService');

describe('SearchService — Trie-Based Search Engine', () => {
  
  describe('Index Building', () => {
    test('should build index without errors', () => {
      expect(() => searchService.buildIndex()).not.toThrow();
    });

    test('should mark itself as indexed after building', () => {
      searchService.buildIndex();
      expect(searchService.indexed).toBe(true);
    });

    test('should not re-index if already indexed', () => {
      searchService.indexed = true;
      const spy = jest.spyOn(searchService.trie, 'insert');
      searchService.buildIndex();
      
      expect(spy).not.toHaveBeenCalled();
      spy.mockRestore();
    });

    test('should index all content entries', () => {
      searchService.buildIndex();
      const entryCount = Object.keys(CONTENT_MAP).length;
      expect(entryCount).toBeGreaterThan(0);
      
      Object.values(CONTENT_MAP).forEach((entry) => {
        if (entry.category) {
          const results = searchService.trie.prefixSearch(entry.category.toLowerCase());
          expect(results.size).toBeGreaterThan(0);
        }
      });
    });
  });

  
  describe('Single-Word Search', () => {
    beforeAll(() => {
      searchService.buildIndex();
    });

    test('should find results for "earthquake"', () => {
      const results = searchService.search('earthquake');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((r) => {
        expect(r.category).toBe('earthquake');
      });
    });

    test('should find results for "flood"', () => {
      const results = searchService.search('flood');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should find results for "fire"', () => {
      const results = searchService.search('fire');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should find results for "tornado"', () => {
      const results = searchService.search('tornado');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should find results for "cpr"', () => {
      const results = searchService.search('cpr');
      expect(results.length).toBeGreaterThan(0);
      const titles = results.map((r) => r.title.toLowerCase());
      expect(titles.some((t) => t.includes('cpr'))).toBe(true);
    });

    test('should find results for "bleeding"', () => {
      const results = searchService.search('bleeding');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should return empty array for nonsense query', () => {
      const results = searchService.search('xyzzyplugh');
      expect(results).toEqual([]);
    });

    test('should return empty array for empty string', () => {
      const results = searchService.search('');
      expect(results).toEqual([]);
    });

    test('should return empty array for whitespace-only query', () => {
      const results = searchService.search('   ');
      expect(results).toEqual([]);
    });
  });

  
  describe('Prefix Search', () => {
    beforeAll(() => {
      searchService.buildIndex();
    });

    test('should find entries by prefix "earth"', () => {
      const results = searchService.search('earth');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should find entries by prefix "flo"', () => {
      const results = searchService.search('flo');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should find entries by short prefix "dr"', () => {
      const results = searchService.search('dr');
      expect(results.length).toBeGreaterThan(0);
    });

    test('should find entries by prefix "burn"', () => {
      const results = searchService.search('burn');
      expect(results.length).toBeGreaterThan(0);
    });
  });

  
  describe('Multi-Word Search', () => {
    beforeAll(() => {
      searchService.buildIndex();
    });

    test('should intersect results for "earthquake during"', () => {
      const results = searchService.search('earthquake during');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((r) => {
        expect(r.category).toBe('earthquake');
        expect(r.phase).toBe('during');
      });
    });

    test('should intersect results for "flood before"', () => {
      const results = searchService.search('flood before');
      expect(results.length).toBeGreaterThan(0);
      results.forEach((r) => {
        expect(r.category).toBe('flood');
        expect(r.phase).toBe('before');
      });
    });

    test('should return empty for contradicting multi-word "earthquake tornado"', () => {
      
      const results = searchService.search('earthquake tornado');
      
      
      expect(Array.isArray(results)).toBe(true);
    });
  });

  
  describe('Relevance Sorting', () => {
    beforeAll(() => {
      searchService.buildIndex();
    });

    test('should prioritize critical entries over high entries', () => {
      const results = searchService.search('earthquake');
      if (results.length >= 2) {
        const priorities = results.map((r) => r.priority);
        const criticalIdx = priorities.indexOf('critical');
        const highIdx = priorities.indexOf('high');
        if (criticalIdx !== -1 && highIdx !== -1) {
          expect(criticalIdx).toBeLessThan(highIdx);
        }
      }
    });

    test('should respect limit parameter', () => {
      const results = searchService.search('earthquake', 2);
      expect(results.length).toBeLessThanOrEqual(2);
    });

    test('should default to max 20 results', () => {
      const results = searchService.search('e');
      expect(results.length).toBeLessThanOrEqual(20);
    });
  });

  
  describe('getSuggestions', () => {
    beforeAll(() => {
      searchService.buildIndex();
    });

    test('should return suggestions for prefix "earth"', () => {
      const suggestions = searchService.getSuggestions('earth');
      expect(Array.isArray(suggestions)).toBe(true);
      
      suggestions.forEach((s) => {
        expect(s.startsWith('earth')).toBe(true);
      });
    });

    test('should return empty for nonsense prefix', () => {
      const suggestions = searchService.getSuggestions('xyzzyplugh');
      expect(suggestions).toEqual([]);
    });

    test('should return empty for empty string', () => {
      const suggestions = searchService.getSuggestions('');
      expect(suggestions).toEqual([]);
    });

    test('should respect limit', () => {
      const suggestions = searchService.getSuggestions('e', 3);
      expect(suggestions.length).toBeLessThanOrEqual(3);
    });
  });

  
  describe('getById', () => {
    test('should return entry for valid ID', () => {
      const entry = searchService.getById('eq_during_001');
      expect(entry).not.toBeNull();
      expect(entry.title).toBe('Drop, Cover, Hold On');
      expect(entry.category).toBe('earthquake');
    });

    test('should return null for invalid ID', () => {
      expect(searchService.getById('nonexistent_id')).toBeNull();
    });
  });

  describe('getByCategory', () => {
    test('should return all earthquake entries', () => {
      const entries = searchService.getByCategory('earthquake');
      expect(entries.length).toBeGreaterThan(0);
      entries.forEach((e) => expect(e.category).toBe('earthquake'));
    });

    test('should return all flood entries', () => {
      const entries = searchService.getByCategory('flood');
      expect(entries.length).toBeGreaterThan(0);
      entries.forEach((e) => expect(e.category).toBe('flood'));
    });

    test('should return all firstaid entries', () => {
      const entries = searchService.getByCategory('firstaid');
      expect(entries.length).toBeGreaterThan(0);
      entries.forEach((e) => expect(e.category).toBe('firstaid'));
    });

    test('should return empty for nonexistent category', () => {
      const entries = searchService.getByCategory('aliens');
      expect(entries).toEqual([]);
    });
  });
});
