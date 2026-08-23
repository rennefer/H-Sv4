/* A small procedural "ship timbers creaking" sound, played when you head
   into the Wenamun section (a tale of a sea voyage -- and its nav glyph is
   literally a boat, 𓊛). Synthesized entirely with the Web Audio API, so
   there's no audio file to fetch or ship with the site. */
(function () {
  function playShipCreak() {
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return 0;
      var ctx = new AC();
      var now = ctx.currentTime;

      var master = ctx.createGain();
      master.gain.value = 1;
      master.connect(ctx.destination);

      // shared noise source: filtered + swept into a low groan, this is
      // what makes strained wood/rope sound like it's creaking
      var noiseBuffer = (function () {
        var len = Math.ceil(ctx.sampleRate * 1.4);
        var buf = ctx.createBuffer(1, len, ctx.sampleRate);
        var data = buf.getChannelData(0);
        for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
        return buf;
      })();

      var creaks = [
        { start: 0.00, dur: 0.85, f0: 260, f1: 150, q: 9, gain: 0.55 },
        { start: 0.18, dur: 0.65, f0: 420, f1: 230, q: 12, gain: 0.32 },
        { start: 0.50, dur: 0.55, f0: 300, f1: 520, q: 7, gain: 0.28 }
      ];

      creaks.forEach(function (c) {
        var src = ctx.createBufferSource();
        src.buffer = noiseBuffer;

        var bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.Q.value = c.q;
        bp.frequency.setValueAtTime(c.f0, now + c.start);
        bp.frequency.linearRampToValueAtTime(c.f1, now + c.start + c.dur * 0.65);
        bp.frequency.linearRampToValueAtTime(c.f1 * 0.85, now + c.start + c.dur);

        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now + c.start);
        g.gain.linearRampToValueAtTime(c.gain, now + c.start + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + c.start + c.dur);

        src.connect(bp);
        bp.connect(g);
        g.connect(master);
        src.start(now + c.start);
        src.stop(now + c.start + c.dur + 0.05);
      });

      // two short low "knock" transients -- timber taking the strain
      [0.06, 0.42].forEach(function (t, idx) {
        var osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 110 : 90, now + t);
        osc.frequency.exponentialRampToValueAtTime(60, now + t + 0.12);

        var g = ctx.createGain();
        g.gain.setValueAtTime(0.0001, now + t);
        g.gain.linearRampToValueAtTime(0.22, now + t + 0.01);
        g.gain.exponentialRampToValueAtTime(0.001, now + t + 0.16);

        osc.connect(g);
        g.connect(master);
        osc.start(now + t);
        osc.stop(now + t + 0.2);
      });

      var totalDur = 0;
      creaks.forEach(function (c) {
        totalDur = Math.max(totalDur, c.start + c.dur);
      });
      totalDur += 0.1;

      setTimeout(function () {
        try { ctx.close(); } catch (e) {}
      }, (totalDur + 0.3) * 1000);

      return totalDur;
    } catch (e) {
      return 0;
    }
  }

  function wireUp() {
    var links = document.querySelectorAll('a[href="wenamun.html"]');
    links.forEach(function (a) {
      a.addEventListener('click', function (ev) {
        if (ev.defaultPrevented || ev.button !== 0 || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey) return;
        var href = a.getAttribute('href');
        var dur = playShipCreak();
        if (!dur) return; // Web Audio unavailable -- just navigate normally
        ev.preventDefault();
        var delayMs = Math.min(650, Math.max(250, dur * 1000 * 0.55));
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
