// src/healthReader.js
const fs = require('fs/promises'); // using promise version of fs so we can await

// tries to read + parse the JSON file
async function readHealthJson(filePath) {
  try {
    // read the file text
    const raw = await fs.readFile(filePath, 'utf8');

    // turn the text into JS object/array
    const data = JSON.parse(raw);
    return data;
  } catch (error) {
    // handles file not found
    if (error.code === 'ENOENT') {
      console.error('file not found:', filePath);
    }
    // handles JSON not valid
    else if (error.name === 'SyntaxError') {
      console.error('invalid JSON format');
    }
    // any other weird error
    else {
      console.error('unknown error:', error.message);
    }
    return null; // fail state
  }
}

// counts total entries in JSON
async function healthMetricsCounter(filePath) {
  try {
    // read file
    const data = await readHealthJson(filePath);
    if (data == null) return null; // if read failed

    // figure out where the array is stored
    let entries = null;

    // JSON is an array
    if (Array.isArray(data)) {
      entries = data;
    }
    // JSON has array under a property
    else if (Array.isArray(data.entries)) {
      entries = data.entries;
    } else if (Array.isArray(data.metrics)) {
      entries = data.metrics;
    } else if (Array.isArray(data.data)) {
      entries = data.data;
    } else {
      // if structure is weird → find first array inside object
      const firstArray = Object.values(data).find(Array.isArray);
      entries = firstArray || [];
    }

    // count
    const total = entries.length;
    console.log(`Total health entries: ${total}`);
    return total;

  } catch (error) {
    console.error('could not count metrics:', error.message);
    return null;
  }
}

// this only runs when you do: node src/healthReader.js
if (require.main === module) {
  // change this to your actual file name
  healthMetricsCounter('./data/health-metrics.json');
}

module.exports = {
  readHealthJson,
  healthMetricsCounter,
};
