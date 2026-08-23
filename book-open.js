/* A small procedural "book opening" sound, meant to play when the
   Dictionary page opens. Synthesized entirely with the Web Audio API, so
   there's no audio file to fetch or ship with the site.

   Four layers: a slow, low leather/board creak as the cover swings open,
   a bursty "page flutter" texture (the same catch-and-release jitter
   technique used elsewhere on this site for water/foam, here tuned lower
   and duller for paper), a handful of individual page "flicks" riding on
   top of the flutter, and a deep low thud as the book settles open at the
   end. About 1.6 seconds total.

   Browsers block audio autoplay without a user gesture, so this tries to
   play immediately on load and, if the browser suspends it, quietly
   finishes the job on the visitor's very first click/key/touch. */
(function () {
  function makeCurve(fn, n) {
    var arr = new Float32Array(n);
    for (var i = 0; i < n; i++) arr[i] = fn(i / (n - 1));
    return arr;
  }

  // a handful of randomly-placed "catch" targets, interpolated with an
  // ease-in-then-hold shape per segment -- gives a bursty, irregular
  // texture instead of a steady hiss
  function makeJitter(steps, magnitude) {
    var points = [];
    for (var i = 0; i <= steps; i++) {
      points.push((Math.random() * 2 - 1) * magnitude);
    }
    return function (t) {
      var idx = Math.min(steps - 1, Math.floor(t * steps));
      var localT = t * steps - idx;
      var eased = localT < 0.7 ? Math.pow(localT / 0.7, 2) : 1;
      var v0 = points[idx], v1 = points[idx + 1];
      return v0 + (v1 - v0) * eased;
    };
  }

  function buildBookOpen(ctx) {
    var now = ctx.currentTime;
    var sr = ctx.sampleRate;
    var totalDur = 1.6;

    var master = ctx.createGain();
    master.connect(ctx.destination);
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(1, now + 0.04);
    master.gain.setValueAtTime(1, now + totalDur - 0.3);
    master.gain.linearRampToValueAtTime(0.0001, now + totalDur);

    var noiseBuffer = (function () {
      var len = Math.ceil(sr * (totalDur + 0.15));
      var buf = ctx.createBuffer(1, len, sr);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      return buf;
    })();

    function noiseLayer(dur, filterType, freqCurveFn, gainCurveFn, q) {
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      var filt = ctx.createBiquadFilter();
      filt.type = filterType;
      if (q != null) filt.Q.value = q;
      if (freqCurveFn) {
        filt.frequency.setValueCurveAtTime(makeCurve(freqCurveFn, 150), now, dur);
      }
      var g = ctx.createGain();
      g.gain.setValueCurveAtTime(makeCurve(gainCurveFn, 150), now, dur);
      src.connect(filt);
      filt.connect(g);
      g.connect(master);
      src.start(now);
      src.stop(now + dur + 0.05);
    }

    // --- cover creak: a slow, low board/leather groan as it swings open
    noiseLayer(
      0.68,
      'bandpass',
      function (t) { return 300 - 150 * t; },
      function (t) {
        return 0.3 * Math.pow(1 - t, 1.5) * (t < 0.08 ? t / 0.08 : 1);
      },
      5
    );

    // --- page flutter: bursty, but duller and lower than a crisp riffle
    var flutterJitter = makeJitter(40, 1);
    (function () {
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      var filt = ctx.createBiquadFilter();
      filt.type = 'bandpass';
      filt.frequency.value = 1700;
      filt.Q.value = 0.6;
      var g = ctx.createGain();
      var dur = 1.05;
      var start = 0.26;
      g.gain.setValueCurveAtTime(
        makeCurve(function (t) {
          var burst = Math.max(0, flutterJitter(t));
          var envelope = t < 0.3 ? t / 0.3 : Math.pow(1 - (t - 0.3) / 0.7, 1.3);
          return 0.02 + 0.15 * burst * envelope;
        }, 150),
        now + start,
        dur
      );
      src.connect(filt);
      filt.connect(g);
      g.connect(master);
      src.start(now + start);
      src.stop(now + start + dur + 0.05);
    })();

    // --- a few individual page "flicks", spaced further apart and duller
    [0.32, 0.54, 0.75, 0.93, 1.1].forEach(function (t) {
      var src = ctx.createBufferSource();
      src.buffer = noiseBuffer;
      var bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.Q.value = 2.5;
      bp.frequency.value = 2000 + Math.random() * 900;
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now + t);
      g.gain.linearRampToValueAtTime(0.11, now + t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0005, now + t + 0.11);
      src.connect(bp);
      bp.connect(g);
      g.connect(master);
      src.start(now + t);
      src.stop(now + t + 0.14);
    });

    // --- deep low thud as the book settles open
    (function () {
      var t = 1.32;
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(62, now + t);
      osc.frequency.exponentialRampToValueAtTime(34, now + t + 0.26);
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, now + t);
      g.gain.linearRampToValueAtTime(0.2, now + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0005, now + t + 0.34);
      osc.connect(g);
      g.connect(master);
      osc.start(now + t);
      osc.stop(now + t + 0.4);
    })();

    return totalDur;
  }

  var ctx = null;
  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    var dur = buildBookOpen(ctx);
    setTimeout(function () {
      try { ctx.close(); } catch (e) {}
    }, (dur + 0.4) * 1000);
    return ctx;
  }

  function tryPlay() {
    var c = ensureCtx();
    if (!c) return;
    if (c.state === 'suspended') {
      c.resume().catch(function () {});
    }
  }

  window.addEventListener('load', function () {
    setTimeout(tryPlay, 200);
  });
  ['pointerdown', 'keydown', 'touchstart'].forEach(function (evt) {
    document.addEventListener(evt, tryPlay, { once: true, passive: true });
  });
})();
