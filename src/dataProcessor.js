// src/dataProcessor.js
require('dotenv').config();

const { workoutCalculator } = require('./workoutReader');
const { healthMetricsCounter } = require('./healthReader');

async function processFiles() {
  try {
    const userName = process.env.USER_NAME || 'User';
    const weeklyGoal = Number(process.env.WEEKLY_GOAL);

    if (Number.isNaN(weeklyGoal)) {
      console.error('⚠ WEEKLY_GOAL is missing or not a number in .env');
      return;
    }

    console.log(`Processing data for: ${userName}`);

    console.log('Reading workout data...');
    const workout = await workoutCalculator('./data/workouts.csv');
    if (!workout) {
      console.error('⚠ Could not process workout data.');
      return;
    }

    console.log('Reading health data...');
    const healthCount = await healthMetricsCounter('./data/health-metrics.json');
    if (healthCount == null) {
      console.error('⚠ Could not process health data.');
      return;
    }

    console.log('\n=== SUMMARY ===');
    console.log(`Workouts found: ${workout.totalWorkouts}`);
    console.log(`Total workout minutes: ${workout.totalMinutes}`);
    console.log(`Health entries found: ${healthCount}`);
    console.log(`Weekly goal: ${weeklyGoal} minutes`);

    if (workout.totalMinutes >= weeklyGoal) {
      console.log(`🎉 Congratulations ${userName}! You have exceeded your weekly goal!`);
    } else {
      const remaining = weeklyGoal - workout.totalMinutes;
      console.log(`Keep going ${userName}! You need ${remaining} more minutes to hit your goal.`);
    }
  } catch (error) {
    console.error('Error processing files:', error.message);
  }
}

processFiles();
