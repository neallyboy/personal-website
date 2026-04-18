const fs = require('fs');
const path = require('path');

const bin = path.join(__dirname, '../node_modules/stockfish/bin');
const pub = path.join(__dirname, '../public');

fs.copyFileSync(path.join(bin, 'stockfish-18-lite-single.js'),   path.join(pub, 'stockfish.js'));
fs.copyFileSync(path.join(bin, 'stockfish-18-lite-single.wasm'), path.join(pub, 'stockfish.wasm'));

console.log('✓ Stockfish copied to public/');
