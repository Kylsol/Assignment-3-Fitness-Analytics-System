// src/workoutReader.js
const fs = require('fs');
const fsp = require('fs/promises');
const csv = require('csv-parser');

async function workoutCalculator(filePath) {
  // Fast path: if file doesn't exist, return null (and log)
  try {
    await fsp.access(filePath);
  } catch {
    console.error('⚠ file not found:', filePath);
    return null;
  }

  // Stream + csv-parser with solid error handling
  return await new Promise((resolve) => {
    const rows = [];
    let finished = false;

    const done = (val) => {
      if (!finished) {
        finished = true;
        resolve(val);
      }
    };

    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => {
      console.error('⚠ problem reading CSV:', err.message);
      done(null);
    });

    stream
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('error', (err) => {
        console.error('⚠ CSV parse error:', err.message);
        done(null);
      })
      .on('end', () => {
        const totalWorkouts = rows.length;

        let totalMinutes = 0;
        for (let i = 0; i < rows.length; i++) {
          // if minutes is missing/invalid, treat as 0
          totalMinutes += Number(rows[i].minutes) || 0;
        }

        console.log(`Total workouts: ${totalWorkouts}`);
        console.log(`Total minutes: ${totalMinutes}`);
        done({ totalWorkouts, totalMinutes });
      });
  });
}

// manual run
if (require.main === module) {
  workoutCalculator('./data/workouts.csv');
}

module.exports = { workoutCalculator };
