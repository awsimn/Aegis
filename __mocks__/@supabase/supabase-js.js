
const mockQueryBuilder = {
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  neq: jest.fn().mockReturnThis(),
  gt: jest.fn().mockReturnThis(),
  gte: jest.fn().mockReturnThis(),
  lt: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
  like: jest.fn().mockReturnThis(),
  ilike: jest.fn().mockReturnThis(),
  in: jest.fn().mockReturnThis(),
  order: jest.fn().mockReturnThis(),
  limit: jest.fn().mockReturnThis(),
  range: jest.fn().mockReturnThis(),
  single: jest.fn(() => Promise.resolve({ data: null, error: null })),
  maybeSingle: jest.fn(() => Promise.resolve({ data: null, error: null })),
  then: jest.fn((resolve) => resolve({ data: [], error: null })),
};

const mockAuth = {
  getSession: jest.fn(() =>
    Promise.resolve({ data: { session: null }, error: null })
  ),
  onAuthStateChange: jest.fn(() => ({
    data: { subscription: { unsubscribe: jest.fn() } },
  })),
  signInWithPassword: jest.fn(() =>
    Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null })
  ),
  signUp: jest.fn(() =>
    Promise.resolve({ data: { user: { id: 'mock-user' } }, error: null })
  ),
  signOut: jest.fn(() => Promise.resolve({ error: null })),
  resetPasswordForEmail: jest.fn(() => Promise.resolve({ error: null })),
};

const createClient = jest.fn(() => ({
  from: jest.fn(() => ({ ...mockQueryBuilder })),
  auth: mockAuth,
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(() => Promise.resolve({ data: { path: 'mock/path' }, error: null })),
      getPublicUrl: jest.fn(() => ({ data: { publicUrl: 'https://mock.url/image.jpg' } })),
      download: jest.fn(() => Promise.resolve({ data: new Blob(), error: null })),
    })),
  },
  rpc: jest.fn(() => Promise.resolve({ data: [], error: null })),
}));

module.exports = { createClient };
