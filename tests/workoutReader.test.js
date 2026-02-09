const { workoutCalculator } = require('../src/workoutReader');

describe('workoutReader', () => {
  test('workoutCalculator returns totals for a valid CSV', async () => {
    const result = await workoutCalculator('./data/workouts.csv');
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('totalWorkouts');
    expect(result).toHaveProperty('totalMinutes');
    expect(typeof result.totalWorkouts).toBe('number');
    expect(typeof result.totalMinutes).toBe('number');
  });

  test('workoutCalculator returns null for missing CSV', async () => {
    const result = await workoutCalculator('./data/does-not-exist.csv');
    expect(result).toBeNull();
  });
});
