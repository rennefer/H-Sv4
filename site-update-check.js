/* Quietly keeps a long-open tab up to date.

   Opening a page always gets the newest HTML already (sw.js loads pages
   network-first), so nothing needs to happen on a fresh load. This script
   only notes which deployment (version.json) was live when the page opened,
   and reloads later if a NEWER deployment appears while the tab stays open
   (checked when the tab becomes visible again, and every few minutes).

   It never reloads right after opening a page, so the page no longer loads
   twice and jumps. The build stamps written into the pages are not used. */
(function () {
  var CHECK_URL = 'version.json';
  var seen = null;          // deployment that was live when this page opened
  var checking = false;

  function bust(url) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now();
  }

  function check() {
    if (checking) return;
    checking = true;
    fetch(bust(CHECK_URL), { cache: 'no-store' })
      .then(function (res) { return res && res.ok ? res.json() : null; })
      .then(function (data) {
        checking = false;
        if (!data || !data.build) return;
        if (seen === null) { seen = data.build; return; }   // first look: just remember it
        if (data.build !== seen) location.reload();          // a newer deployment went live while the tab was open
      })
      .catch(function () { checking = false; });
  }

  if (document.readyState === 'complete') check();
  else window.addEventListener('load', check);
  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') check();
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted) check();
  });
  setInterval(function () {
    if (document.visibilityState === 'visible') check();
  }, 4 * 60 * 1000);
})();
