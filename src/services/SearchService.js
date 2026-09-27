import { CONTENT_MAP } from "../data/disasterKnowledge";

class TrieNode {
  constructor() {
    this.children = {};
    this.ids = new Set();
    this.isEnd = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(word, id) {
    let node = this.root;
    const lower = word.toLowerCase();

    for (const char of lower) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];

      node.ids.add(id);
    }
    node.isEnd = true;
  }

  prefixSearch(query) {
    let node = this.root;
    const lower = query.toLowerCase().trim();

    if (!lower) return new Set();

    for (const char of lower) {
      if (!node.children[char]) {
        return new Set();
      }
      node = node.children[char];
    }

    return new Set(node.ids);
  }
}

class SearchService {
  constructor() {
    this.trie = new Trie();
    this.contentMap = CONTENT_MAP;
    this.indexed = false;
  }

  buildIndex() {
    if (this.indexed) return;

    for (const [id, entry] of Object.entries(this.contentMap)) {
      if (entry.tags) {
        for (const tag of entry.tags) {
          const parts = tag.toLowerCase().split(/\s+/);
          for (const part of parts) {
            this.trie.insert(part, id);
          }

          if (parts.length > 1) {
            this.trie.insert(tag.replace(/\s+/g, ""), id);
          }
        }
      }

      if (entry.title) {
        const words = entry.title.toLowerCase().split(/[\s,\-&/()]+/);
        for (const word of words) {
          if (word.length > 1) {
            this.trie.insert(word, id);
          }
        }
      }

      if (entry.category) {
        this.trie.insert(entry.category, id);
      }

      if (entry.priority) {
        this.trie.insert(entry.priority, id);
      }

      if (entry.phase) {
        this.trie.insert(entry.phase, id);
      }
    }

    this.indexed = true;
  }

  search(query, limit = 20) {
    if (!this.indexed) this.buildIndex();

    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return [];

    const words = trimmed.split(/\s+/).filter((w) => w.length > 0);

    if (words.length === 0) return [];

    const wordResults = words.map((word) => this.trie.prefixSearch(word));

    let matchingIds = wordResults[0];
    for (let i = 1; i < wordResults.length; i++) {
      const next = wordResults[i];
      const intersection = new Set();
      for (const id of matchingIds) {
        if (next.has(id)) intersection.add(id);
      }
      matchingIds = intersection;
    }

    const results = Array.from(matchingIds)
      .map((id) => this.contentMap[id])
      .filter(Boolean);

    results.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2 };
      const pa = priorityOrder[a.priority] ?? 3;
      const pb = priorityOrder[b.priority] ?? 3;
      if (pa !== pb) return pa - pb;

      const aTitle = a.title.toLowerCase();
      const bTitle = b.title.toLowerCase();
      const aHasWord = words.some((w) => aTitle.includes(w));
      const bHasWord = words.some((w) => bTitle.includes(w));
      if (aHasWord && !bHasWord) return -1;
      if (!aHasWord && bHasWord) return 1;

      return 0;
    });

    return results.slice(0, limit);
  }

  getSuggestions(prefix, limit = 6) {
    if (!this.indexed) this.buildIndex();

    const lower = prefix.trim().toLowerCase();
    if (!lower) return [];

    const results = this.search(lower, 50);
    const suggestions = new Set();

    for (const entry of results) {
      for (const tag of entry.tags || []) {
        const parts = tag.toLowerCase().split(/\s+/);
        for (const part of parts) {
          if (part.startsWith(lower) && part !== lower) {
            suggestions.add(part);
          }
        }
      }

      const titleWords = entry.title.toLowerCase().split(/[\s,\-&/()]+/);
      for (const word of titleWords) {
        if (word.startsWith(lower) && word !== lower && word.length > 2) {
          suggestions.add(word);
        }
      }
    }

    return Array.from(suggestions).slice(0, limit);
  }

  getById(id) {
    return this.contentMap[id] || null;
  }

  getByCategory(category) {
    return Object.values(this.contentMap).filter(
      (entry) => entry.category === category,
    );
  }
}

export const searchService = new SearchService();
