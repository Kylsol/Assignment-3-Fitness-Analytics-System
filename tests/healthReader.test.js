const { healthMetricsCounter, readHealthJson } = require('../src/healthReader');

describe('healthReader', () => {
  test('readHealthJson returns parsed data for valid JSON', async () => {
    const data = await readHealthJson('./data/health-metrics.json');
    expect(data).not.toBeNull();
  });

  test('healthMetricsCounter returns a number for a valid file', async () => {
    const count = await healthMetricsCounter('./data/health-metrics.json');
    expect(typeof count).toBe('number');
    expect(count).toBeGreaterThanOrEqual(0);
  });

  test('healthMetricsCounter returns null for missing file', async () => {
    const count = await healthMetricsCounter('./data/does-not-exist.json');
    expect(count).toBeNull();
  });
});
