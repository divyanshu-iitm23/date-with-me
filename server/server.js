/*
 * OPTIONAL backend — you do NOT need this to share the app.
 * The frontend works perfectly on its own as a static site.
 *
 * Run this only if you want to FIND OUT what she picked. It:
 *   1. serves the frontend (the files in the project root), and
 *   2. saves her final answer to server/responses.json (and logs it to the
 *      terminal) when she reaches the "It's a Date!!" screen.
 *
 * How to run:
 *   cd server
 *   npm install
 *   npm start
 *   then open http://localhost:3000
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// allow JSON request bodies
app.use(express.json());

// serve the frontend (index.html, css/, js/) which live one folder up
app.use(express.static(path.join(__dirname, '..')));

// receive her answer
app.post('/api/response', (req, res) => {
  const entry = Object.assign({}, req.body, { receivedAt: new Date().toISOString() });
  const file = path.join(__dirname, 'responses.json');

  let all = [];
  try { all = JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { /* no file yet */ }
  all.push(entry);
  fs.writeFileSync(file, JSON.stringify(all, null, 2));

  console.log('\n💌  New response received:');
  console.log(`    Answer : ${entry.answer}`);
  console.log(`    When   : ${entry.date}  ·  ${entry.time}`);
  console.log(`    Food   : ${entry.cuisine}\n`);

  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`\n💖  Date app running at http://localhost:${PORT}`);
  console.log('    Her answers will be saved to server/responses.json\n');
});
