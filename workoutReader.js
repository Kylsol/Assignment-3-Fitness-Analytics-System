// src/workoutReader.js
const fs = require('fs');
const csv = require('csv-parser'); // reads CSV streams

// reads CSV + counts workouts + sums minutes
async function workoutCalculator(filePath) {
  try {
    return await new Promise((resolve, reject) => {
      const results = []; // hold each row
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          results.push(row);
        })
        .on('end', () => {
          // count workouts
          const totalWorkouts = results.length;

          // sum workout minutes
          let totalMinutes = 0;
          for (let i = 0; i < results.length; i++) {
            // assume CSV has a column named minutes
            totalMinutes += Number(results[i].minutes);
          }

          console.log(`Total workouts: ${totalWorkouts}`);
          console.log(`Total minutes: ${totalMinutes}`);

          resolve({ totalWorkouts, totalMinutes });
        })
        .on('error', reject);
    });
  } catch (error) {
    console.error("⚠ problem reading CSV:", error.message);
    return null;
  }
}

// manual run: node src/workoutReader.js
if (require.main === module) {
  workoutCalculator('./data/workouts.csv');
}

module.exports = {
  workoutCalculator,
};
