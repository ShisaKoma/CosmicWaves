"""Paroi scalaire et référence thermique idéale ; aucun couplage inventé.

Unités naturelles : v=v_reduit E0, T=temperature_reduite E0, E0 à fixer.
Le bain est sans masses ni potentiels chimiques. Le profil de paroi est
statique, dans un potentiel phénoménologique indépendant de ce bain.
"""
import csv
import hashlib
import html
import json
import math
from fractions import Fraction
from pathlib import Path

HERE = Path(__file__).resolve().parent
FOLDER = HERE.parent / 'parois-plasma'
CONFIG = FOLDER / 'configuration.json'
ZETA3 = 1.2020569031595943
REGIMES = ('sm_symetrique_ideal', 'qcd_uds_ideal')


def positive(name, value):
    if isinstance(value, bool) or not isinstance(value, (float, int)):
        raise ValueError(f'{name} doit être un nombre')
    if not math.isfinite(value) or value <= 0:
        raise ValueError(f'{name} doit être positif et fini')
    return value


def catalogue():
    """États chiraux du SM ; convention Q/e = T3 + Y, pas T3 + Y/2.

    Les représentations de couleur sont suivies, sans leur attribuer une
    charge scalaire et sans résoudre les contraintes de jauge locales.
    """
    rows = []

    def pair(key, family, chirality, color, g, q, t3, baryon=0, lepton=0):
        q, t3 = Fraction(q), Fraction(t3)
        for anti, sign in ((False, 1), (True, -1)):
            rows.append({
                'id': key + ('_anti' if anti else ''),
                'famille': family, 'secteur': 'quarks' if baryon else 'leptons',
                'chiralite_du_champ': chirality, 'antiparticule': anti,
                'representation_couleur': '3bar' if anti and color == '3' else color,
                'degenerescence': g, 'statistique': 'fermion',
                'Q_sur_e': str(sign * q), 'T3': str(sign * t3),
                'Y': str(sign * (q - t3)),
                'B': str(sign * Fraction(baryon)), 'L': str(sign * Fraction(lepton)),
            })

    for family in ('u', 'c', 't', 'd', 's', 'b'):
        up = family in ('u', 'c', 't')
        q, t3 = ('2/3', '1/2') if up else ('-1/3', '-1/2')
        pair(family + '_L', family, 'L', '3', 3, q, t3, baryon='1/3')
        pair(family + '_R', family, 'R', '3', 3, q, 0, baryon='1/3')
    for family in ('e', 'mu', 'tau'):
        pair(family + '_L', family, 'L', '1', 1, -1, '-1/2', lepton=1)
        pair(family + '_R', family, 'R', '1', 1, -1, 0, lepton=1)
        pair('nu_' + family + '_L', 'nu_' + family, 'L', '1', 1, 0, '1/2', lepton=1)

    def boson(key, sector, color, g, q=0, t3=0, y=0):
        rows.append({'id': key, 'famille': key, 'secteur': sector,
                     'chiralite_du_champ': None, 'antiparticule': None,
                     'representation_couleur': color, 'degenerescence': g,
                     'statistique': 'boson', 'Q_sur_e': str(Fraction(q)),
                     'T3': str(Fraction(t3)), 'Y': str(Fraction(y)), 'B': '0', 'L': '0'})

    boson('gluons', 'jauge_forte', '8', 16)
    # Base de jauge NON BRISÉE : W3 et B_Y, sans ajout séparé de photon/Z.
    boson('W_plus', 'jauge_electrofaible', '1', 2, 1, 1)
    boson('W_moins', 'jauge_electrofaible', '1', 2, -1, -1)
    boson('W3', 'jauge_electrofaible', '1', 2)
    boson('B_Y', 'jauge_electrofaible', '1', 2)
    boson('H_plus', 'higgs', '1', 1, 1, '1/2', '1/2')
    boson('H_moins', 'higgs', '1', 1, -1, '-1/2', '-1/2')
    boson('H_neutre', 'higgs', '1', 1, 0, '-1/2', '1/2')
    boson('H_neutre_conjugue', 'higgs', '1', 1, 0, '1/2', '-1/2')
    return rows


def selected_species(regime):
    if regime not in REGIMES:
        raise ValueError(f'Régime attendu : {", ".join(REGIMES)}')
    rows = catalogue()
    if regime == 'qcd_uds_ideal':
        rows = [r for r in rows if r['id'] == 'gluons' or
                (r['secteur'] == 'quarks' and r['famille'] in ('u', 'd', 's'))]
    return rows


def thermal_state(temperature, volume, regime):
    temperature = positive('température réduite', temperature)
    volume = positive('volume réduit', volume)
    rows = []
    for species in selected_species(regime):
        fermion = species['statistique'] == 'fermion'
        g = species['degenerescence']
        effective = g * (7 / 8 if fermion else 1)
        rho = math.pi**2 / 30 * effective * temperature**4
        n = ZETA3 / math.pi**2 * g * (3 / 4 if fermion else 1) * temperature**3
        rows.append(dict(species, g_energie=effective, rho_reduite=rho,
                         n_reduit=n, nombre_moyen=n * volume))
    rho = math.fsum(r['rho_reduite'] for r in rows)
    charges = {charge: math.fsum(float(Fraction(r[charge])) * r['nombre_moyen']
                               for r in rows)
               for charge in ('Q_sur_e', 'T3', 'Y', 'B', 'L')}
    return {'temperature_reduite': temperature, 'regime': regime,
            'g_bosons': sum(r['degenerescence'] for r in rows if r['statistique'] == 'boson'),
            'g_fermions': sum(r['degenerescence'] for r in rows if r['statistique'] == 'fermion'),
            'g_etoile': math.fsum(r['g_energie'] for r in rows),
            'rho_reduite': rho, 'pression_reduite': rho / 3,
            'entropie_reduite': 4 * rho / (3 * temperature),
            'energie_reduite': rho * volume,
            'nombre_moyen_total': math.fsum(r['nombre_moyen'] for r in rows),
            'charges_net_moyennes': charges, 'especes': rows}


def wall_profile(lambda4, v, area, half_width=8., intervals=800):
    lambda4 = positive('lambda4', lambda4)
    v = positive('v_reduit', v)
    area = positive('aire_reduite', area)
    positive('demi_intervalle_en_epaisseurs', half_width)
    if half_width < 6 or half_width > 20:
        raise ValueError('Demi-intervalle attendu : 6 à 20 épaisseurs')
    if type(intervals) is not int or not 200 <= intervals <= 20000 or intervals % 2:
        raise ValueError('intervalles doit être un entier pair de 200 à 20000')
    width = math.sqrt(2 / lambda4) / v
    mass = math.sqrt(2 * lambda4) * v
    tension = 2 * math.sqrt(2 * lambda4) * v**3 / 3
    rows = []
    # Résidu évalué en variables normalisées pour contrôler le profil.
    residuals = []
    for i in range(intervals + 1):
        x = half_width * (2 * i / intervals - 1)
        f = math.tanh(x)
        sech2 = 1 / math.cosh(x)**2
        gradient = .5 * (v / width * sech2)**2
        potential = lambda4 / 4 * v**4 * (f * f - 1)**2
        rows.append({'z_reduit': x * width, 'phi_reduit': v * f,
                     'energie_gradient_reduite': gradient,
                     'energie_potentiel_reduite': potential,
                     'rho_paroi_reduite': gradient + potential})
        residuals.append(abs(-2 * f * sech2 - 2 * f * (f * f - 1)))
    # Simpson composite de l'énergie par aire sur le domaine fini.
    dz = 2 * half_width * width / intervals
    weighted = [r['rho_paroi_reduite'] * (1 if i in (0, intervals) else 4 if i % 2 else 2)
                for i, r in enumerate(rows)]
    integrated = dz / 3 * math.fsum(weighted)
    return {'epaisseur_caracteristique_reduite': width,
            'masse_fluctuation_reduite': mass, 'tension_reduite': tension,
            'tension_integree_reduite': integrated,
            'energie_pour_aire_reduite': tension * area,
            'erreur_relative_integration': abs(integrated / tension - 1),
            'residu_equation_normalisee': max(residuals), 'profil': rows}


def load_config(path):
    config = json.loads(path.read_text(encoding='utf-8'))
    expected = {'paroi': {'lambda4', 'v_reduit', 'aire_reduite',
                          'demi_intervalle_en_epaisseurs', 'intervalles'},
                'plasma': {'regime', 'temperatures_reduites', 'volume_reduit'}}
    if not isinstance(config, dict) or set(config) != set(expected):
        raise ValueError('Configuration attendue : paroi et plasma')
    for section, keys in expected.items():
        if not isinstance(config[section], dict) or set(config[section]) != keys:
            raise ValueError(f'Clés attendues dans {section} : {", ".join(sorted(keys))}')
    temperatures = config['plasma']['temperatures_reduites']
    if not isinstance(temperatures, list) or not 1 <= len(temperatures) <= 100:
        raise ValueError('temperatures_reduites doit contenir 1 à 100 températures')
    for t in temperatures:
        positive('température réduite', t)
    positive('volume_reduit', config['plasma']['volume_reduit'])
    if config['plasma']['regime'] not in REGIMES:
        raise ValueError(f'Régime attendu : {", ".join(REGIMES)}')
    return config


def run(config):
    p = config['paroi']
    wall = wall_profile(p['lambda4'], p['v_reduit'], p['aire_reduite'],
                        p['demi_intervalle_en_epaisseurs'], p['intervalles'])
    plasma = config['plasma']
    states = [thermal_state(t, plasma['volume_reduit'], plasma['regime'])
              for t in plasma['temperatures_reduites']]
    return {'configuration': config,
            'statut': 'Paroi phénoménologique statique et limite idéale du bain ; modules non couplés.',
            'unites': {'echelle_E0': None, 'champ_temperature_masse_energie': 'E0',
                       'longueur': 'E0^-1', 'aire': 'E0^-2', 'volume': 'E0^-3',
                       'tension': 'E0^3', 'rho_pression': 'E0^4', 'densite_nombre_entropie': 'E0^3'},
            'hypotheses': ['Cinétique canonique du champ neutre Φ ; V=λ(Φ²−v²)²/4.',
                          'Bain idéal sans masses, à température commune, potentiels chimiques nuls.',
                          'SM symétrique : base W±, W3, B_Y et doublet de Higgs ; aucun photon/Z ajouté à cette base.',
                          'Q/e=T3+Y ; les couleurs d’affichage des surfaces ne sont pas les charges de couleur QCD.',
                          'La paroi est un paramètre d’ordre phénoménologique ; ses excitations ne sont pas ajoutées au bain SM.'],
            'non_calcules': ['Couplage entre Φ et la soupe, potentiel thermique et correction QCD interactive.',
                             'Masses et seuils thermiques, confinement et hadronisation.',
                             'Réactions, cascades, asymétries, thermalisation et transport.',
                             'Foyer gravitationnel, alignement dynamique, rupture et formation d’une bulle.'],
            'paroi': wall, 'plasma': states, 'catalogue': catalogue()}


def verify(result):
    checks = {}

    def check(name, error, tolerance):
        if not math.isfinite(error) or error > tolerance:
            raise AssertionError(f'{name} : {error} > {tolerance}')
        checks[name] = {'erreur': error, 'tolerance': tolerance}

    check('paroi/integrale_tension', result['paroi']['erreur_relative_integration'], 1e-8)
    check('paroi/equation_statique', result['paroi']['residu_equation_normalisee'], 1e-12)
    check('plasma/reference_SM_106_75', abs(thermal_state(1, 1, REGIMES[0])['g_etoile'] - 106.75), 0)
    check('plasma/reference_QCD_uds_47_5', abs(thermal_state(1, 1, REGIMES[1])['g_etoile'] - 47.5), 0)
    normalized_charge = max(abs(value) / max(1, state['nombre_moyen_total'])
                            for state in result['plasma']
                            for value in state['charges_net_moyennes'].values())
    check('plasma/neutralite_moyenne_mu_nul', normalized_charge, 1e-14)
    check('charges/Q_T3_Y', max(abs(float(Fraction(r['Q_sur_e']) - Fraction(r['T3']) - Fraction(r['Y'])))
                               for r in result['catalogue']), 0)
    return checks


def report(result, destination):
    def table(headers, rows):
        return '<div class="scroll"><table><thead><tr>' + ''.join('<th>' + html.escape(h) + '</th>' for h in headers) + \
            '</tr></thead><tbody>' + ''.join('<tr>' + ''.join('<td>' + html.escape(str(v)) + '</td>' for v in row) + '</tr>' for row in rows) + '</tbody></table></div>'

    wall = result['paroi']
    wall_table = table(['Grandeur', 'Valeur réduite', 'Facteur d’unité'], [
        ['Épaisseur caractéristique ℓ', f"{wall['epaisseur_caracteristique_reduite']:.8g}", 'E0⁻¹'],
        ['Tension σ', f"{wall['tension_reduite']:.8g}", 'E0³'],
        ['Énergie σ × aire', f"{wall['energie_pour_aire_reduite']:.8g}", 'E0'],
        ['Erreur relative de l’intégrale', f"{wall['erreur_relative_integration']:.3g}", 'sans dimension']])
    plasma_table = table(['T/E0', 'g*', 'ρ/E0⁴', 'p/E0⁴', 's/E0³', 'Nombre moyen'],
                         [[s['temperature_reduite'], s['g_etoile'], f"{s['rho_reduite']:.8g}",
                           f"{s['pression_reduite']:.8g}", f"{s['entropie_reduite']:.8g}",
                           f"{s['nombre_moyen_total']:.8g}"] for s in result['plasma']])
    species_table = table(['État', 'Couleur SU(3)', 'g', 'Q/e', 'T3', 'Y', 'B', 'L'],
                          [[r[k] for k in ('id', 'representation_couleur', 'degenerescence',
                                          'Q_sur_e', 'T3', 'Y', 'B', 'L')]
                           for r in result['plasma'][0]['especes']])
    pending = ''.join('<li>' + html.escape(s) + '</li>' for s in result['non_calcules'])
    document = '''<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Parois de champs et soupe — référence calculable</title><style>body{margin:0;background:#f3f5f7;color:#182738;font:16px/1.55 system-ui,sans-serif}main{max-width:1100px;margin:auto;padding:32px 22px}section{background:white;padding:22px;border:1px solid #dce2e8;border-radius:12px;margin:20px 0}h1{line-height:1.2}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:9px;border-bottom:1px solid #e2e7ed}th{background:#eef3f5}.scroll{overflow:auto}a{color:#006e78}p{max-width:95ch}</style>
<main><h1>Parois de champs et soupe</h1><p>Choix de modélisation : branes représentées par des parois de champs ; milieu comprenant quarks, antiquarks, gluons et autres champs du Modèle standard.</p>
<p>Cette première référence calcule une paroi statique et un bain idéal séparément. E0 n’est pas calibrée. Les températures sont des rapports T/E0 ; aucune histoire thermique n’est simulée.</p>
<p><a href="resultats.json">Résultats</a> · <a href="especes.csv">Charges et espèces</a> · <a href="profil_paroi.csv">Profil</a> · <a href="verification.json">Vérifications</a> · <a href="configuration_executee.json">Configuration</a></p>
<section><h2>Paroi phénoménologique</h2><p>V(Φ)=λ(Φ²−v²)²/4 ; Φ(z)=v tanh(z/ℓ), ℓ=√(2/λ)/v ; σ=2√(2λ)v³/3. L’épaisseur est la longueur caractéristique de ce profil. Les paramètres sont exploratoires et ne sont pas déduits de QCD.</p>'''
    document += wall_table + '</section><section><h2>Bain idéal : ' + html.escape(result['plasma'][0]['regime']) + '</h2>'
    document += '<p>Équilibre commun, masses et potentiels chimiques nuls. Les nombres sont des moyennes statistiques ; l’asymétrie nette est nulle dans cette référence. ρ=(π²/30)g*T⁴ et p=ρ/3. Le cas QCD seul à trois saveurs donne g*=47,5 ; le SM complet idéal donne 106,75.</p>' + plasma_table + '</section>'
    document += '<section><h2>Espèces incluses et charges</h2><p>Q/e=T3+Y. Dans le régime SM symétrique, W3 et B_Y remplacent la base photon/Z : les ajouter séparément doublerait des degrés de liberté. Les représentations de couleur sont des propriétés de jauge, distinctes des couleurs des surfaces 3D.</p>' + species_table + '</section>'
    document += '<section><h2>Prochains mécanismes à calculer</h2><ul>' + pending + '</ul><p>La formation de hadrons, noyaux et atomes demande les interactions, le refroidissement et les échelles de temps appropriés. Leptons et photons ont leurs propres champs ; ils ne sont pas composés de quarks.</p></section>'
    document += '<section><h2>Sources et définitions</h2><p><a href="https://www.damtp.cam.ac.uk/user/tong/cosmo/cosmohtml/S2.html">Thermodynamique relativiste</a> · <a href="https://home.cern/science/physics/standard-model/">Champs du Modèle standard</a> · <a href="https://arxiv.org/abs/1710.05024">QCD sur réseau : prochaine comparaison</a></p></section></main></html>'
    (destination / 'rapport.html').write_text(document, encoding='utf-8')


def execute(config_path, destination):
    config = load_config(config_path)
    result = run(config)
    checks = verify(result)
    destination = destination.resolve()
    destination.mkdir(parents=True, exist_ok=True)

    def save(name, value):
        (destination / name).write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n', encoding='utf-8')

    # Conserver le profil une seule fois en CSV ; résultats scalaires en JSON.
    profile = result['paroi'].pop('profil')
    save('resultats.json', result)
    save('configuration_executee.json', config)
    save('verification.json', checks)
    for name, rows in [('profil_paroi.csv', profile), ('especes.csv', result['catalogue'])]:
        with (destination / name).open('w', newline='', encoding='utf-8') as stream:
            writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
            writer.writeheader()
            writer.writerows(rows)
    sources = [Path(__file__), config_path, FOLDER / 'README.md']
    save('sources_manifest.json', [{'fichier': str(p.resolve()), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()}
                                   for p in sources])
    report(result, destination)
    return checks
