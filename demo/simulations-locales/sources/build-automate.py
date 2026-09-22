"""Reconstruit le HTML autonome de l'automate avec Python standard."""
from pathlib import Path
import re

source = Path(__file__).resolve().parent
folder = source.parent
template = (folder / "cycle-3d.html").read_text()
head = template.split("</head>", 1)[0] + "</head>"
head = re.sub(r"<title>.*?</title>", "<title>Automate chromatique 3D — règles modifiables</title>", head)
header = '''<body><header><nav><a href="ondes-3d.html">Surfaces ondulantes</a><a href="cycle-3d.html">Cycle 3D précédent</a><a href="index.html">Version 2D</a><a href="REGLES-AUTOMATE.md">Guide des règles</a></nav><h1>Assemblages locaux — émergence et devenir</h1><p>Points, cordes et boucles peuvent former une configuration X puis activer une attraction. Comparez les assemblages, leurs ruptures et les composants émis ; suivez les constituants et les durées. Automate exploratoire 3D, version 4.</p></header>'''
document = head + header + (source / "automate.html").read_text()
for name in ("structures-engine.js", "automate-app.js"):
    document += "\n<script>\n" + (source / name).read_text() + "\n</script>"
document += "\n</body>\n</html>\n"
(folder / "automate-3d.html").write_text(document)
for name in ("index.html", "cycle-3d.html"):
    path = folder / name
    text = path.read_text()
    if 'href="automate-3d.html"' not in text:
        text = text.replace("<header><nav>", '<header><nav><a href="automate-3d.html">Automate à règles locales</a>', 1)
        path.write_text(text)
print(folder / "automate-3d.html")
