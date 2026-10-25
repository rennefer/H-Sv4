// ==UserScript==
// @name         TLA Fuzzy Search
// @namespace    https://rennefer.github.io/H-Sv4/
// @version      1.0
// @description  Typo-tolerant search bar on the Thesaurus Linguae Aegyptiae (transliteration, translation, hieroglyphs / Gardiner codes)
// @match        https://thesaurus-linguae-aegyptiae.de/*
// @noframes
// @grant        none
// @run-at       document-idle
// ==/UserScript==
(function () {
  'use strict';
  // Not on the site's own "Verify" screen: the bar appears once you are through.
  var head = (document.body && document.body.innerText || '').slice(0, 3000);
  if (/Verification Required|Verifikation erforderlich/i.test(head) && !document.querySelector('a[href*="/lemma/"], form#lemma-search')) return;
  var s = document.createElement('script');
  s.src = 'https://rennefer.github.io/H-Sv4/tla-fuzzy.js?auto=1&v=' + Math.floor(Date.now() / 3600000);
  document.body.appendChild(s);
})();
