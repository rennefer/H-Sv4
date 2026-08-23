/* Silently checks version.json against the build stamp embedded in this
   page (window.__BUILD__) and reloads the page if GitHub has a newer
   deployment. No banner, no prompt -- just a quiet reload.

   version.json itself is always fetched straight from the network (the
   service worker, sw.js, is written to never cache that one file), so this
   check actually sees new deployments instead of reading a stale cached
   copy of itself. */
(function () {
  if (!window.__BUILD__) return;

  var CHECK_URL = 'version.json';
  var RELOAD_GUARD_KEY = 'hsBuildReloadTarget';
  var checking = false;

  function bust(url) {
    return url + (url.indexOf('?') === -1 ? '?' : '&') + '_=' + Date.now();
  }

  function alreadyTriedThisBuild(build) {
    try {
      return sessionStorage.getItem(RELOAD_GUARD_KEY) === build;
    } catch (e) {
      return false;
    }
  }

  function markTried(build) {
    try {
      sessionStorage.setItem(RELOAD_GUARD_KEY, build);
    } catch (e) {}
  }

  function check() {
    if (checking) return;
    checking = true;
    fetch(bust(CHECK_URL), { cache: 'no-store' })
      .then(function (res) {
        return res && res.ok ? res.json() : null;
      })
      .then(function (data) {
        checking = false;
        if (!data || !data.build || data.build === window.__BUILD__) return;
        // only ever attempt one silent reload per target build per tab, so a
        // transiently-inconsistent deploy (CDN edge lag, etc.) can't loop
        if (alreadyTriedThisBuild(data.build)) return;
        markTried(data.build);
        location.reload();
      })
      .catch(function () {
        checking = false;
      });
  }

  // check shortly after the page settles, whenever the tab becomes visible
  // again (covers a tab left open in the background, and the installed-PWA
  // case), and on a slow periodic timer as a backstop
  window.addEventListener('load', function () {
    setTimeout(check, 1500);
  });
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
