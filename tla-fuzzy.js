/* TLA Fuzzy Search overlay \u2014 runs on thesaurus-linguae-aegyptiae.de in your own browser.
   Typo-tolerant search over transliteration, translation (EN/DE) and hieroglyphs / Gardiner codes.
   Data: Thesaurus Linguae Aegyptiae (BBAW), CC BY-SA 4.0. Queries the TLA's own search with your verified session. */
(function () {
  'use strict';
  if (window.__tlaFuzzy) { window.__tlaFuzzy.toggle(true); return; }
  if (!/thesaurus-linguae-aegyptiae\.de$/.test(location.hostname)) {
    alert('Open thesaurus-linguae-aegyptiae.de (and pass its verification) first, then click the bookmarklet there.');
    return;
  }

  var SCRIPT_SRC = (document.currentScript && document.currentScript.src) || window.__tlaFuzzyBase || '';
  var BASE = SCRIPT_SRC.replace(/[^\/]*$/, '');
  // Gardiner code -> Unicode sign: the i-th code below is U+13000+i (Unicode 15 basic block, generated from the official character names)
  var GARD = {};
  'A1 A2 A3 A4 A5 A5a A6 A6a A6b A7 A8 A9 A10 A11 A12 A13 A14 A14a A15 A16 A17 A17a A18 A19 A20 A21 A22 A23 A24 A25 A26 A27 A28 A29 A30 A31 A32 A32a A33 A34 A35 A36 A37 A38 A39 A40 A40a A41 A42 A42a A43 A43a A44 A45 A45a A46 A47 A48 A49 A50 A51 A52 A53 A54 A55 A56 A57 A58 A59 A60 A61 A62 A63 A64 A65 A66 A67 A68 A69 A70 B1 B2 B3 B4 B5 B5a B6 B7 B8 B9 C1 C2 C2a C2b C2c C3 C4 C5 C6 C7 C8 C9 C10 C10a C11 C12 C13 C14 C15 C16 C17 C18 C19 C20 C21 C22 C23 C24 D1 D2 D3 D4 D5 D6 D7 D8 D8a D9 D10 D11 D12 D13 D14 D15 D16 D17 D18 D19 D20 D21 D22 D23 D24 D25 D26 D27 D27a D28 D29 D30 D31 D31a D32 D33 D34 D34a D35 D36 D37 D38 D39 D40 D41 D42 D43 D44 D45 D46 D46a D47 D48 D48a D49 D50 D50a D50b D50c D50d D50e D50f D50g D50h D50i D51 D52 D52a D53 D54 D54a D55 D56 D57 D58 D59 D60 D61 D62 D63 D64 D65 D66 D67 D67a D67b D67c D67d D67e D67f D67g D67h E1 E2 E3 E4 E5 E6 E7 E8 E8a E9 E9a E10 E11 E12 E13 E14 E15 E16 E16a E17 E17a E18 E19 E20 E20a E21 E22 E23 E24 E25 E26 E27 E28 E28a E29 E30 E31 E32 E33 E34 E34a E36 E37 E38 F1 F1a F2 F3 F4 F5 F6 F7 F8 F9 F10 F11 F12 F13 F13a F14 F15 F16 F17 F18 F19 F20 F21 F21a F22 F23 F24 F25 F26 F27 F28 F29 F30 F31 F31a F32 F33 F34 F35 F36 F37 F37a F38 F38a F39 F40 F41 F42 F43 F44 F45 F45a F46 F46a F47 F47a F48 F49 F50 F51 F51a F51b F51c F52 F53 G1 G2 G3 G4 G5 G6 G6a G7 G7a G7b G8 G9 G10 G11 G11a G12 G13 G14 G15 G16 G17 G18 G19 G20 G20a G21 G22 G23 G24 G25 G26 G26a G27 G28 G29 G30 G31 G32 G33 G34 G35 G36 G36a G37 G37a G38 G39 G40 G41 G42 G43 G43a G44 G45 G45a G46 G47 G48 G49 G50 G51 G52 G53 G54 H1 H2 H3 H4 H5 H6 H6a H7 H8 I1 I2 I3 I4 I5 I5a I6 I7 I8 I9 I9a I10 I10a I11 I11a I12 I13 I14 I15 K1 K2 K3 K4 K5 K6 K7 K8 L1 L2 L2a L3 L4 L5 L6 L6a L7 L8 M1 M1a M1b M2 M3 M3a M4 M5 M6 M7 M8 M9 M10 M10a M11 M12 M12a M12b M12c M12d M12e M12f M12g M12h M13 M14 M15 M15a M16 M16a M17 M17a M18 M19 M20 M21 M22 M22a M23 M24 M24a M25 M26 M27 M28 M28a M29 M30 M31 M31a M32 M33 M33a M33b M34 M35 M36 M37 M38 M39 M40 M40a M41 M42 M43 M44 N1 N2 N3 N4 N5 N6 N7 N8 N9 N10 N11 N12 N13 N14 N15 N16 N17 N18 N18a N18b N19 N20 N21 N22 N23 N24 N25 N25a N26 N27 N28 N29 N30 N31 N32 N33 N33a N34 N34a N35 N35a N36 N37 N37a N38 N39 N40 N41 N42 Nl1 Nl2 Nl3 Nl4 Nl5 Nl5a Nl6 Nl7 Nl8 Nl9 Nl10 Nl11 Nl12 Nl13 Nl14 Nl15 Nl16 Nl17 Nl17a Nl18 Nl19 Nl20 Nu1 Nu2 Nu3 Nu4 Nu5 Nu6 Nu7 Nu8 Nu9 Nu10 Nu10a Nu11 Nu11a Nu12 Nu13 Nu14 Nu15 Nu16 Nu17 Nu18 Nu18a Nu19 Nu20 Nu21 Nu22 Nu22a O1 O1a O2 O3 O4 O5 O5a O6 O6a O6b O6c O6d O6e O6f O7 O8 O9 O10 O10a O10b O10c O11 O12 O13 O14 O15 O16 O17 O18 O19 O19a O20 O20a O21 O22 O23 O24 O24a O25 O25a O26 O27 O28 O29 O29a O30 O30a O31 O32 O33 O33a O34 O35 O36 O36a O36b O36c O36d O37 O38 O39 O40 O41 O42 O43 O44 O45 O46 O47 O48 O49 O50 O50a O50b O51 P1 P1a P2 P3 P3a P4 P5 P6 P7 P8 P9 P10 P11 Q1 Q2 Q3 Q4 Q5 Q6 Q7 R1 R2 R2a R3 R3a R3b R4 R5 R6 R7 R8 R9 R10 R10a R11 R12 R13 R14 R15 R16 R16a R17 R18 R19 R20 R21 R22 R23 R24 R25 R26 R27 R28 R29 S1 S2 S2a S3 S4 S5 S6 S6a S7 S8 S9 S10 S11 S12 S13 S14 S14a S14b S15 S16 S17 S17a S18 S19 S20 S21 S22 S23 S24 S25 S26 S26a S26b S27 S28 S29 S30 S31 S32 S33 S34 S35 S35a S36 S37 S38 S39 S40 S41 S42 S43 S44 S45 S46 T1 T2 T3 T3a T4 T5 T6 T7 T7a T8 T8a T9 T9a T10 T11 T11a T12 T13 T14 T15 T16 T16a T17 T18 T19 T20 T21 T22 T23 T24 T25 T26 T27 T28 T29 T30 T31 T32 T32a T33 T33a T34 T35 T36 U1 U2 U3 U4 U5 U6 U6a U6b U7 U8 U9 U10 U11 U12 U13 U14 U15 U16 U17 U18 U19 U20 U21 U22 U23 U23a U24 U25 U26 U27 U28 U29 U29a U30 U31 U32 U32a U33 U34 U35 U36 U37 U38 U39 U40 U41 U42 V1 V1a V1b V1c V1d V1e V1f V1g V1h V1i V2 V2a V3 V4 V5 V6 V7 V7a V7b V8 V9 V10 V11 V11a V11b V11c V12 V12a V12b V13 V14 V15 V16 V17 V18 V19 V20 V20a V20b V20c V20d V20e V20f V20g V20h V20i V20j V20k V20l V21 V22 V23 V23a V24 V25 V26 V27 V28 V28a V29 V29a V30 V30a V31 V31a V32 V33 V33a V34 V35 V36 V37 V37a V38 V39 V40 V40a W1 W2 W3 W3a W4 W5 W6 W7 W8 W9 W9a W10 W10a W11 W12 W13 W14 W14a W15 W16 W17 W17a W18 W18a W19 W20 W21 W22 W23 W24 W24a W25 X1 X2 X3 X4 X4a X4b X5 X6 X6a X7 X8 X8a Y1 Y1a Y2 Y3 Y4 Y5 Y6 Y7 Y8 Z1 Z2 Z2a Z2b Z2c Z2d Z3 Z3a Z3b Z4 Z4a Z5 Z5a Z6 Z7 Z8 Z9 Z10 Z11 Z12 Z13 Z14 Z15 Z15a Z15b Z15c Z15d Z15e Z15f Z15g Z15h Z15i Z16 Z16a Z16b Z16c Z16d Z16e Z16f Z16g Z16h Aa1 Aa2 Aa3 Aa4 Aa5 Aa6 Aa7 Aa7a Aa7b Aa8 Aa9 Aa10 Aa11 Aa12 Aa13 Aa14 Aa15 Aa16 Aa17 Aa18 Aa19 Aa20 Aa21 Aa22 Aa23 Aa24 Aa25 Aa26 Aa27 Aa28 Aa29 Aa30 Aa31 Aa32 V11d'.split(' ').forEach(function (c, i) { GARD[c] = String.fromCodePoint(0x13000 + i); });

  /* ---------- characters ---------- */
  var C = {
    al: '\uA723', ay: '\uA725',              // \uA723 \uA725
    h1: '\u1E25', h2: '\u1E2B', h3: '\u1E96', // \u1E25 \u1E2B \u1E96
    sh: '\u0161', tj: '\u1E6F', dj: '\u1E0F', kq: '\u1E33' // \u0161 \u1E6F \u1E0F \u1E33
  };
  var CLS = {
    h: '[h' + C.h1 + C.h2 + C.h3 + ']',
    x: '[' + C.h2 + C.h3 + C.h1 + ']',
    s: '[sz' + C.sh + ']',
    S: '[' + C.sh + 's]',
    t: '[t' + C.tj + ']',
    T: '[' + C.tj + 't]',
    d: '[d' + C.dj + ']',
    D: '[' + C.dj + 'd]',
    k: '[kq' + C.kq + ']',
    A: '[' + C.al + C.ay + ']',
    j: '[jyi]'
  };
  var SEP = '[.=-]?';
  function isGlyph(ch) { var c = ch.codePointAt(0); return c >= 0x13000 && c <= 0x1342F || c >= 0x13460 && c <= 0x143FF; }
  var TRANSLIT_MARK = new RegExp('[' + C.al + C.ay + C.h1 + C.h2 + C.h3 + C.sh + C.tj + C.dj + C.kq + '\u0131\u0357\u032F]');
  var GCODE = /^(aa|nl|nu|[a-ik-z])(\d{1,3})([a-z]?)$/i;

  /* ---------- fold for ranking ---------- */
  function foldTr(s) {
    return s.normalize('NFD').toLowerCase()
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/[\uA723\uA725]/g, 'a').replace(/\u0131/g, 'j')
      .replace(/[yi]/g, 'j').replace(/z/g, 's').replace(/q/g, 'k')
      .replace(/[^a-z]/g, '');
  }
  function foldWord(s) {
    return s.toLowerCase().replace(/\u00E4/g, 'a').replace(/\u00F6/g, 'o').replace(/\u00FC/g, 'u').replace(/\u00DF/g, 'ss')
      .normalize('NFD').replace(/[\u0300-\u036F]/g, '');
  }
  // Damerau\u2013Levenshtein (optimal string alignment) on arrays or strings, with cutoff
  function dist(a, b, max) {
    var n = a.length, m = b.length;
    if (max == null) max = 99;
    if (Math.abs(n - m) > max) return max + 1;
    var prev2 = null, prev = new Array(m + 1), cur;
    for (var j = 0; j <= m; j++) prev[j] = j;
    for (var i = 1; i <= n; i++) {
      cur = new Array(m + 1); cur[0] = i; var rowMin = i;
      for (j = 1; j <= m; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        var v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
        cur[j] = v; if (v < rowMin) rowMin = v;
      }
      if (rowMin > max) return max + 1;
      prev2 = prev; prev = cur;
    }
    return prev[m];
  }

  /* ---------- transliteration \u2192 TLA pattern units ---------- */
  // returns [{p:pattern, core:bool}] ; core units are consonants subject to typo edits
  function translitUnits(q) {
    var s = q.normalize('NFC'), out = [], i = 0;
    s = s.replace(/[\s.=\-()\[\]<>{}\u2E22\u2E23\u3008\u3009]/g, '');
    var hasDia = TRANSLIT_MARK.test(s);
    while (i < s.length) {
      var two = s.substr(i, 2).toLowerCase(), ch = s[i], lc = ch.toLowerCase();
      if (!hasDia && (two === 'kh' || two === 'sh' || two === 'tj' || two === 'ch' || two === 'dj' || two === 'tch')) {
        out.push({ p: two === 'kh' ? CLS.x : two === 'sh' ? CLS.S : two === 'dj' ? CLS.D : CLS.T, core: true }); i += 2; continue;
      }
      i += 1;
      if (ch === C.al || ch === C.ay || ch === 'A') { out.push({ p: CLS.A, core: true }); continue; }
      if (ch === C.h1 || ch === 'H') { out.push({ p: CLS.h, core: true }); continue; }
      if (ch === C.h2 || ch === C.h3 || lc === 'x') { out.push({ p: CLS.x, core: true }); continue; }
      if (ch === C.sh || ch === 'S') { out.push({ p: CLS.S, core: true }); continue; }
      if (ch === C.tj || ch === 'T') { out.push({ p: CLS.T, core: true }); continue; }
      if (ch === C.dj || ch === 'D') { out.push({ p: CLS.D, core: true }); continue; }
      if (ch === C.kq) { out.push({ p: CLS.k, core: true }); continue; }
      if (ch === '\u0131' || ch === '\u0357' || ch === '\u032F' || ch === '\u0313') { continue; }
      switch (lc) {
        case 'h': out.push({ p: CLS.h, core: true }); break;
        case 's': case 'z': out.push({ p: CLS.s, core: true }); break;
        case 't': out.push({ p: CLS.t, core: true }); break;
        case 'd': out.push({ p: CLS.d, core: true }); break;
        case 'k': case 'q': case 'c': out.push({ p: CLS.k, core: true }); break;
        case 'j': out.push({ p: CLS.j, core: true }); break;
        case 'y': out.push({ p: hasDia ? CLS.j : CLS.j + '?', core: hasDia }); break;
        case 'i': out.push({ p: hasDia ? CLS.j : CLS.j + '?', core: hasDia }); break;
        case 'a': out.push({ p: hasDia ? CLS.A : '[' + C.al + C.ay + 'j]?', core: hasDia }); break;
        case 'e': case 'o': if (hasDia) out.push({ p: lc, core: true }); break; // epenthetic vowels dropped
        case 'u': out.push({ p: 'w?', core: false }); break;
        default: if (/[a-z]/.test(lc)) out.push({ p: lc, core: true });
      }
    }
    return out;
  }
  function joinUnits(units) { return units.map(function (u) { return u.p; }).join(SEP); }
  function translitVariants(q) {
    var u = translitUnits(q), v = [];
    if (!u.length) return v;
    var core = [];
    u.forEach(function (x, i) { if (x.core) core.push(i); });
    v.push({ pat: '^' + joinUnits(u) + '$', kind: 'exact', pages: 3 });
    v.push({ pat: '^' + joinUnits(u) + '\\w', kind: 'longer', pages: 1 });
    if (core.length >= 2) {
      core.forEach(function (i) { // one wrong letter
        var c = u.slice(); c[i] = { p: '_', core: true };
        v.push({ pat: '^' + joinUnits(c) + '$', kind: 'typo', pages: 1 });
      });
      core.forEach(function (i) { // one extra letter typed
        var c = u.slice(); c.splice(i, 1);
        if (core.length >= 3) v.push({ pat: '^' + joinUnits(c) + '$', kind: 'typo', pages: 1 });
      });
      for (var k = 0; k + 1 < core.length; k++) { // swapped letters
        var c2 = u.slice(), a = core[k], b = core[k + 1];
        var t = c2[a]; c2[a] = c2[b]; c2[b] = t;
        v.push({ pat: '^' + joinUnits(c2) + '$', kind: 'typo', pages: 1 });
      }
      for (var m = 1; m < u.length; m++) { // one missing letter (inside the word; ends are covered by 'longer'/'inside')
        var c3 = u.slice(); c3.splice(m, 0, { p: '_', core: true });
        v.push({ pat: '^' + joinUnits(c3) + '$', kind: 'typo', pages: 1 });
      }
    }
    v.push({ pat: '*' + joinUnits(u) + '*', kind: 'inside', pages: 1 });
    return dedupe(v);
  }
  function dedupe(v) { var seen = {}; return v.filter(function (x) { var k = x.pat; if (seen[k]) return false; seen[k] = 1; return true; }); }

  /* ---------- hieroglyphs / Gardiner ---------- */
  function parseGlyphs(q) {
    var out = [];
    var tokens = q.split(/[\s,;:+\-*_.\/]+/).filter(Boolean);
    tokens.forEach(function (t) {
      var m = t.match(GCODE);
      if (m) {
        var code = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase() + parseInt(m[2], 10) + m[3].toLowerCase();
        if (GARD[code]) { out.push(GARD[code]); return; }
      }
      Array.from(t).forEach(function (ch) { if (isGlyph(ch)) out.push(ch); });
    });
    return out;
  }
  function looksLikeGlyphQuery(q) {
    if (Array.from(q).some(isGlyph)) return true;
    var t = q.split(/[\s,;:+\-*_.\/]+/).filter(Boolean);
    return t.length > 0 && t.every(function (x) { return GCODE.test(x); });
  }
  function glyphVariants(g) {
    var v = [], s = g.join('');
    if (!g.length) return v;
    v.push({ pat: s, kind: 'exact', pages: 3 });
    v.push({ pat: '*' + s + '*', kind: 'inside', pages: 2 });
    if (g.length >= 2) {
      v.push({ pat: g.join('*'), kind: 'gaps', pages: 1 });
      g.forEach(function (_, i) { var c = g.slice(); c[i] = '_'; v.push({ pat: c.join(''), kind: 'typo', pages: 1 }); });
      g.forEach(function (_, i) { var c = g.slice(); c.splice(i, 1); v.push({ pat: c.join(''), kind: 'typo', pages: 1 }); });
      for (var k = 0; k + 1 < g.length; k++) { var c2 = g.slice(); var t = c2[k]; c2[k] = c2[k + 1]; c2[k + 1] = t; v.push({ pat: c2.join(''), kind: 'typo', pages: 1 }); }
    }
    return dedupe(v);
  }

  /* ---------- vocabulary for translation typos ---------- */
  var EN = null, enLoading = null;
  var learned = {};
  try { learned = JSON.parse(localStorage.getItem('tlafz.vocab') || '{}'); } catch (e) { learned = {}; }
  function saveLearned() {
    try {
      var keys = Object.keys(learned);
      if (keys.length > 40000) { keys.sort(function (a, b) { return learned[a] - learned[b]; }).slice(0, keys.length - 40000).forEach(function (k) { delete learned[k]; }); }
      localStorage.setItem('tlafz.vocab', JSON.stringify(learned));
    } catch (e) { }
  }
  function learnFrom(text) {
    (text.toLowerCase().match(/[a-z\u00E4\u00F6\u00FC\u00DF\u00E9\u00E8\u00E0\u00E7]{3,}/g) || []).forEach(function (w) { learned[w] = (learned[w] || 0) + 1; });
  }
  function loadEN() {
    if (EN) return Promise.resolve(EN);
    if (enLoading) return enLoading;
    enLoading = (BASE ? fetch(BASE + 'tla-fuzzy-en.txt').then(function (r) { return r.ok ? r.text() : ''; }) : Promise.resolve(''))
      .catch(function () { return ''; })
      .then(function (t) {
        EN = { set: new Set(), byLen: {} };
        if (/^\s*</.test(t)) t = '';
        t.split('\n').forEach(function (w) { if (!w) return; EN.set.add(w); (EN.byLen[w.length] = EN.byLen[w.length] || []).push(w); });
        return EN;
      });
    return enLoading;
  }
  function knownWord(w) { return (EN && EN.set.has(w)) || learned[w] > 0; }
  function corrections(w, limit) {
    var fw = foldWord(w), maxD = w.length <= 4 ? 1 : 2, cands = [];
    var pool = Object.keys(learned);
    if (EN) for (var L = w.length - maxD; L <= w.length + maxD; L++) if (EN.byLen[L]) pool = pool.concat(EN.byLen[L]);
    var seen = {};
    pool.forEach(function (c) {
      if (seen[c] || c === w || Math.abs(c.length - w.length) > maxD) return; seen[c] = 1;
      var d = dist(fw, foldWord(c), maxD);
      if (d <= maxD) cands.push({ w: c, d: d + (foldWord(c) === fw ? -0.5 : 0), tla: learned[c] || 0 });
    });
    cands.sort(function (a, b) { return a.d - b.d || b.tla - a.tla || a.w.length - b.w.length; });
    return cands.slice(0, limit || 3);
  }
  function translationVariants(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var v = [{ pat: q.trim(), lang: 'en', kind: 'exact', pages: 3 }, { pat: q.trim(), lang: 'de', kind: 'exact', pages: 2 }];
    var fixes = [];
    words.forEach(function (w, i) {
      var close = corrections(w, knownWord(w) ? 2 : 3);
      if (knownWord(w)) close = close.filter(function (c) { return c.d < 1 || (learned[c.w] && w.length > 4 && c.d <= 1); });
      close.forEach(function (c) { fixes.push({ i: i, w: c.w }); });
      if (/ae|oe|ue/.test(w)) { var um = w.replace(/ae/g, '\u00E4').replace(/oe/g, '\u00F6').replace(/ue/g, '\u00FC'); fixes.unshift({ i: i, w: um, de: true }); }
    });
    fixes.slice(0, 6).forEach(function (f, n) {
      var ws = words.slice(); ws[f.i] = f.w; var p = ws.join(' ');
      var isEn = !f.de && EN && EN.set.has(f.w);
      v.push({ pat: p, lang: isEn ? 'en' : 'de', kind: 'spelled', note: p, pages: n === 0 ? 3 : 1 });
      if (!isEn || learned[f.w]) v.push({ pat: p, lang: isEn ? 'de' : 'en', kind: 'spelled', note: p, pages: n === 0 ? 3 : 1 });
    });
    return v.filter(function (x, i, a) { return a.findIndex(function (y) { return y.pat === x.pat && y.lang === x.lang; }) === i; });
  }

  /* ---------- fetching ---------- */
  var cache = {};
  try { cache = JSON.parse(sessionStorage.getItem('tlafz.cache') || '{}'); } catch (e) { cache = {}; }
  function saveCache() { try { var k = Object.keys(cache); if (k.length > 300) k.slice(0, k.length - 300).forEach(function (x) { delete cache[x]; }); sessionStorage.setItem('tlafz.cache', JSON.stringify(cache)); } catch (e) { } }
  var queue = [], active = 0, MAXC = 2, verificationLost = false;
  function limited(fn) {
    return new Promise(function (res, rej) {
      queue.push(function () { active++; fn().then(res, rej).finally(function () { active--; setTimeout(next, 120); }); });
      next();
    });
  }
  function next() { while (active < MAXC && queue.length) queue.shift()(); }

  function buildUrl(field, pat, lang, page) {
    var p = new URLSearchParams();
    p.append('script', 'hieratic');
    if (state.demotic) p.append('script', 'demotic');
    p.append('_script', 'on');
    p.append('transcription.text', field === 'tr' ? pat : '');
    p.append('transcription.enc', 'unicode');
    p.append('glyphs.text', field === 'gl' ? pat : '');
    p.append('glyphs.enc', 'unicode');
    p.append('wordClass.type', state.names ? '' : 'excl_names');
    p.append('translation.text', field === 'tl' ? pat : '');
    p.append('translation.lang', lang || 'en');
    p.append('revisionState', 'all-but-inactive');
    p.append('sort', 'sortKey_asc');
    if (page > 1) p.append('page', page);
    return '/search/lemma?' + p.toString();
  }
  function txt(el) { return el ? el.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function parsePage(html) {
    var d = new DOMParser().parseFromString(html, 'text/html');
    if (!d.querySelector('.result-list') && !/Lemma Search Results|Search parameter/i.test(d.body ? d.body.textContent : '')) return null;
    var total = 0, m = (d.body.textContent.match(/of\s+([\d.,\s]+)\s+lemma/i) || [])[1];
    if (m) total = parseInt(m.replace(/[^\d]/g, ''), 10) || 0;
    var items = Array.prototype.map.call(d.querySelectorAll('.result-list-item'), function (it) {
      var id = (it.id || '').replace(/^lemma-/, '');
      var sent = (txt(it.querySelector('.lemma-attestations-info')).match(/(\d[\d.,]*)\s*sent/) || [])[1];
      var r = {
        id: id,
        tr: txt(it.querySelector('.transcription')),
        gl: txt(it.querySelector('.unicode-hieroglyphs')),
        wc: txt(it.querySelector('.wordClass')),
        en: txt(it.querySelector('.translation-en')),
        de: txt(it.querySelector('.translation-de')),
        dates: txt(it.querySelector('.attested-timespan')),
        sent: sent ? parseInt(sent.replace(/[^\d]/g, ''), 10) : 0
      };
      learnFrom(r.en + ' ' + r.de);
      return r;
    }).filter(function (r) { return r.id; });
    return { total: total, items: items };
  }
  function fetchPage(field, pat, lang, page) {
    var url = buildUrl(field, pat, lang, page);
    if (cache[url]) return Promise.resolve(cache[url]);
    return limited(function () {
      return fetch(url, { credentials: 'same-origin' }).then(function (r) { return r.text(); }).then(function (h) {
        var res = parsePage(h);
        if (!res) { verificationLost = true; return { total: 0, items: [], lost: true }; }
        cache[url] = res; saveCache(); return res;
      });
    });
  }

  /* ---------- search orchestration ---------- */
  var runId = 0;
  function classify(q) {
    if (state.mode === 'tr') return { tr: true };
    if (state.mode === 'tl') return { tl: true };
    if (state.mode === 'gl') return { gl: true };
    if (looksLikeGlyphQuery(q)) return { gl: true };
    if (TRANSLIT_MARK.test(q) || /[.=]|^[^aeiouyAEIOUY\s]+$/.test(q.trim())) return { tr: true };
    if (/\s/.test(q.trim())) return { tl: true, tr: q.trim().split(/\s+/).length <= 2 };
    return { tr: true, tl: true };
  }

  function search(q) {
    q = q.trim(); if (!q) return;
    root.classList.remove('min');
    var my = ++runId; verificationLost = false;
    var cls = classify(q);
    var results = {}, jobs = [], budget = 0;
    var qGlyphs = cls.gl ? parseGlyphs(q) : [];
    var hasDia = TRANSLIT_MARK.test(q);
    var qSkel = hasDia ? foldTr(q) : foldTr(q.toLowerCase().replace(/tch|tj|ch/g, 't').replace(/dj/g, 'd').replace(/kh/g, 'h').replace(/sh/g, 's').replace(/[eo]/g, '').replace(/u/g, 'w'));
    var qSkelNoA = qSkel.replace(/a/g, '');
    // each query word with its German spelling variant (schoen -> schon, as umlauts fold away)
    var qWords = q.toLowerCase().split(/\s+/).filter(Boolean).map(function (w) {
      var a = foldWord(w), b = a.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
      return a === b ? [a] : [a, b];
    });
    setStatus('Searching\u2026');
    renderResults([], q);

    function score(r, via) {
      var s = 0, why = [];
      if (via.field === 'tr' || cls.tr) {
        var sk = foldTr(r.tr);
        var dt = Math.min(dist(qSkel, sk, 6), qSkelNoA !== qSkel ? dist(qSkelNoA, sk, 6) : 99);
        r.dTr = Math.min(r.dTr == null ? 99 : r.dTr, dt);
      }
      if (cls.tl) {
        var tw = (r.en + ' ' + r.de).toLowerCase().split(/[^a-z\u00E4\u00F6\u00FC\u00DF\u00E9\u00E8\u00E0\u00E7]+/).filter(Boolean).map(foldWord);
        var tot = 0;
        qWords.forEach(function (vs) { var best = 9; vs.forEach(function (w) { tw.forEach(function (x) { var d = x === w ? 0 : (x.indexOf(w) === 0 ? 0.4 : dist(w, x, 3)); if (d < best) best = d; }); }); tot += best; });
        r.dTl = qWords.length ? tot / qWords.length : 9;
      }
      if (cls.gl && qGlyphs.length) {
        var rg = Array.from(r.gl).filter(isGlyph);
        r.dGl = rg.length ? dist(qGlyphs, rg, 6) : 9;
        var joined = rg.join(''), qj = qGlyphs.join('');
        if (rg.length && joined.indexOf(qj) >= 0) r.dGl = Math.min(r.dGl, (rg.length - qGlyphs.length) * 0.35);
      }
      var best = Math.min(r.dTr == null ? 99 : r.dTr, r.dTl == null ? 99 : r.dTl * 1.1, r.dGl == null ? 99 : r.dGl);
      r.score = best * 10 - Math.log(1 + r.sent) * 0.8 + (via.kind === 'exact' ? -2 : via.kind === 'longer' || via.kind === 'inside' ? 1 : 0);
      return r;
    }
    function add(items, via) {
      items.forEach(function (it) {
        var r = results[it.id];
        if (!r) { r = results[it.id] = Object.assign({}, it, { via: [] }); }
        if (!r.via.some(function (v) { return v.kind === via.kind && v.note === via.note; })) r.via.push(via);
        score(r, via);
        if (via.kind === 'exact' || r.bestKind == null || rankKind(via.kind) < rankKind(r.bestKind)) { r.bestKind = via.kind; r.bestNote = via.note; }
      });
    }
    function run(field, v) {
      var pages = v.pages || 1, p = 1;
      function step() {
        if (my !== runId) return Promise.resolve();
        budget++;
        return fetchPage(field, v.pat, v.lang, p).then(function (res) {
          if (my !== runId) return;
          add(res.items, { field: field, kind: v.kind, note: v.note, pat: v.pat, lang: v.lang });
          if (res.lost) return;
          renderResults(sorted(), q);
          if (p < pages && p * 10 < res.total && budget < 40) { p++; return step(); }
        });
      }
      return step();
    }
    function wordish() {
      if (!cls.tl || !cls.tr) return false;
      var raw = q.toLowerCase().split(/\s+/).filter(Boolean);
      return raw.every(function (w) {
        var um = w.replace(/ae/g, '\u00E4').replace(/oe/g, '\u00F6').replace(/ue/g, '\u00FC');
        return (EN && EN.set.has(w)) || (um !== w && learned[um] > 0) || /[\u00E4\u00F6\u00FC\u00DF]/.test(w) && learned[w] > 0;
      });
    }
    function sorted() {
      var wq = wordish();
      return Object.keys(results).map(function (k) {
        var r = results[k];
        r.rank = r.score;
        if (wq && r.dTl != null && r.dTl <= 0.5) r.rank -= 30; // the query is a real word: its translation hits come first
        return r;
      }).sort(function (a, b) { return a.rank - b.rank; });
    }

    var pre = cls.tl ? loadEN() : Promise.resolve();
    pre.then(function () {
      if (my !== runId) return;
      var plan = [];
      if (cls.gl) glyphVariants(qGlyphs).forEach(function (v) { plan.push(['gl', v]); });
      if (cls.tr) translitVariants(q).forEach(function (v) { plan.push(['tr', v]); });
      if (cls.tl) translationVariants(q).forEach(function (v) { plan.push(['tl', v]); });
      // exact queries first, then the rest
      plan.sort(function (a, b) { return rankKind(a[1].kind) - rankKind(b[1].kind); });
      var firstWave = plan.filter(function (x) { return x[1].kind === 'exact' || x[1].kind === 'spelled'; });
      var rest = plan.filter(function (x) { return firstWave.indexOf(x) < 0; });
      return Promise.all(firstWave.map(function (x) { return run(x[0], x[1]); })).then(function () {
        if (my !== runId) return;
        return Promise.all(rest.map(function (x) { return run(x[0], x[1]); }));
      });
    }).then(function () {
      if (my !== runId) return;
      saveLearned();
      var list = sorted();
      renderResults(list, q);
      if (verificationLost) setStatus('The TLA verification has expired. Reload this page, click "Verify", then search again.', true);
      else setStatus(list.length + ' lemmas \u00B7 ' + budget + ' TLA queries');
    }).catch(function (e) { setStatus('Error: ' + e.message, true); });
  }
  function rankKind(k) { return { exact: 0, spelled: 1, longer: 2, gaps: 3, typo: 4, inside: 5 }[k] != null ? { exact: 0, spelled: 1, longer: 2, gaps: 3, typo: 4, inside: 5 }[k] : 9; }

  /* ---------- UI ---------- */
  var state = { mode: 'all', demotic: false, names: true, open: true };
  try { Object.assign(state, JSON.parse(localStorage.getItem('tlafz.state') || '{}')); } catch (e) { }
  function saveState() { try { localStorage.setItem('tlafz.state', JSON.stringify({ mode: state.mode, demotic: state.demotic, names: state.names })); } catch (e) { } }

  var css = '' +
    '#tlafz{--bg:#fbf7ef;--fg:#2b2118;--mut:#7a6a58;--line:#e3d8c6;--acc:#9b2c1f;--chip:#f1e8d9;--hi:#fff3d6;' +
    'position:fixed;top:12px;right:12px;bottom:12px;width:min(560px,calc(100vw - 24px));z-index:2147483000;display:flex;flex-direction:column;' +
    'background:var(--bg);color:var(--fg);border:1px solid var(--line);border-radius:12px;box-shadow:0 12px 40px rgba(40,25,10,.25);' +
    'font:14px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden}' +
    '@media (prefers-color-scheme:dark){#tlafz{--bg:#1f1a15;--fg:#efe6d8;--mut:#a8988a;--line:#3b3229;--acc:#e0806f;--chip:#2c251e;--hi:#3a2f1c}}' +
    '#tlafz.min{bottom:auto;width:min(420px,calc(100vw - 24px))}#tlafz.min .tlafz-body,#tlafz.min .tlafz-opts{display:none}' +
    '#tlafz *{box-sizing:border-box}' +
    '#tlafz .tlafz-head{display:flex;gap:8px;align-items:center;padding:10px 10px 6px}' +
    '#tlafz .tlafz-title{font-weight:600;font-size:13px;color:var(--acc);white-space:nowrap}' +
    '#tlafz input[type=search]{flex:1;min-width:0;font:inherit;font-size:16px;padding:8px 10px;border:1px solid var(--line);border-radius:8px;background:#fff;color:#222}' +
    '#tlafz button{font:inherit;cursor:pointer;border:1px solid var(--line);background:var(--chip);color:var(--fg);border-radius:8px;padding:6px 10px}' +
    '#tlafz button.on{background:var(--acc);color:#fff;border-color:var(--acc)}' +
    '#tlafz .tlafz-opts{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:0 10px 8px;font-size:12px}' +
    '#tlafz .tlafz-opts button{padding:3px 9px;font-size:12px;border-radius:999px}' +
    '#tlafz .tlafz-opts label{display:flex;gap:4px;align-items:center;color:var(--mut);margin-left:6px}' +
    '#tlafz .tlafz-status{padding:4px 12px;font-size:12px;color:var(--mut);border-top:1px solid var(--line)}' +
    '#tlafz .tlafz-status.err{color:var(--acc);font-weight:600}' +
    '#tlafz .tlafz-body{flex:1;display:flex;flex-direction:column;min-height:0}' +
    '#tlafz .tlafz-list{flex:1;overflow:auto;padding:4px 6px 10px}' +
    '#tlafz .tlafz-item{display:block;padding:8px 8px;border-radius:8px;text-decoration:none;color:inherit;border-bottom:1px solid var(--line);cursor:pointer}' +
    '#tlafz .tlafz-item:hover,#tlafz .tlafz-item.sel{background:var(--hi)}' +
    '#tlafz .tlafz-l1{display:flex;gap:10px;align-items:baseline;flex-wrap:wrap}' +
    '#tlafz .tlafz-tr{font-size:17px;font-weight:600}' +
    '#tlafz .tlafz-gl{font-size:22px;line-height:1}' +
    '#tlafz .tlafz-meta{margin-left:auto;font-size:11px;color:var(--mut);white-space:nowrap}' +
    '#tlafz .tlafz-tl{font-size:13px;margin-top:2px}' +
    '#tlafz .tlafz-tl b{font-weight:400;color:var(--mut);font-size:10px;text-transform:uppercase;margin-right:4px}' +
    '#tlafz .tlafz-tag{display:inline-block;font-size:10px;padding:1px 6px;border-radius:999px;background:var(--chip);color:var(--mut);margin-right:4px}' +
    '#tlafz .tlafz-tag.exact{background:#dfeedd;color:#2d5a27}#tlafz .tlafz-tag.typo,#tlafz .tlafz-tag.spelled{background:#fbe6c8;color:#8a5200}' +
    '#tlafz .tlafz-prev{height:45%;border-top:1px solid var(--line);display:none;flex-direction:column}' +
    '#tlafz .tlafz-prev.show{display:flex}' +
    '#tlafz .tlafz-prev .bar{display:flex;gap:6px;padding:4px 8px;font-size:12px;align-items:center}' +
    '#tlafz .tlafz-prev iframe{flex:1;border:0;width:100%;background:#fff}' +
    '#tlafz .tlafz-help{padding:10px 14px;color:var(--mut);font-size:13px}' +
    '#tlafz .tlafz-help code{background:var(--chip);padding:0 4px;border-radius:4px}' +
    '#tlafz .tlafz-foot{font-size:10px;color:var(--mut);padding:4px 12px;border-top:1px solid var(--line)}';

  var root = document.createElement('div');
  root.id = 'tlafz';
  root.innerHTML =
    '<style>' + css + '</style>' +
    '<div class="tlafz-head"><span class="tlafz-title">TLA fuzzy</span>' +
    '<input type="search" placeholder="nefer \u00B7 \u1E25r \u00B7 good \u00B7 F35 I9 D21 \u00B7 \uD80C\uDD24" autocomplete="off" spellcheck="false">' +
    '<button data-act="go" title="Search (Enter)">Search</button>' +
    '<button data-act="min" title="Minimise">\u2013</button><button data-act="close" title="Close (Esc)">\u00D7</button></div>' +
    '<div class="tlafz-opts">' +
    '<button data-mode="all">All</button><button data-mode="tr">Transliteration</button><button data-mode="tl">Translation</button><button data-mode="gl">Hieroglyphs</button>' +
    '<label><input type="checkbox" data-opt="names"> names</label><label><input type="checkbox" data-opt="demotic"> demotic</label></div>' +
    '<div class="tlafz-body"><div class="tlafz-status"></div><div class="tlafz-list"></div>' +
    '<div class="tlafz-prev"><div class="bar"><span class="t"></span><span style="flex:1"></span><button data-act="open">Open page</button><button data-act="hideprev">Hide</button></div><iframe></iframe></div>' +
    '<div class="tlafz-foot">Results from the Thesaurus Linguae Aegyptiae (BBAW), CC BY-SA 4.0 \u00B7 Ctrl+K to focus \u00B7 \u2191\u2193 Enter to preview</div></div>';
  document.body.appendChild(root);

  var input = root.querySelector('input[type=search]');
  var listEl = root.querySelector('.tlafz-list');
  var statusEl = root.querySelector('.tlafz-status');
  var prev = root.querySelector('.tlafz-prev');
  var iframe = prev.querySelector('iframe');
  var current = [], selIdx = -1;

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function setStatus(s, err) { statusEl.textContent = s; statusEl.classList.toggle('err', !!err); }
  function syncOpts() {
    root.querySelectorAll('[data-mode]').forEach(function (b) { b.classList.toggle('on', b.dataset.mode === state.mode); });
    root.querySelector('[data-opt=names]').checked = state.names;
    root.querySelector('[data-opt=demotic]').checked = state.demotic;
  }
  var KIND_LABEL = { exact: 'match', longer: 'longer word', typo: 'typo / near', spelled: 'spelling fixed', gaps: 'with gaps', inside: 'contains' };
  function renderResults(list, q) {
    current = list.slice(0, 150); selIdx = -1;
    if (!list.length) {
      listEl.innerHTML = q ? '' : helpHtml();
      return;
    }
    listEl.innerHTML = current.map(function (r, i) {
      var tag = '<span class="tlafz-tag ' + r.bestKind + '">' + esc(KIND_LABEL[r.bestKind] || r.bestKind) + (r.bestNote ? ': ' + esc(r.bestNote) : '') + '</span>';
      return '<a class="tlafz-item" data-i="' + i + '" href="/lemma/' + esc(r.id) + '">' +
        '<div class="tlafz-l1"><span class="tlafz-tr bbaw-schoell">' + esc(r.tr) + '</span>' +
        (r.gl ? '<span class="tlafz-gl unicode-hieroglyphs">' + esc(r.gl) + '</span>' : '') +
        '<span class="tlafz-meta">' + esc(r.wc) + (r.sent ? ' \u00B7 ' + r.sent + ' sent.' : '') + '</span></div>' +
        (r.en ? '<div class="tlafz-tl"><b>en</b>' + esc(r.en) + '</div>' : '') +
        (r.de ? '<div class="tlafz-tl"><b>de</b>' + esc(r.de) + '</div>' : '') +
        '<div>' + tag + '<span class="tlafz-tag">ID ' + esc(r.id) + '</span>' + (r.dates ? '<span class="tlafz-tag">' + esc(r.dates) + '</span>' : '') + '</div></a>';
    }).join('');
  }
  function helpHtml() {
    return '<div class="tlafz-help"><p><b>Type anything, press Enter.</b> Typos and near spellings are matched in every mode.</p>' +
      '<p>Transliteration: plain letters work: <code>nefer</code>, <code>hr</code>, <code>djehuty</code>, <code>sth</code>. ' +
      'h/s/t/d/k cover \u1E25 \u1E2B \u1E96 / \u0161 z / \u1E6F / \u1E0F / q, and a covers \uA723 \uA725. Vowels like e/o are ignored.</p>' +
      '<p>Translation: English or German, misspellings allowed: <code>beutiful</code>, <code>schoen</code>.</p>' +
      '<p>Hieroglyphs: paste signs or type Gardiner codes: <code>F35 I9 D21</code>, <code>G5</code>. Results with one sign different, missing or extra also show up.</p></div>';
  }
  function select(i, preview) {
    var items = listEl.querySelectorAll('.tlafz-item');
    if (!items.length) return;
    selIdx = Math.max(0, Math.min(items.length - 1, i));
    items.forEach(function (el, k) { el.classList.toggle('sel', k === selIdx); });
    items[selIdx].scrollIntoView({ block: 'nearest' });
    if (preview) showPreview(current[selIdx]);
  }
  function showPreview(r) {
    prev.classList.add('show');
    prev.querySelector('.t').textContent = r.tr + ' (ID ' + r.id + ')';
    iframe.src = '/lemma/' + encodeURIComponent(r.id);
    prev.dataset.href = '/lemma/' + r.id;
  }

  root.addEventListener('click', function (e) {
    var t = e.target.closest('button,[data-i],input[type=checkbox]');
    if (!t) return;
    if (t.matches('[data-i]')) {
      if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return; // normal link behaviour
      e.preventDefault(); select(+t.dataset.i, true); return;
    }
    if (t.dataset.mode) { state.mode = t.dataset.mode; saveState(); syncOpts(); if (input.value.trim()) search(input.value); return; }
    if (t.dataset.opt) { state[t.dataset.opt] = t.checked; saveState(); if (input.value.trim()) search(input.value); return; }
    switch (t.dataset.act) {
      case 'go': search(input.value); break;
      case 'min': root.classList.toggle('min'); if (!root.classList.contains('min')) input.focus(); break;
      case 'close': api.toggle(false); break;
      case 'open': location.href = prev.dataset.href; break;
      case 'hideprev': prev.classList.remove('show'); iframe.src = 'about:blank'; break;
    }
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); if (selIdx >= 0 && input.dataset.nav === '1') select(selIdx, true); else search(input.value); input.dataset.nav = '0'; }
    else if (e.key === 'ArrowDown') { e.preventDefault(); input.dataset.nav = '1'; select(selIdx + 1, false); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); input.dataset.nav = '1'; select(selIdx - 1, false); }
    else if (e.key === 'Escape') { api.toggle(false); }
    else input.dataset.nav = '0';
    try { sessionStorage.setItem('tlafz.q', input.value); } catch (er) { }
  });
  input.addEventListener('input', function () { try { sessionStorage.setItem('tlafz.q', input.value); } catch (er) { } });
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); api.toggle(true); input.focus(); input.select(); }
  }, true);

  var api = window.__tlaFuzzy = {
    toggle: function (show) { root.style.display = show ? '' : 'none'; if (show) { root.classList.remove('min'); input.focus(); } },
    search: function (q) { input.value = q; search(q); },
    _internals: { translitVariants: translitVariants, glyphVariants: glyphVariants, parseGlyphs: parseGlyphs, translationVariants: translationVariants, corrections: corrections, loadEN: loadEN, foldTr: foldTr, classify: classify }
  };

  syncOpts();
  renderResults([], '');
  setStatus('Ready. Searches the TLA lemma lists with typo tolerance.');
  var AUTO = !!window.__tlaFuzzyAuto || /[?&]auto=1/.test(SCRIPT_SRC);
  var lastQ = ''; try { lastQ = sessionStorage.getItem('tlafz.q') || ''; } catch (e) { }
  if (AUTO) { root.classList.add('min'); if (lastQ) input.value = lastQ; }
  else { if (lastQ) { input.value = lastQ; search(lastQ); } input.focus(); }
  if (BASE) loadEN();
})();
