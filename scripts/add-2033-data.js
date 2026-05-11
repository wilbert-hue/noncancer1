const fs = require('fs');
const path = require('path');

// Function to calculate 2033 value based on growth from 2031 to 2032
function calculate2033Value(value2031, value2032) {
  if (!value2031 || !value2032) return 0;
  const growthRate = (value2032 - value2031) / value2031;
  return parseFloat((value2032 * (1 + growthRate)).toFixed(1));
}

// Function to process nested object and add 2033 data
function addYear2033(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  // Check if this object has year keys (2020, 2021, etc.)
  const keys = Object.keys(obj);
  const hasYearKeys = keys.some(k => /^20[0-9]{2}$/.test(k));

  if (hasYearKeys) {
    // This is a time series object
    const value2031 = obj['2031'];
    const value2032 = obj['2032'];

    if (value2031 && value2032) {
      obj['2033'] = calculate2033Value(value2031, value2032);
    }
    return obj;
  }

  // Recursively process nested objects
  for (const key in obj) {
    obj[key] = addYear2033(obj[key]);
  }

  return obj;
}

// Process value.json
console.log('Processing value.json...');
const valuePath = path.join(__dirname, '../public/data/value.json');
const valueData = JSON.parse(fs.readFileSync(valuePath, 'utf8'));
const updatedValueData = addYear2033(valueData);
fs.writeFileSync(valuePath, JSON.stringify(updatedValueData, null, 2));
console.log('✓ value.json updated with 2033 data');

// Process volume.json
console.log('Processing volume.json...');
const volumePath = path.join(__dirname, '../public/data/volume.json');
const volumeData = JSON.parse(fs.readFileSync(volumePath, 'utf8'));
const updatedVolumeData = addYear2033(volumeData);
fs.writeFileSync(volumePath, JSON.stringify(updatedVolumeData, null, 2));
console.log('✓ volume.json updated with 2033 data');

console.log('\n✅ All files updated successfully!');
