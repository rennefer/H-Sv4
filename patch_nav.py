#!/usr/bin/env python3
"""Adds the Shipwrecked Sailor to the sidebar of every page and a card to the home page.
Run from inside hs-part-app. Keeps a copy of every changed page in old-pages-20261029/."""
import os, re, sys, base64, shutil
here = sys.argv[1] if len(sys.argv) > 1 else '.'
os.chdir(here)
bk = 'old-pages-20261029'
os.makedirs(bk, exist_ok=True)
LINK = '<a class="sb-link" href="shipwrecked-sailor.html"><span class="g">𓊛</span>Shipwrecked Sailor</a>'
changed = []
for fn in sorted(os.listdir('.')):
    if not fn.endswith('.html') or fn.startswith('old-') or fn == 'shipwrecked-sailor.html':
        continue
    s = open(fn, encoding='utf-8').read()
    if 'href="shipwrecked-sailor.html"' in s:
        continue
    m = re.search(r'\n([ \t]*)<a class="sb-link( active)?" href="two-brothers.html">[^\n]*?Tale of Two Brothers</a>', s)
    if not m:
        continue
    t = s[:m.end()] + '\n' + m.group(1) + LINK + s[m.end():]
    if fn == 'index.html':
        thumb = 'data:image/jpeg;base64,' + base64.b64encode(open('ss-landing-thumb.jpg', 'rb').read()).decode()
        card = re.search(r'\n([ \t]*)<a class="landing-card" href="two-brothers.html">.*?</a>', t, flags=re.S)
        if card:
            ind = card.group(1)
            new = (f'\n{ind}<a class="landing-card" href="shipwrecked-sailor.html">\n'
                   f'{ind}  <div class="lc-body"><div class="glyph">𓊛</div>\n'
                   f'{ind}  <h2>Shipwrecked Sailor</h2></div>\n'
                   f'{ind}  <div class="landing-thumb"><img src="{thumb}" alt="Manuscript photo crop from the Shipwrecked Sailor"></div>\n'
                   f'{ind}</a>')
            t = t[:card.end()] + new + t[card.end():]
    shutil.copy2(fn, os.path.join(bk, fn))
    open(fn, 'w', encoding='utf-8').write(t)
    changed.append(fn)
print('changed:', ', '.join(changed))
