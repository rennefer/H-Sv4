/* A small procedural "divine" sound, meant to play when the Horus and
   Seth page opens. Synthesized entirely with the Web Audio API -- no
   audio file to fetch or ship with the site. A deep struck gong: a low
   fundamental with several inharmonic overtones (the mix of frequencies
   that don't line up in a clean harmonic series is what makes struck
   metal read as metal rather than a plucked string), plus a brief
   mallet-strike transient at the very start. Kept short, around 1.3s.

   Browsers block audio autoplay without a user gesture, so this tries to
   play immediately on load and, if the browser suspends it, quietly
   finishes the job on the visitor's very first click/key/touch. */
(function () {
  function buildDivineChime(ctx) {
    var now = ctx.currentTime;
    var totalDur = 1.3;

    var master = ctx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(1, now + 0.01);
    master.gain.setValueAtTime(1, now + totalDur - 0.2);
    master.gain.linearRampToValueAtTime(0.0001, now + totalDur);
    master.connect(ctx.destination);

    // brief mallet-strike transient
    var noiseBuffer = (function () {
      var len = Math.ceil(ctx.sampleRate * 0.05);
      var buf = ctx.createBuffer(1, len, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      return buf;
    })();
    var strikeSrc = ctx.createBufferSource();
    strikeSrc.buffer = noiseBuffer;
    var strikeFilt = ctx.createBiquadFilter();
    strikeFilt.type = 'bandpass';
    strikeFilt.frequency.value = 900;
    strikeFilt.Q.value = 0.7;
    var strikeGain = ctx.createGain();
    strikeGain.gain.setValueAtTime(0.0001, now);
    strikeGain.gain.linearRampToValueAtTime(0.18, now + 0.005);
    strikeGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.09);
    strikeSrc.connect(strikeFilt);
    strikeFilt.connect(strikeGain);
    strikeGain.connect(master);
    strikeSrc.start(now);
    strikeSrc.stop(now + 0.12);

    // deep gong body: low fundamental plus inharmonic overtones
    var gongBase = 95;
    var gongPartials = [1, 1.59, 2.14, 2.65, 3.32, 4.07];
    gongPartials.forEach(function (ratio, i) {
      var osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = gongBase * ratio;
      var g = ctx.createGain();
      var peak = 0.3 / (i + 1);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.linearRampToValueAtTime(peak, now + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0004, now + 1.2 - i * 0.08);
      osc.connect(g);
      g.connect(master);
      osc.start(now);
      osc.stop(now + totalDur + 0.1);
    });

    return totalDur;
  }

  var ctx = null;
  function ensureCtx() {
    if (ctx) return ctx;
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    var dur = buildDivineChime(ctx);
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
