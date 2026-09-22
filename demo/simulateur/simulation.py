"""Exécuter ensemble les modèles calculables du corpus output/*."""
import argparse
import csv
import hashlib
import html
import json
import math
import sys
from pathlib import Path

from modeles import (finite, grid, tilted_well, reciprocal, jeans, matter_growth,
                     closure_energy, closed_probability, capture_uniform, poisson_probability)

HERE = Path(__file__).resolve().parent
OUTPUT = HERE.parent
sys.path.insert(0, str(OUTPUT/'seuil-entropie'))
sys.path.insert(0, str(OUTPUT/'plasma-bulle'))
import calcul_seuil as entropy
import comparer_germes as germs
import calcul_bulle as bubble


COVERAGE = [
    ('Accumulation, entropie et neuf germes', 'Calculé', 'seuil-entropie/comparaison_germes.md',
     'Réutilisation des équations et des neuf préparations historiques ; q est une amplitude de configuration.'),
    ('Seuils locaux hétérogènes', 'Calculé', 'seuil-entropie/notes_dimensions_fermeture.md',
     'Paramètres propres à chaque germe : k, g, b, N, température, alpha, mobilité, apport et perte. N reste fixe pour chaque trajectoire.'),
    ('Domaines A/B', 'Potentiel local calculé', 'seuil-entropie/domaines_AB.md',
     'Inclinaison h signée, extrema, seuil et barrière. Aucun médiateur causal ni taux de transition déduit.'),
    ('Couplage réciproque', 'Calculé', 'synthese-arxiv/manuscrit_fr.md',
     'Relaxation de deux domaines, modes propres et perte de coexistence ; au seuil eta=1/3, le point n’est déjà plus un minimum.'),
    ('Bulle et réservoir fini', 'Calculé', 'plasma-bulle/nuage_plasma_bulle.md',
     'Branches, énergies, deux seuils, quatre bassins/préparations, sensibilité à la tension et accessibilité sous accumulation.'),
    ('Attracteur radial', 'Calculé', 'plasma-bulle/gravitation_et_probabilite.md',
     'Rappel exponentiel local autour du minimum ; la barrière et le bassin sont conservés. La gravitation est absente de cette équation.'),
    ('Gravitation et agrégation', 'Approximation linéaire calculée', 'plasma-bulle/gravitation_et_probabilite.md',
     'Jeans statique : croissance possible, régime marginal ou oscillations selon pression, densité et échelle ; arrêt à |D|=0,1 au plus.'),
    ('Fond en expansion', 'Exemple analytique calculé', 'plasma-bulle/gravitation_et_probabilite.md',
     'Fond plat de matière sans pression : modes t^(2/3) et t^(-1). Aucun plasma relativiste ni expansion d’une bulle ne sont décrits.'),
    ('Fermeture du filament', 'Énergie comparée ; taux imposés', 'seuil-entropie/notes_dimensions_fermeture.md',
     'Segment/cercle de même longueur ; cinétique ouvert/fermé illustrative avec taux explicitement fournis, indépendants du critère énergétique.'),
    ('Probabilité de capture', 'Conditionnelle', 'plasma-bulle/gravitation_et_probabilite.md',
     'Distribution uniforme illustrative de rayons déjà préparés. Cette mesure du bassin n’est pas une probabilité de création.'),
    ('Probabilité de nucléation', 'Calculable si un taux est fourni', 'plasma-bulle/gravitation_et_probabilite.md',
     'Poisson à taux et volume constants imposés ; aucune valeur par défaut de Gamma et aucun taux dérivé de la barrière.'),
    ('Nuage → agrégation → plasma → seuil → bulle → persistance', 'Chaîne hypothétique conservée', 'journal_hypotheses.md',
     'Les modules ci-dessus examinent des étapes distinctes ; aucune loi commune ne les relie encore.'),
    ('Fermions, bosons et composition du plasma', 'À définir', 'journal_hypotheses.md',
     'Quarks, antiquarks, leptons, photons, gluons, W et Z : pas d’équation d’état ni de populations calibrées dans le corpus.'),
    ('Dimensions spatiales et modes accessibles', 'À définir', 'seuil-entropie/notes_dimensions_fermeture.md',
     'Dimensions compactes, création de dimensions et nombre de modes internes restent distincts ; pas de loi de changement du nombre de dimensions.'),
    ('Observation interne et propagation', 'À définir', 'seuil-entropie/notes_dimensions_fermeture.md',
     'Pas de signal physique ni d’instrument définis ; aucune correction de référentiel ne modifie artificiellement les seuils.'),
    ('Nucléation gravitationnelle, cordes et cosmologie', 'À définir', 'plasma-bulle/gravitation_et_probabilite.md',
     'Action et préfacteur de Coleman–De Luccia, champs, métrique, production de particules et thermalisation restent à construire.'),
    ('Saturation informationnelle et analogies externes', 'Non adoptées comme lois', 'seuil-entropie/commentaire_garnier_malet.md',
     'Aucun déclenchement par simple décompte de paramètres, dédoublement du temps ou analogie humaine n’est ajouté aux équations.')
]


def load_config(path):
    config = json.loads(path.read_text(encoding='utf-8'))
    template = json.loads((HERE/'configuration.json').read_text(encoding='utf-8'))
    def structure(value, reference, name):
        if isinstance(reference, dict):
            if not isinstance(value, dict) or value.keys() != reference.keys():
                raise ValueError(f'Clés attendues pour {name} : {", ".join(reference)}')
            for key in reference:
                structure(value[key], reference[key], name+'.'+key)
        elif isinstance(reference, list):
            if not isinstance(value, list) or not 1 <= len(value) <= 100:
                raise ValueError(f'{name} doit contenir 1 à 100 éléments')
            for element in value:
                structure(element, reference[0], name)
        elif isinstance(reference, (float, int)):
            finite(name, value)
        elif isinstance(reference, str) and not isinstance(value, str):
            raise ValueError(f'{name} doit être un texte')
    structure(config, template, 'configuration')
    if len({g['nom'] for g in config['germes_locaux']}) != len(config['germes_locaux']):
        raise ValueError('Chaque germe local doit avoir un nom distinct')
    return config


def run(config):
    duration, step, q0 = config['duree_germes'], config['pas_germes'], config['q_initial']
    grid(duration, step)
    reference = [germs.run_case(a, j, duration, step, q0) for a in germs.ALPHAS for j in germs.INFLUXES]
    locals_ = []
    for spec in config['germes_locaux']:
        for key in ('k', 'g', 'b', 'temperature', 'mobility', 'perte'):
            finite(key, spec[key], 0, True)
        finite('apport', spec['apport'], 0)
        finite('modes', spec['modes'], 0)
        if int(spec['modes']) != spec['modes']:
            raise ValueError('Le nombre de modes doit être entier')
        model = entropy.Model(**{k: spec[k] for k in ('k', 'g', 'b', 'modes', 'temperature', 'alpha', 'mobility')})
        critical = model.critical_loading()
        tc = entropy.threshold_time(critical, spec['apport'], spec['perte'])
        trajectory = entropy.integrate_drift(model, lambda t: entropy.loading(t, spec['apport'], spec['perte']), duration, step, q0)
        if not all(math.isfinite(q) for _, q, _ in trajectory):
            raise ValueError('Germe local divergent : réduire pas_germes')
        locals_.append({'nom': spec['nom'], 'parametres': spec, 'n_critique': critical,
                        'temps_critique': tc, 'temps_repere_amplitude': germs.first_amplitude_time(trajectory, tc),
                        'A_initial': model.curvature(0), 'A_final': model.curvature(trajectory[-1][2]),
                        'q_final': trajectory[-1][1], 'trajectory': trajectory})
    ab = config['domaines_AB']
    wells = [tilted_well(r, ab['lambda4'], ab['v']) for r in ab['rapports_h_hc']]
    coupling = config['couplage_reciproque']
    coupled = [reciprocal(eta, coupling['perturbation'], coupling['duree'], coupling['pas']) for eta in coupling['etas']]
    params, cases, ramps, radial, tension = bubble.generate()
    for case in cases:
        stable = case['delta'] > 1
        case['kappa_locale'] = 2*(case['r_bulle']**4-1) if stable else None
        case['temps_relaxation_local'] = 1/case['kappa_locale'] if stable else None
    gravity = config['gravitation']
    clouds = [jeans(gravity['G'], gravity['rho0'], gravity['c_s'], wave,
                    gravity['D0'], gravity['vitesse_initiale'], gravity['duree'], gravity['pas'],
                    gravity['limite_lineaire']) for wave in gravity['nombres_onde']]
    t0 = finite('t0 expansion', gravity['expansion']['t0'], 0, True)
    expansion = []
    for mode, speed in [('croissant', 2*gravity['D0']/(3*t0)), ('decroissant', -gravity['D0']/t0)]:
        # Les deux solutions exactes sont monotones en amplitude ; couper
        # le mode croissant au domaine linéaire avant l’échantillonnage.
        horizon = gravity['expansion']['duree']
        grid(horizon, gravity['pas'])
        crossing = t0*((gravity['limite_lineaire']/abs(gravity['D0']))**1.5-1) if mode == 'croissant' and gravity['D0'] else None
        stop = min(horizon, crossing) if crossing is not None else horizon
        trajectory = [(t0+t, *matter_growth(t0+t, t0, gravity['D0'], speed)) for t in grid(stop, gravity['pas'])]
        expansion.append({'mode': mode, 't0': t0, 'vitesse_initiale': speed,
                          'temps_limite': t0+crossing if crossing is not None and crossing <= horizon else None,
                          'trajectory': trajectory})
    close = config['fermeture']
    shapes = [{'L': length, 'Delta_E': closure_energy(length, close['kappa'], close['epsilon'])} for length in close['longueurs']]
    rates = close['taux_illustratifs']
    closure = {'parametres': close, 'energies': shapes,
               'statut': 'Taux imposés pour illustration ; non dérivés du filament ou du plasma',
               'trajectory': [(t, closed_probability(t, rates['k_OC'], rates['k_CO'], rates['P0'])) for t in grid(rates['duree'], rates['pas'])]}
    probability = config['probabilites']
    rmax = probability['capture_uniforme_rmax']
    finite('capture_uniforme_rmax', rmax, 0, True)
    captures = [{'delta': c['delta'], 'P_capture': capture_uniform(c['r_barriere'], rmax) if c['delta'] > 1 else 0.} for c in cases]
    nucleation = probability['nucleation']
    if nucleation is not None:
        if not isinstance(nucleation, dict) or nucleation.keys() != {'Gamma', 'volume', 'duree'}:
            raise ValueError('nucleation : null ou objet avec Gamma, volume et duree')
        nucleation = dict(nucleation, P_au_moins_une=poisson_probability(nucleation['Gamma'], nucleation['volume'], nucleation['duree']),
                          statut='Taux constant fourni par l’utilisateur ; pas une prédiction du modèle de germe')
    return {'configuration': config, 'couverture': [dict(zip(('hypothese', 'statut', 'source', 'portee'), c)) for c in COVERAGE],
            'germes_reference': reference, 'germes_locaux': locals_, 'domaines_AB': wells,
            'couplage_reciproque': coupled,
            'bulles': {'parametres': params, 'cas': cases, 'accumulation': ramps, 'relaxations': radial, 'tension': tension},
            'gravitation': clouds, 'expansion_matiere': expansion, 'fermeture': closure,
            'probabilites': {'distribution_rayons': f'uniforme illustrative sur [0,{rmax}]', 'capture': captures, 'nucleation': nucleation}}


def without_trajectories(value):
    if isinstance(value, dict):
        return {key: without_trajectories(val) for key, val in value.items() if key != 'trajectory'}
    if isinstance(value, list):
        return [without_trajectories(val) for val in value]
    return value


def trajectories(result):
    for c in result['germes_reference']:
        yield 'germes_reference', c['id'], ('temps', 'q_configuration', 'n'), c['trajectory']
    for c in result['germes_locaux']:
        yield 'germes_locaux', c['nom'], ('temps', 'q_configuration', 'n'), c['trajectory']
    for c in result['couplage_reciproque']:
        yield 'couplage_reciproque', str(c['eta']), ('temps', 'x', 'y', 'energie'), c['trajectory']
    for c in result['bulles']['relaxations']:
        yield 'bulle', c['nom'], ('temps_reduit', 'rayon_reduit', 'energie_reduite'), c['trajectory']
    for c in result['gravitation']:
        yield 'jeans_statique', str(c['k_onde']), ('temps', 'D', 'vitesse_D'), c['trajectory']
    for c in result['expansion_matiere']:
        yield 'expansion_matiere', c['mode'], ('temps', 'D', 'vitesse_D'), c['trajectory']
    yield 'fermeture', 'taux_imposes', ('temps', 'P_fermee'), result['fermeture']['trajectory']


def table(headers, rows):
    def fmt(value):
        return '—' if value is None else f'{value:.6g}' if isinstance(value, float) else str(value)
    return '<table><thead><tr>'+''.join('<th>'+html.escape(str(h))+'</th>' for h in headers)+'</tr></thead><tbody>'+''.join(
        '<tr>'+''.join('<td>'+html.escape(fmt(v))+'</td>' for v in row)+'</tr>' for row in rows)+'</tbody></table>'


def report(result, destination, plots):
    sections = []
    def section(title, note, headers, rows):
        sections.append('<section><h2>'+html.escape(title)+'</h2><p>'+html.escape(note)+'</p><div class="scroll">'+table(headers, rows)+'</div></section>')
    section('Accumulation et entropie', 'Les neuf préparations historiques. Unités réduites ; le repère |q|=0,1 est distinct du seuil de stabilité.',
            ['α', 'Apport', 'n critique', 'Temps critique', 'Temps à |q|=0,1'],
            [[c[k] for k in ('alpha', 'J', 'n_critique', 'temps_critique', 'temps_repere_amplitude')] for c in result['germes_reference']])
    section('Seuils locaux', 'Chaque germe possède ses propres paramètres fixes. Des temps différents peuvent résulter du seuil ou de l’apport.',
            ['Germe', 'n critique', 'Temps critique', 'Temps à |q|=0,1', 'A final'],
            [[c[k] for k in ('nom', 'n_critique', 'temps_critique', 'temps_repere_amplitude', 'A_final')] for c in result['germes_locaux']])
    section('Domaines A/B : potentiel incliné', 'h désigne l’influence imposée, distincte de l’apport. Cette analyse statique ne simule pas la propagation causale du médiateur.',
            ['h/h critique', 'Barrière métastable', 'État'], [[c['h_sur_hc'], c['barriere_metastable'], c['statut']] for c in result['domaines_AB']])
    section('Couplage réciproque', 'Une perturbation commune explicite permet d’examiner la perte de coexistence. Aucun nouveau domaine n’est créé.',
            ['η', 'État', 'x final', 'y final'], [[c['eta'], c['statut'], c['trajectory'][-1][1], c['trajectory'][-1][2]] for c in result['couplage_reciproque']])
    section('Bulle, barrière et attracteur', 'Deux seuils : apparition des branches à δ>1 et égalité des énergies à δ=3^(3/4)/2. La barrière de formation subsiste.',
            ['δ', 'Rayon barrière', 'Rayon stationnaire', 'Énergie bulle', 'Rappel local κ', 'État'],
            [[c[k] for k in ('delta', 'r_barriere', 'r_bulle', 'f_bulle', 'kappa_locale', 'statut')] for c in result['bulles']['cas']])
    section('Accessibilité sous accumulation', 'Le temps d’atteinte d’un paramètre de contrôle ne calcule pas la nucléation. — : aucun temps fini.',
            ['Apport', 'δ plafond', 'Temps δ=1', 'Temps égalité des énergies'],
            [[c[k] for k in ('I', 'delta_plafond', 't_apparition_branches', 't_egalite_energies')] for c in result['bulles']['accumulation']])
    section('Préparations radiales', 'Relaxation à δ=1,2. Sans germe initial, aucun rayon n’apparaît dans cette équation déterministe.',
            ['Préparation', 'Rayon initial', 'Rayon final'], [[c[k] for k in ('nom', 'r_initial', 'r_final')] for c in result['bulles']['relaxations']])
    section('Sensibilité à la tension de surface', 'Poussée fixée à 3,2 ; K=100 et volume de réservoir=200π.',
            ['σ', 'δ', 'Rayon minimum'], [[c[k] for k in ('sigma', 'delta', 'R_bulle')] for c in result['bulles']['tension']])
    section('Gravitation : Jeans statique', 'D est le contraste de densité, distinct de δ. Arrêt au premier |D| atteignant la limite linéaire configurée ; G est ici en unités réduites, sans calibration.',
            ['k onde', 's²', 'Rapport de Jeans', 'Régime', 'Temps limite'],
            [[c[k] for k in ('k_onde', 's2', 'rapport_Jeans', 'regime', 'temps_limite')] for c in result['gravitation']])
    section('Fond de matière en expansion', 'Deux modes propres du fond prescrit : t^(2/3) et t^(-1). Leur vitesse initiale diffère. Ce calcul ne décrit pas le plasma relativiste proposé.',
            ['Mode', 'Vitesse initiale', 'Temps final', 'D final'], [[c['mode'], c['vitesse_initiale'], c['trajectory'][-1][0], c['trajectory'][-1][1]] for c in result['expansion_matiere']])
    section('Fermeture', 'ΔE=2π²κ/L−ε compare un segment et un cercle. La cinétique emploie séparément des taux illustratifs imposés, sans les déduire de ΔE.',
            ['Longueur', 'ΔE fermé − ouvert'], [[c['L'], c['Delta_E']] for c in result['fermeture']['energies']])
    section('Capture conditionnelle', result['probabilites']['distribution_rayons']+'. Il s’agit de germes déjà préparés ; ce n’est pas une probabilité de création.',
            ['δ', 'P capture'], [[c['delta'], c['P_capture']] for c in result['probabilites']['capture']])
    nuc = result['probabilites']['nucleation']
    sections.append('<section><h2>Nucléation</h2><p>'+('Aucun taux Γ fourni : probabilité non calculée.' if nuc is None else html.escape(str(nuc)))+'</p></section>')
    section('Couverture de l’hypothèse', 'Tous les thèmes du corpus sont recensés avec leur statut. Les mécanismes sans équations définies restent visibles comme tels.',
            ['Thème', 'Statut', 'Portée', 'Source dans output/'], [[c[k] for k in ('hypothese', 'statut', 'portee', 'source')] for c in result['couverture']])
    source_links = ''.join('<li><a href="'+html.escape((OUTPUT/c['source']).as_uri(), quote=True)+'">'+html.escape(c['hypothese'])+'</a></li>' for c in result['couverture'])
    plot_html = '<section><h2>Comparer les trajectoires</h2><img src="comparaison.png" alt="Courbes comparatives des six familles de modèles"></section>' if plots else ''
    document = '''<!doctype html><html lang="fr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Simulateur de l’hypothèse</title>
<style>body{margin:0;background:#f3f5f7;color:#182738;font:16px/1.55 system-ui,sans-serif}main{max-width:1180px;margin:auto;padding:36px 22px}h1{font-size:36px;line-height:1.15}h2{font-size:23px;margin-top:0}header{margin-bottom:32px}section{background:white;padding:24px;border:1px solid #dce2e8;border-radius:12px;margin:20px 0}table{border-collapse:collapse;width:100%;font-size:14px}th,td{text-align:left;padding:10px;border-bottom:1px solid #e2e7ed;vertical-align:top}th{background:#eef3f5}a{color:#006e78}.scroll{overflow:auto}img{width:100%;height:auto}.tag{color:#006c71;font-weight:600}p{max-width:95ch}code{font-size:14px}</style>
<main><header><span class="tag">HYPOTHÈSE · MODÈLES EXPLORATOIRES</span><h1>Du germe à la persistance</h1><p>Accumulation, interactions, bulle et gravitation : comparer les étapes calculables et suivre les questions ouvertes.</p><p>Les modèles utilisent des unités réduites et des hypothèses distinctes. Leur réunion dans ce rapport ne constitue pas une dynamique commune de création d’univers.</p><a href="resultats.json">Résultats JSON</a> · <a href="trajectoires.csv">Trajectoires CSV</a> · <a href="verification.json">Vérifications</a> · <a href="configuration_executee.json">Paramètres</a></header>'''
    document += plot_html+''.join(sections)+'<section><h2>Documents sources</h2><ul>'+source_links+'</ul></section></main></html>'
    (destination/'rapport.html').write_text(document, encoding='utf-8')


def plot(result, destination):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    fig, axes = plt.subplots(3, 2, figsize=(13, 13), layout='constrained')
    def line(ax, rows, index, label):
        ax.plot([r[0] for r in rows], [r[index] for r in rows], label=label)
    for c in result['germes_reference']:
        if c['J'] == .3:
            line(axes[0, 0], c['trajectory'], 1, f"α={c['alpha']:g}")
    axes[0, 0].set(title='Configuration à apport I=0,3', xlabel='Temps réduit', ylabel='q (configuration)')
    for c in result['bulles']['relaxations']:
        line(axes[0, 1], c['trajectory'], 1, c['nom'].replace('_', ' '))
    axes[0, 1].set(title='Bassins radiaux à δ=1,2', xlabel='Temps réduit τ', ylabel='Rayon réduit r', xlim=(0, 8))
    for c in result['couplage_reciproque']:
        rows = [(t, (x+y)/2) for t, x, y, e in c['trajectory']]
        line(axes[1, 0], rows, 1, f"η={c['eta']:.3g}")
    axes[1, 0].set(title='Perte de coexistence sous perturbation commune', xlabel='Temps réduit', ylabel='(x+y)/2')
    for c in result['gravitation']:
        line(axes[1, 1], c['trajectory'], 1, f"k={c['k_onde']:g} ; s²={c['s2']:.2g}")
    axes[1, 1].set(title='Jeans statique · arrêt à la limite linéaire', xlabel='Temps réduit', ylabel='Contraste D')
    for c in result['expansion_matiere']:
        line(axes[2, 0], c['trajectory'], 1, c['mode'])
    axes[2, 0].set(title='Fond de matière sans pression', xlabel='Temps réduit (t>0)', ylabel='Contraste D')
    line(axes[2, 1], result['fermeture']['trajectory'], 1, 'Taux imposés, non dérivés')
    axes[2, 1].set(title='Cinétique ouvert / fermé illustrative', xlabel='Temps réduit', ylabel='P fermé', ylim=(0, 1))
    for ax in axes.flat:
        ax.grid(alpha=.2)
        ax.legend(fontsize=8)
    fig.suptitle('Modèles distincts · aucune calibration cosmologique', fontsize=18)
    fig.savefig(destination/'comparaison.png', dpi=150)
    fig.savefig(destination/'comparaison.svg')
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config', type=Path, default=HERE/'configuration.json', help='Configuration complète JSON')
    parser.add_argument('--output', type=Path, default=HERE/'resultats', help='Dossier des sorties')
    parser.add_argument('--plot', action='store_true', help='Figures PNG/SVG (Matplotlib requis)')
    args = parser.parse_args()
    try:
        config = load_config(args.config)
        result = run(config)
        from verification import verify_all
        checks = verify_all(result)
        destination = args.output.resolve()
        destination.mkdir(parents=True, exist_ok=True)
        def save(name, value):
            (destination/name).write_text(json.dumps(value, ensure_ascii=False, indent=2, allow_nan=False)+'\n', encoding='utf-8')
        save('configuration_executee.json', config)
        save('verification.json', checks)
        save('resultats.json', without_trajectories(result))
        with (destination/'trajectoires.csv').open('w', newline='', encoding='utf-8') as stream:
            writer = csv.writer(stream)
            writer.writerow(['modele', 'scenario', 'temps', 'variable_1', 'valeur_1', 'variable_2', 'valeur_2', 'variable_3', 'valeur_3'])
            for model, scenario, headers, rows in trajectories(result):
                for row in rows:
                    cells = [model, scenario, row[0]]
                    for key, value in zip(headers[1:], row[1:]):
                        cells.extend([key, value])
                    writer.writerow(cells+['']*(9-len(cells)))
        source_paths = {OUTPUT/c['source'] for c in result['couverture']}
        source_paths.update([OUTPUT/'seuil-entropie'/'calcul_seuil.py', OUTPUT/'seuil-entropie'/'comparer_germes.py', OUTPUT/'plasma-bulle'/'calcul_bulle.py'])
        source_paths.update(HERE.glob('*.py'))
        source_paths.add(args.config.resolve())
        save('sources_manifest.json', [{'fichier': str(p.resolve()), 'sha256': hashlib.sha256(p.read_bytes()).hexdigest()} for p in sorted(source_paths)])
        if args.plot:
            plot(result, destination)
        report(result, destination, args.plot)
        print(f'{len(checks)} contrôles réussis. Rapport : {destination / "rapport.html"}')
    except (ValueError, OverflowError, OSError, AssertionError, ImportError) as exc:
        parser.exit(1, f'Erreur : {exc}\n')


if __name__ == '__main__':
    main()
