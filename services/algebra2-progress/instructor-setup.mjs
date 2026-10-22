export const setupHtml = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="color-scheme" content="light"><title>Set instructor passphrase · Algebra 2</title>
<style>
*{box-sizing:border-box}body{margin:0;background:#f1f5fb;color:#19283f;font:17px/1.55 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}main{width:min(100%,480px);margin:0 auto;padding:32px max(20px,env(safe-area-inset-left)) max(36px,env(safe-area-inset-bottom))}header p{color:#315c97;font-size:14px;font-weight:700;letter-spacing:.08em}h1{font-size:30px;line-height:1.2;margin:12px 0}section{margin-top:24px;padding:24px 20px;border:1px solid #d9e2ef;border-radius:18px;background:white;box-shadow:0 8px 24px #19385b0a}label{display:block;font-weight:650;margin:20px 0 8px}input{display:block;width:100%;min-height:50px;border:1px solid #8798af;border-radius:10px;padding:12px;font:17px system-ui}input:focus-visible,button:focus-visible,a:focus-visible{outline:3px solid #84b6ff;outline-offset:3px}input[readonly]{background:#f1f5fb;color:#334963}button{min-height:48px;cursor:pointer;font:650 16px system-ui;border-radius:10px;padding:12px 16px}button[type=submit]{display:block;width:100%;background:#205aba;color:white;border:0;margin-top:24px}.visibility{background:white;color:#244c87;border:1px solid #a3b6d0;margin-top:12px}button:disabled{opacity:.55;cursor:wait}.help{font-size:15px;color:#435975}.status{overflow-wrap:anywhere;font-size:16px}#message[data-error=true]{color:#992b24}#complete a{display:block;background:#205aba;color:white;padding:14px;text-align:center;border-radius:10px;text-decoration:none;font-weight:650}[hidden]{display:none!important}@media(max-width:360px){main{padding:24px 16px}section{padding:20px 16px}h1{font-size:27px}}
</style><script src="/instructor/setup.js" defer></script></head>
<body><main><header><p>ALGEBRA 2 · PRIVATE SETUP</p><h1>Set instructor passphrase</h1><p class="help">Choose a memorable phrase for instructor sign-in.</p></header>
<section><p id="message" class="status" role="status" aria-live="polite">Checking the private setup link… The free preview may take about a minute to wake.</p>
<form id="setup-form" hidden><label for="username">Instructor username</label><input id="username" autocomplete="username" readonly>
<label for="password">New passphrase</label><input id="password" type="password" autocomplete="new-password" minlength="15" maxlength="256" aria-describedby="guidance" required autocapitalize="none" spellcheck="false">
<p class="help" id="guidance">15–256 characters. Spaces are welcome. No required uppercase letters, numbers, or symbols.</p>
<label for="confirmation">Confirm passphrase</label><input id="confirmation" type="password" autocomplete="new-password" minlength="15" maxlength="256" required autocapitalize="none" spellcheck="false">
<button class="visibility" type="button" id="visibility" aria-pressed="false">Show passphrases</button>
<button type="submit" id="save">Save instructor passphrase</button><p class="help">The passphrase travels over HTTPS to this service. Only a salted password hash is saved in private GitHub storage. Keep the passphrase out of chat.</p></form>
<div id="complete" hidden><h2>Passphrase saved</h2><p>Private setup is complete. This link can no longer set a passphrase.</p><a href="/">Open instructor sign-in</a></div></section></main></body></html>`;

export const setupScript = `'use strict';
(() => {
  const message = document.getElementById('message'), form = document.getElementById('setup-form');
  const password = document.getElementById('password'), confirmation = document.getElementById('confirmation'), save = document.getElementById('save');
  let secret = new URLSearchParams(location.hash.slice(1)).get('setup') || '';
  history.replaceState(null, '', location.pathname);
  const notify = (text, error = false) => { message.textContent = text; message.dataset.error = String(error); };
  async function send(route, data) {
    const response = await fetch(route, { method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(120000) });
    const result = await response.json();
    if (!response.ok) { const error = Error(result.error || 'Setup could not be completed. Please retry.'); error.status = response.status; throw error; }
    return result;
  }
  document.getElementById('visibility').addEventListener('click', event => {
    const show = password.type === 'password'; password.type = confirmation.type = show ? 'text' : 'password';
    event.currentTarget.textContent = show ? 'Hide passphrases' : 'Show passphrases'; event.currentTarget.setAttribute('aria-pressed', String(show));
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (password.value !== confirmation.value) { notify('The passphrases do not match. Enter the same phrase in both fields.', true); confirmation.focus(); return; }
    save.disabled = true; password.readOnly = confirmation.readOnly = true; notify('Saving the password hash to private storage…');
    try {
      await send('/api/instructor/setup', { token: secret, password: password.value, confirmation: confirmation.value });
      secret = ''; password.value = confirmation.value = ''; form.hidden = true; message.hidden = true; document.getElementById('complete').hidden = false;
    } catch (error) {
      notify(error.name === 'TimeoutError' ? 'The service is taking longer to respond. Retry; if setup already completed, open instructor sign-in.' : error.message, true);
      if (error.status === 410) { form.hidden = true; secret = ''; password.value = confirmation.value = ''; }
    } finally { save.disabled = false; password.readOnly = confirmation.readOnly = false; }
  });
  if (!/^[\\w-]{43}$/.test(secret)) { notify('Open the complete private setup link supplied for this preview. The Windows prompt is not needed.', true); return; }
  send('/api/instructor/setup/status', { token: secret }).then(result => {
    document.getElementById('username').value = result.username; form.hidden = false; notify('This private link can be used once. Choose the instructor passphrase below.');
  }).catch(error => { secret = ''; notify(error.message, true); });
})();`;
