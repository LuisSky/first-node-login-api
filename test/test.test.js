test('Testing switch', () => {
  const var1 = 'Guilherme';
  expect(var1).toBe('Guilherme');
});

test('Work with objects', () => {
  const obj = { name: 'Jhon Wick', mail: 'jhon@mail.com' };
  expect(obj).toHaveProperty('name');
  expect(obj.name).toBe('Jhon Wick');
});
