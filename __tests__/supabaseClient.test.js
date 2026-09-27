

const { createClient } = require('@supabase/supabase-js');

describe('Supabase Client', () => {
  test('createClient should be a function', () => {
    expect(typeof createClient).toBe('function');
  });

  test('should create a client with from() method', () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    expect(client).toBeDefined();
    expect(typeof client.from).toBe('function');
  });

  test('should create a client with auth methods', () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    expect(client.auth).toBeDefined();
    expect(typeof client.auth.signInWithPassword).toBe('function');
    expect(typeof client.auth.signUp).toBe('function');
    expect(typeof client.auth.signOut).toBe('function');
    expect(typeof client.auth.getSession).toBe('function');
    expect(typeof client.auth.onAuthStateChange).toBe('function');
    expect(typeof client.auth.resetPasswordForEmail).toBe('function');
  });

  test('from() should return chainable query builder', () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    const query = client.from('profiles');
    expect(typeof query.select).toBe('function');
    expect(typeof query.insert).toBe('function');
    expect(typeof query.update).toBe('function');
    expect(typeof query.delete).toBe('function');
    expect(typeof query.eq).toBe('function');
  });

  test('query builder should be chainable', () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    const result = client.from('profiles').select('*').eq('id', '1');
    expect(result).toBeDefined();
    expect(typeof result.single).toBe('function');
  });

  test('single() should return promise with data/error', async () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    const result = await client.from('profiles').select('*').eq('id', '1').single();
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('error');
  });

  test('signInWithPassword should resolve with user data', async () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    const result = await client.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.data).toBeDefined();
    expect(result.error).toBeNull();
  });

  test('signUp should resolve with user data', async () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    const result = await client.auth.signUp({
      email: 'new@example.com',
      password: 'password123',
    });
    expect(result.data).toBeDefined();
    expect(result.error).toBeNull();
  });

  test('signOut should resolve without error', async () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    const result = await client.auth.signOut();
    expect(result.error).toBeNull();
  });

  test('storage should have upload and getPublicUrl', () => {
    const client = createClient('https://test.supabase.co', 'test-key');
    const bucket = client.storage.from('avatars');
    expect(typeof bucket.upload).toBe('function');
    expect(typeof bucket.getPublicUrl).toBe('function');
  });
});
