"""Construit une variante locale autonome, sans dépendance réseau."""
from pathlib import Path
import re
source = Path(__file__).resolve().parent
folder = source.parent
head = (folder / 'cycle-3d.html').read_text().split('</head>', 1)[0]
head = re.sub(r'<title>.*?</title>', '<title>Surfaces ondulantes — fermeture et attraction</title>', head)
header = '''</head><body><header><nav><a href="automate-3d.html">Assemblages de cordes</a><a href="ONDES.md">Guide des ondes</a></nav><h1>Surfaces ondulantes</h1><p>Des surfaces colorées se croisent. Une fermeture peut faire naître un domaine central, puis activer déformation et capture locale 50/50. Son horloge commence à sa naissance. Modèle exploratoire, unités arbitraires.</p></header>'''
text = head + header + (source / 'waves.html').read_text()
for name in ('waves-geometry.js', 'waves-engine.js', 'waves-illustration.js', 'waves-study.js', 'waves-app.js'):
    text += '\n<script>\n' + (source / name).read_text() + '\n</script>'
(folder / 'ondes-3d.html').write_text(text + '\n</body></html>\n')
print(folder / 'ondes-3d.html')
