module.exports = {
  parse: jest.fn(() =>
    Promise.resolve({
      title: 'Mock Feed',
      items: [
        {
          title: 'Mock Article',
          links: [{ url: 'https://example.com' }],
          description: 'Mock description',
          published: '2024-01-01',
        },
      ],
    })
  ),
};
