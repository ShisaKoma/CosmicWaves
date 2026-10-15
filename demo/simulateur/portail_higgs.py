"""Portail de Higgs : profils statiques couplés et stabilité linéaire.

V_int = kappa Phi² H†H / 2 = kappa Phi² h² / 4.
Le flot de relaxation minimise une énergie libre ; ce n'est PAS un temps
physique ni une mesure du chauffage. Python standard, sans dépendance numérique.
"""
import csv
import hashlib
import html
import json
import math
from pathlib import Path

FOLDER = Path(__file__).resolve().parent.parent / 'portail-higgs'
CONFIG = FOLDER / 'configuration.json'


def validate(config):
    schema = {'potentiel': {'lambda_phi', 'v_phi_reduit', 'lambda_h', 'mu_h2_reduit',
                            'kappa', 'c_phi', 'c_h'},
              'grille': {'demi_largeur_en_ell', 'intervalles', 'tolerance_residu', 'iterations_max'},
              'sondes': {'y_top', 'g', 'g_Y'}}
    if not isinstance(config, dict) or set(config) != set(schema) | {'temperatures_reduites'}:
        raise ValueError('Configuration portail : potentiel, grille, sondes, temperatures_reduites')
    for section, keys in schema.items():
        if not isinstance(config[section], dict) or set(config[section]) != keys:
            raise ValueError(f'Clés attendues dans {section} : {sorted(keys)}')
        for key, value in config[section].items():
            if isinstance(value, bool) or not isinstance(value, (float, int)) or not math.isfinite(value):
                raise ValueError(f'{section}.{key} doit être un nombre fini')
    p, g = config['potentiel'], config['grille']
    for key in ('lambda_phi', 'lambda_h', 'v_phi_reduit'):
        if p[key] <= 0:
            raise ValueError(f'{key} doit être positif')
    # Première branche : portail répulsif entre condensats et masses thermiques positives.
    for key in ('kappa', 'c_phi', 'c_h'):
        if p[key] < 0:
            raise ValueError(f'{key} doit être positif ou nul dans cette branche')
    if any(v < 0 for v in config['sondes'].values()):
        raise ValueError('Les couplages des sondes doivent être positifs ou nuls')
    if type(g['intervalles']) is not int or g['intervalles'] % 2 or not 80 <= g['intervalles'] <= 4000:
        raise ValueError('intervalles : entier pair de 80 à 4000')
    if type(g['iterations_max']) is not int or not 1 <= g['iterations_max'] <= 100000:
        raise ValueError('iterations_max : entier de 1 à 100000')
    if not 6 <= g['demi_largeur_en_ell'] <= 30 or not 1e-10 <= g['tolerance_residu'] <= 1e-4:
        raise ValueError('Domaine : 6 à 30 ell ; tolérance : 1e-10 à 1e-4')
    ts = config['temperatures_reduites']
    if not isinstance(ts, list) or not 1 <= len(ts) <= 30:
        raise ValueError('Donner 1 à 30 températures')
    for t in ts:
        if isinstance(t, bool) or not isinstance(t, (float, int)) or not math.isfinite(t) or t < 0:
            raise ValueError('Températures finies positives ou nulles attendues')
    return config


def load_config(path):
    return validate(json.loads(path.read_text(encoding='utf-8')))


def coefficients(p, temperature):
    return (-p['lambda_phi'] * p['v_phi_reduit']**2 + p['c_phi'] * temperature**2,
            -p['mu_h2_reduit'] + p['c_h'] * temperature**2)


def potential(phi, h, p, temperature):
    a, b = coefficients(p, temperature)
    return a * phi**2 / 2 + p['lambda_phi'] * phi**4 / 4 + b * h**2 / 2 + \
        p['lambda_h'] * h**4 / 4 + p['kappa'] * phi**2 * h**2 / 4


def derivatives(phi, h, p, temperature):
    a, b = coefficients(p, temperature)
    return (phi * (a + p['lambda_phi'] * phi**2 + p['kappa'] * h**2 / 2),
            h * (b + p['lambda_h'] * h**2 + p['kappa'] * phi**2 / 2))


def homogeneous_minima(p, temperature):
    """Tous les candidats homogènes de ce potentiel quartique, h >= 0."""
    a, b = coefficients(p, temperature)
    candidates = [('origine', 0., 0.)]
    if a < 0:
        candidates.append(('phi', math.sqrt(-a / p['lambda_phi']), 0.))
    if b < 0:
        candidates.append(('higgs', 0., math.sqrt(-b / p['lambda_h'])))
    cross = p['kappa'] / 2
    det = p['lambda_phi'] * p['lambda_h'] - cross**2
    if abs(det) > 1e-12 * max(p['lambda_phi'] * p['lambda_h'], cross**2):
        x = (-a * p['lambda_h'] + cross * b) / det
        y = (-b * p['lambda_phi'] + cross * a) / det
        if x > 0 and y > 0:
            candidates.append(('mixte', math.sqrt(x), math.sqrt(y)))
    rows = []
    for name, phi, h in candidates:
        aa = a + 3 * p['lambda_phi'] * phi**2 + cross * h**2
        bb = b + 3 * p['lambda_h'] * h**2 + cross * phi**2
        ab = p['kappa'] * phi * h
        lowest = (aa + bb - math.hypot(aa - bb, 2 * ab)) / 2
        rows.append({'phase': name, 'phi_reduit': phi, 'h_reduit': h,
                     'V_reduit': potential(phi, h, p, temperature),
                     'courbure_minimale': lowest, 'minimum_local': lowest >= -1e-12})
    return rows


def lowest_eigenvalue(diagonal, off):
    """Bisection de Sturm pour une matrice symétrique tridiagonale."""
    lo, hi = min(diagonal) - 2 * abs(off), max(diagonal) + 2 * abs(off)
    for _ in range(65):
        mid = (lo + hi) / 2
        pivot = diagonal[0] - mid
        if abs(pivot) < 1e-100:
            pivot = -1e-100
        count = int(pivot < 0)
        for value in diagonal[1:]:
            pivot = value - mid - off * off / pivot
            if abs(pivot) < 1e-100:
                pivot = -1e-100
            count += pivot < 0
        if count:
            hi = mid
        else:
            lo = mid
    return (lo + hi) / 2


def solve_tridiagonal(diag, off, rhs):
    upper, reduced = [], []
    for i, value in enumerate(rhs):
        divisor = diag - (off * upper[-1] if i else 0)
        upper.append(off / divisor)
        reduced.append((value - (off * reduced[-1] if i else 0)) / divisor)
    result = reduced[:]
    for i in range(len(result) - 2, -1, -1):
        result[i] -= upper[i] * result[i + 1]
    return result


def free_energy(phi, h, dz, p, temperature, background):
    gradients = math.fsum(((phi[i + 1] - phi[i])**2 + (h[i + 1] - h[i])**2) / (2 * dz)
                          for i in range(len(phi) - 1))
    values = [potential(s, v, p, temperature) - background for s, v in zip(phi, h)]
    return gradients + dz * (math.fsum(values[1:-1]) + (values[0] + values[-1]) / 2)


def residual(phi, h, dz, p, temperature):
    largest = 0.
    for i in range(1, len(phi) - 1):
        ds, dh = derivatives(phi[i], h[i], p, temperature)
        largest = max(largest, abs(ds - (phi[i - 1] - 2 * phi[i] + phi[i + 1]) / dz**2),
                      abs(dh - (h[i - 1] - 2 * h[i] + h[i + 1]) / dz**2))
    return largest


def relax(phi, h, dz, p, temperature, grid, background):
    """Descente d'énergie libre avec diffusion implicite et recherche de pas.

    Les bornes sont fixées. Le profil initial fixe le secteur topologique et
    centre la paroi. La convergence ne prouve pas une stabilité multidimensionnelle.
    """
    energy = free_energy(phi, h, dz, p, temperature, background)
    history = [{'iteration': 0, 'energie_libre_par_aire': energy}]
    step = .5
    for iteration in range(grid['iterations_max'] + 1):
        error = residual(phi, h, dz, p, temperature)
        if error <= grid['tolerance_residu'] or iteration == grid['iterations_max']:
            break
        ds, dh = zip(*(derivatives(s, v, p, temperature) for s, v in zip(phi[1:-1], h[1:-1])))
        for _ in range(40):
            r = step / dz**2
            rhs_s = [s - step * d for s, d in zip(phi[1:-1], ds)]
            rhs_h = [v - step * d for v, d in zip(h[1:-1], dh)]
            rhs_s[0] += r * phi[0]
            rhs_s[-1] += r * phi[-1]
            rhs_h[0] += r * h[0]
            rhs_h[-1] += r * h[-1]
            new_s = [phi[0]] + solve_tridiagonal(1 + 2 * r, -r, rhs_s) + [phi[-1]]
            new_h = [h[0]] + solve_tridiagonal(1 + 2 * r, -r, rhs_h) + [h[-1]]
            new_energy = free_energy(new_s, new_h, dz, p, temperature, background)
            if math.isfinite(new_energy) and new_energy <= energy + 2e-14 * max(1, abs(energy)):
                break
            step *= .5
        else:
            raise ValueError('La recherche du pas de relaxation a échoué')
        phi, h, energy = new_s, new_h, new_energy
        step = min(1., step * 1.05)
        if (iteration + 1) % 50 == 0:
            history.append({'iteration': iteration + 1, 'energie_libre_par_aire': energy})
    history.append({'iteration': iteration, 'energie_libre_par_aire': energy})
    return phi, h, {'converge': error <= grid['tolerance_residu'], 'iterations': iteration,
                   'residu_max_reduit': error, 'energie_libre_par_aire': energy,
                   'historique_relaxation': history}


def probe_profile(z, h, probes):
    """Contributions du Higgs aux masses ; aucun terme thermique de dispersion."""
    rows = []
    factors = {'top': probes['y_top']**2 / 2, 'W': probes['g']**2 / 4,
               'Z': (probes['g']**2 + probes['g_Y']**2) / 4}
    for i, (position, value) in enumerate(zip(z, h)):
        row = {'z_reduit': position}
        left, right = max(0, i - 1), min(len(h) - 1, i + 1)
        dh2 = (h[right]**2 - h[left]**2) / (z[right] - z[left])
        for name, factor in factors.items():
            row['m_' + name + '_Higgs_reduit'] = math.sqrt(factor) * abs(value)
            # Force semi-classique F_z = coefficient / E, si la paroi est épaisse.
            row['E_Fz_' + name + '_reduit'] = -.5 * factor * dh2
        rows.append(row)
    return rows


def scenario(config, temperature):
    p, grid = config['potentiel'], config['grille']
    a, b = coefficients(p, temperature)
    phases = homogeneous_minima(p, temperature)
    global_minimum = min(phases, key=lambda x: x['V_reduit'])
    base = {'temperature_reduite': temperature, 'phases_homogenes': phases,
            'phase_globale': global_minimum['phase'],
            'puissance_transfert_vers_plasma': None, 'taux_reactions': None,
            'temperature_nucleation': None, 'stabilite_profil_final': 'non_calculee'}
    if a >= 0:
        return dict(base, statut='pas_de_domaines_phi_a_cette_temperature', profil=[])
    v = math.sqrt(-a / p['lambda_phi'])
    ell = math.sqrt(2 / p['lambda_phi']) / v
    half, n = grid['demi_largeur_en_ell'], grid['intervalles']
    z = [ell * half * (2 * i / n - 1) for i in range(n + 1)]
    dz = z[1] - z[0]
    phi = [v * math.tanh(x / ell) for x in z]
    phi[0], phi[-1] = -v, v
    mass_bulk = b + p['kappa'] * v**2 / 2
    nu = (math.sqrt(1 + 4 * p['kappa'] / p['lambda_phi']) - 1) / 2
    eigen_exact = mass_bulk - nu**2 / ell**2
    diagonal = [2 / dz**2 + b + p['kappa'] * s**2 / 2 for s in phi[1:-1]]
    eigen_numeric = lowest_eigenvalue(diagonal, -1 / dz**2)
    base.update({'v_phi_T': v, 'ell_reference': ell, 'courbure_h_bulk': mass_bulk,
                 'courbure_h_centre': b, 'omega2_reference_analytique': eigen_exact,
                 'omega2_reference_boite': eigen_numeric,
                 'erreur_spectre_absolue': abs(eigen_numeric - eigen_exact),
                 'nu_mode': nu, 'dz_reduit': dz,
                 'stabilite_reference': 'instable' if eigen_exact < -1e-10 else
                     'stable_lineairement' if eigen_exact > 1e-10 else 'marginale'})
    if mass_bulk <= 0:
        return dict(base, statut='domaines_phi_instables_dans_le_volume', profil=[])
    h = [.02 * v / math.cosh(x / ell)**max(nu, .5) for x in z]
    h[0], h[-1] = 0., 0.
    background = potential(v, 0, p, temperature)
    bare_energy = free_energy(phi, [0.] * (n + 1), dz, p, temperature, background)
    phi, h, solution = relax(phi, h, dz, p, temperature, grid, background)
    # Contrôle de sensibilité potentielle aux bords ; pas une preuve de convergence en taille.
    hmax = max(abs(x) for x in h)
    edge = max(abs(h[i]) for i in range(n + 1) if abs(z[i]) >= .8 * abs(z[-1]))
    edge_ratio = edge / hmax if hmax > 1e-5 * v else 0.
    probes = probe_profile(z, h, config['sondes'])
    profile = [dict(probe, phi_reduit=s, h_reduit=value,
                    V_moins_bulk_reduit=potential(s, value, p, temperature) - background)
               for probe, s, value in zip(probes, phi, h)]
    return dict(base, statut='profil_stationnaire' if solution['converge'] else 'relaxation_non_convergee',
                solution=solution, energie_libre_reference=bare_energy,
                h_centre=h[n // 2], h_max=hmax, rapport_h_bord_sur_max=edge_ratio,
                influence_bords_possible=edge_ratio > .02, profil=profile)


def run(config):
    validate(config)
    return {'configuration': config,
            'statut': 'Modèle effectif exploratoire Φ–Higgs ; relaxation statique à température imposée.',
            'unites': {'E0': None, 'phi_h_T_masse': 'E0', 'z': 'E0^-1',
                       'V': 'E0^4', 'energie_libre_par_aire': 'E0^3',
                       'omega2_courbure': 'E0^2', 'E_Fz': 'E0^3'},
            'hypotheses': ['V= a_phi Φ²/2 + λ_phi Φ⁴/4 + a_h h²/2 + λ_h h⁴/4 + κ Φ²h²/4.',
                          'a_phi=−λ_phi v_phi²+c_phi T² ; a_h=−mu_h²+c_h T² ; T imposée.',
                          'Les coefficients thermiques et couplages sont des entrées exploratoires, non calibrées.',
                          'Deux champs canoniques plans ; conditions Φ(±L)=±v_phi(T), h(±L)=0.',
                          'La relaxation minimise une énergie libre : ses itérations ne sont pas un temps physique.',
                          'Les masses exportées sont les contributions du Higgs pour trois sondes, sans dispersion thermique.'],
            'non_calcules': ['Origine microscopique du champ collectif et contraintes expérimentales sur ce jeu de paramètres.',
                             'Potentiel thermique complet, corrections de boucles et dépendance de jauge.',
                             'Stabilité complète des profils finaux ; minima multiples non exclus.',
                             'Friction, vitesse physique, chauffage, réactions QCD et populations hors équilibre.',
                             'Taux de nucléation, température de nucléation, bulles 3D et gravitation.'],
            'scenarios': [scenario(config, t) for t in config['temperatures_reduites']]}


def verify(result):
    checks = {}
    tolerance = result['configuration']['grille']['tolerance_residu']
    for i, case in enumerate(result['scenarios']):
        if not case['profil']:
            checks[f'{i}/domaine_absent_ou_instable_signale'] = True
            continue
        sol = case['solution']
        if not sol['converge'] or sol['residu_max_reduit'] > tolerance:
            raise AssertionError(f'Scénario {i} : relaxation non convergée')
        history = sol['historique_relaxation']
        increase = max(b['energie_libre_par_aire'] - a['energie_libre_par_aire']
                       for a, b in zip(history, history[1:]))
        if increase > 1e-10:
            raise AssertionError('La relaxation augmente l’énergie libre')
        profile = case['profil']
        symmetry = max(max(abs(a['phi_reduit'] + b['phi_reduit']), abs(a['h_reduit'] - b['h_reduit']))
                       for a, b in zip(profile, reversed(profile)))
        if symmetry > 1e-7 * max(1, case['v_phi_T'], case['h_max']):
            raise AssertionError('Symétrie du profil perdue')
        for label, value in [('residu_statique', sol['residu_max_reduit']),
                             ('hausse_max_energie_libre', max(0, increase)),
                             ('symetrie', symmetry)]:
            checks[f'{i}/{label}'] = value
    return checks


def plot(result, destination):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig, axes = plt.subplots(2, 2, figsize=(11, 7), layout='constrained')
    for case in result['scenarios']:
        rows = case['profil']
        if not rows:
            continue
        label = f"T/E₀ = {case['temperature_reduite']:g}"
        z = [r['z_reduit'] for r in rows]
        axes[0, 0].plot(z, [r['phi_reduit'] for r in rows], label=label)
        axes[0, 1].plot(z, [r['h_reduit'] for r in rows], label=label)
        axes[1, 0].plot(z, [r['m_top_Higgs_reduit'] for r in rows], label=label)
        axes[1, 1].plot(case['temperature_reduite'], case['omega2_reference_analytique'], 'o', label=label)
    for ax, title, ylabel in zip(axes.flat,
            ['Champ de paroi', 'Réponse du Higgs', 'Masse du top : contribution Higgs', 'Stabilité de la paroi de référence (h=0)'],
            ['Φ/E₀', 'h/E₀', 'mₜ/E₀', 'ω₀²/E₀²']):
        ax.set(title=title, ylabel=ylabel, xlabel='z E₀')
        ax.grid(alpha=.25)
        ax.legend(fontsize=8)
    axes[1, 1].set_xlabel('T/E₀')
    axes[1, 1].axhline(0, color='black', linewidth=.8)
    fig.suptitle('Portail de Higgs · paramètres exploratoires · température imposée')
    fig.savefig(destination / 'profils.png', dpi=150)
    fig.savefig(destination / 'profils.svg')
    plt.close(fig)


def report(result, destination, with_plot):
    esc = html.escape
    rows = []
    for c in result['scenarios']:
        omega = c.get('omega2_reference_analytique')
        sol = c.get('solution', {})
        rows.append([c['temperature_reduite'], c['statut'], c.get('stabilite_reference', '—'),
                     '—' if omega is None else f'{omega:.6g}', f"{c.get('h_centre', 0):.6g}",
                     '—' if not sol else f"{sol['energie_libre_par_aire']:.6g}", c['phase_globale']])
    headers = ['T/E₀', 'Calcul', 'Paroi initiale h=0', 'ω₀²/E₀²', 'h(0)/E₀', 'F excédentaire / aire / E₀³', 'Phase homogène la plus basse']
    table = '<div class="scroll"><table><tr>' + ''.join('<th>' + esc(x) + '</th>' for x in headers) + '</tr>'
    table += ''.join('<tr>' + ''.join('<td>' + esc(str(x)) + '</td>' for x in row) + '</tr>' for row in rows) + '</table></div>'
    limits = ''.join('<li>' + esc(x) + '</li>' for x in result['non_calcules'])
    picture = '<a href="profils.svg"><img src="profils.png" alt="Profils couplés, masse du top et stabilité selon la température"></a>' if with_plot else ''
    content = '''<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Paroi et Higgs — profils couplés</title><style>body{margin:0;background:#f2f5f7;color:#182738;font:16px/1.55 system-ui,sans-serif}main{max-width:1180px;margin:auto;padding:28px 20px}section{background:white;padding:22px;border:1px solid #dae2e8;border-radius:12px;margin:18px 0}h1{line-height:1.2}.scroll{overflow:auto}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:10px;border-bottom:1px solid #e0e6eb}th{background:#edf3f5}a{color:#006d78}img{width:100%;height:auto}p{max-width:100ch}</style><main>
<h1>Paroi et Higgs : une première interaction calculée</h1>
<p>V<sub>int</sub> = κ Φ² H†H / 2 = κ Φ² h² / 4. Les champs sont résolus ensemble à température fixée. E₀ et les paramètres ne sont pas calibrés sur des mesures.</p>
<p><a href="resultats.json">Résultats</a> · <a href="profils.csv">Profils et masses</a> · <a href="relaxation.csv">Convergence numérique</a> · <a href="configuration_executee.json">Configuration</a> · <a href="verification.json">Contrôles</a></p>
<section><h2>Réponse locale et stabilité</h2><p>ω₀² &lt; 0 signale une perturbation du Higgs qui peut croître sur la paroi initiale. Le calcul inclut le coût des gradients. Ce diagnostic ne prouve ni une nucléation, ni la stabilité complète du profil final.</p>'''
    content += table + picture + '</section><section><h2>Ce que mesurent les sorties</h2><p>La relaxation recherche un profil stationnaire plan. Ses itérations sont numériques, sans durée physique. La baisse d’énergie libre n’est pas comptée comme chaleur donnée au plasma. Les profils de masses top/W/Z omettent les effets thermiques sur la propagation. Le coefficient E × Fz = −½ ∂z(m²) prépare le transport semi-classique ; aucune force moyenne ni puissance ne sont encore calculées.</p><p>Les valeurs +Φ et −Φ donnent le même couplage loin des deux côtés ; le changement peut être localisé dans la paroi. Une extension au transport demandera les distributions, les collisions et leurs réactions inverses.</p></section>'
    warnings = [f"T/E₀={c['temperature_reduite']} : le profil approche les bords ; augmenter la boîte avant interprétation."
                for c in result['scenarios'] if c.get('influence_bords_possible')]
    if warnings:
        content += '<section><h2>Limites de la boîte</h2><p>' + '<br>'.join(map(esc, warnings)) + '</p></section>'
    content += '<section><h2>Mécanismes restant à calculer</h2><ul>' + limits + '</ul></section>'
    content += '<section><h2>Références</h2><p><a href="https://arxiv.org/abs/2203.16450">Parois favorisant une transition</a> · <a href="https://arxiv.org/abs/2009.14295">Profils, vitesse et friction</a> · <a href="https://arxiv.org/abs/hep-ph/0209353">Transport dans un plasma chaud</a></p></section></main></html>'
    (destination / 'rapport.html').write_text(content, encoding='utf-8')


def execute(config_path, destination, with_plot=False):
    result = run(load_config(config_path))
    checks = verify(result)
    destination = destination.resolve()
    destination.mkdir(parents=True, exist_ok=True)
    if with_plot:
        plot(result, destination)
    report(result, destination, with_plot)
    profiles, histories = [], []
    for i, case in enumerate(result['scenarios']):
        profiles.extend(dict(scenario=i, temperature_reduite=case['temperature_reduite'], **row)
                        for row in case.pop('profil'))
        if 'solution' in case:
            histories.extend(dict(scenario=i, **row) for row in case['solution'].pop('historique_relaxation'))
    for name, rows in [('profils.csv', profiles), ('relaxation.csv', histories)]:
        with (destination / name).open('w', newline='', encoding='utf-8') as stream:
            writer = csv.DictWriter(stream, fieldnames=list(rows[0]) if rows else ['scenario'])
            writer.writeheader()
            writer.writerows(rows)
    def save(name, value):
        (destination / name).write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False) + '\n', encoding='utf-8')
    save('resultats.json', result)
    save('configuration_executee.json', result['configuration'])
    save('verification.json', checks)
    sources = [Path(__file__), config_path, FOLDER / 'README.md', FOLDER / 'sources.json',
               FOLDER.parent / 'bibliographie' / 'portail_higgs_parois_transport.md']
    save('sources_manifest.json', [{'fichier': str(p.resolve()), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in sources])
    return checks
