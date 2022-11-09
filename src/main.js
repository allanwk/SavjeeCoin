'use strict';
const { Blockchain } = require('./blockchain');
const fs = require('fs');

const chain = new Blockchain();

const n_rounds = 100;
const max_diff = 6;
for(let i = 1; i <= max_diff; i++){
  const times = [];
  for(let rounds = 0; rounds < n_rounds; rounds++){
    const timeSpent = chain.createAndMineBlock(i);
    times.push(timeSpent);
    fs.appendFileSync('results.csv', `${i},${timeSpent.toFixed(0)}\n`);
  }
  const sum = times.reduce((a, b) => a + b, 0);
  const avg = (sum / times.length) || 0;
  console.log(`Average time to mine block of difficulty ${i}: ${avg} ns`);
}