/* A small procedural "pling" sound effect, played when you click through
   to the Sign List. Synthesized entirely with the Web Audio API, so
   there's no audio file to fetch or ship with the site.

   A single bright, clean tone -- a sine fundamental with a quiet quieter
   octave overtone for a touch of shimmer, quick attack, short exponential
   decay. About a third of a second. */
(function () {
  function playPling() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return 0;
      var ctx = new AC();
      var now = ctx.currentTime;
      var totalDur = 0.4;

      var master = ctx.createGain();
      master.connect(ctx.destination);

      var freq = 783.99; // G5 -- one octave lower

      var fundamental = ctx.createOscillator();
      fundamental.type = 'sine';
      fundamental.frequency.value = freq;
      var overtone = ctx.createOscillator();
      overtone.type = 'sine';
      overtone.frequency.value = freq * 2.01;

      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(0.3, now + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0004, now + totalDur);

      var overtoneGain = ctx.createGain();
      overtoneGain.gain.value = 0.28;

      fundamental.connect(g);
      overtone.connect(overtoneGain);
      overtoneGain.connect(g);
      g.connect(master);

      fundamental.start(now);
      fundamental.stop(now + totalDur + 0.05);
      overtone.start(now);
      overtone.stop(now + totalDur + 0.05);

      setTimeout(function () {
        try { ctx.close(); } catch (e) {}
      }, (totalDur + 0.3) * 1000);

      return totalDur;
    } catch (e) {
      return 0;
    }
  }

  function wireUp() {
    var links = document.querySelectorAll('a[href="sign-list.html"]');
    links.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
        var href = a.getAttribute('href');
        var dur = playPling();
        if (!dur) return; // Web Audio unavailable -- just navigate normally
        ev.preventDefault();
        var delayMs = Math.min(500, Math.max(220, dur * 1000 * 0.55));
        setTimeout(function () {
          window.location.href = href;
        }, delayMs);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', wireUp);
  } else {
    wireUp();
  }
})();
