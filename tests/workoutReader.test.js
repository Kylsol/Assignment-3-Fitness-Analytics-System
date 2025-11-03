const path = require('path');
const fs = require('fs/promises');
const { workoutCalculator } = require('../src/workoutReader');

const TEST_FILE = path.join(__dirname, 'test-workouts.csv');

const csvData = [
  'date,minutes',
  '2025-03-01,30',
  '2025-03-02,45',
  '2025-03-03,60',
].join('\n');

beforeAll(async () => {
  // create a small CSV to read during tests
  await fs.writeFile(TEST_FILE, csvData, 'utf8');
});

afterAll(async () => {
  // clean up the test file
  try { await fs.unlink(TEST_FILE); } catch {}
});

describe('workoutCalculator (CSV)', () => {
  test('reads a valid CSV and returns totals', async () => {
    const result = await workoutCalculator(TEST_FILE);
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('totalWorkouts', 3);
    expect(result).toHaveProperty('totalMinutes', 135); // 30+45+60
  });

  test('returns null when the file is missing', async () => {
    const result = await workoutCalculator(path.join(__dirname, 'nope.csv'));
    expect(result).toBeNull();
  });

  test('returns the expected data shape', async () => {
    const result = await workoutCalculator(TEST_FILE);
    expect(typeof result.totalWorkouts).toBe('number');
    expect(typeof result.totalMinutes).toBe('number');
  });
});
