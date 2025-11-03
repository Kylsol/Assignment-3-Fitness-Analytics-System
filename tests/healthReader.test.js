// tests/healthReader.test.js
const path = require('path');
const fs = require('fs/promises');
const { readHealthJson, healthMetricsCounter } = require('../healthReader');

const TEST_FILE = path.join(__dirname, 'test-health.json');

const testData = {
  user: 'TestUser',
  // you can use any key; healthMetricsCounter will find the first array
  metrics: [
    { date: '2025-01-01', steps: 8000 },
    { date: '2025-01-02', steps: 9500 },
  ],
};

beforeAll(async () => {
  await fs.writeFile(TEST_FILE, JSON.stringify(testData));
});

afterAll(async () => {
  try { await fs.unlink(TEST_FILE); } catch {}
});

describe('healthReader', () => {
  test('readHealthJson reads and parses valid JSON', async () => {
    const data = await readHealthJson(TEST_FILE);
    expect(data).not.toBeNull();
    expect(Array.isArray(data.metrics)).toBe(true);
    expect(data.metrics).toHaveLength(2);
  });

  test('healthMetricsCounter counts entries in array-like structures', async () => {
    const count = await healthMetricsCounter(TEST_FILE);
    expect(count).toBe(2);
  });

  test('readHealthJson returns null when file is missing', async () => {
    const data = await readHealthJson('missing.json');
    expect(data).toBeNull();
  });

  test('readHealthJson returns null on invalid JSON', async () => {
    const badFile = path.join(__dirname, 'bad.json');
    await fs.writeFile(badFile, '{ not: "valid json" ');
    const data = await readHealthJson(badFile);
    expect(data).toBeNull();
    try { await fs.unlink(badFile); } catch {}
  });
});
