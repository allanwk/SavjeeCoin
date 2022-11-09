'use strict';
const crypto = require('crypto');

class Block {
  /**
   * @param {number} timestamp
   * @param {String} data
   * @param {string} previousHash
   */
  constructor(timestamp, data, previousHash = '') {
    this.previousHash = previousHash;
    this.timestamp = timestamp;
    this.data = this.mockData(10);
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  mockData(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
    }
    return result;
  }

  /**
   * Returns the SHA256 of this block (by processing all the data stored
   * inside this block)
   *
   * @returns {string}
   */
  calculateHash() {
    return crypto
      .createHash('sha256')
      .update(
        this.previousHash +
          this.timestamp +
          this.data +
          this.nonce
      )
      .digest('hex');
  }

  /**
   * Starts the mining process on the block. It changes the 'nonce' until the hash
   * of the block starts with enough zeros (= difficulty)
   *
   * @param {number} difficulty
   */
  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 1;
    this.miningReward = 100;
  }

  /**
   * @returns {Block}
   */
  createGenesisBlock() {
    return new Block(Date.parse('2017-01-01'), [], '0');
  }

  /**
   * Returns the latest block on our chain. Useful when you want to create a
   * new Block and you need the hash of the previous Block.
   *
   * @returns {Block[]}
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  createAndMineBlock(difficulty) {
    let hr = process.hrtime();
    const a = hr[0]*1000000000 + hr[1];
    const block = new Block(
      Date.now(),
      this.getLatestBlock().hash
    );
    block.mineBlock(difficulty);
    this.chain.push(block);
    hr = process.hrtime();
    const b = hr[0]*1000000000 + hr[1];
    const timeDelta = b - a;
    console.log(timeDelta);
    return b - a;
  }
}

module.exports.Blockchain = Blockchain;
module.exports.Block = Block;
