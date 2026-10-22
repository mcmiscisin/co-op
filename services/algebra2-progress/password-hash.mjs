import readline from 'node:readline';
import { passwordHash } from './auth.mjs';

async function readSecret() {
  if (!process.stdin.isTTY) {
    let input = ''; for await (const chunk of process.stdin) input += chunk;
    return input.replace(/\r?\n$/, '');
  }
  process.stderr.write('Instructor passphrase (15–256 characters; input hidden): ');
  readline.emitKeypressEvents(process.stdin); process.stdin.setRawMode(true); process.stdin.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const finish = () => { process.stdin.setRawMode(false); process.stdin.pause(); process.stdin.removeListener('keypress', press); process.stderr.write('\n'); };
    const press = (text, key = {}) => {
      if (key.ctrl && key.name === 'c') { finish(); reject(Error('Cancelled.')); }
      else if (key.name === 'return') { finish(); resolve(value); }
      else if (key.name === 'backspace') value = value.slice(0, -1);
      else if (!key.ctrl && text && !/[\r\n]/.test(text)) value += text;
    };
    process.stdin.on('keypress', press);
  });
}
try { console.log(await passwordHash(await readSecret())); }
catch (error) { console.error(error.message); process.exitCode = 1; }
