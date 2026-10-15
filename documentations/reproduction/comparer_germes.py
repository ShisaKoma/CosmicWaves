#!/usr/bin/env python3
"""Comparer neuf germes indépendants dans le modèle exploratoire existant.

    python3 comparer_germes.py
    python3 comparer_germes.py --plot  # matplotlib requis pour PNG/SVG

Le calcul et ses contrôles utilisent seulement la bibliothèque standard.
Les sorties sont écrites à côté du script ; aucune donnée observée n'est utilisée.
"""
import argparse
import csv
import json
import math
from pathlib import Path

from calcul_seuil import Model, integrate_drift, loading, threshold_time


INFLUXES = (0.1, 0.2, 0.3)
ALPHAS = (-0.4, 0.0, 0.4)
LOSS = 0.2
N0 = 0.0
AMPLITUDE_MARKER = 0.1  # Repère de lecture arbitraire, pas un seuil physique.


def first_amplitude_time(trajectory, critical_time):
    """Premier passage montant à |q|=0,1 après le temps critique, interpolé."""
    if critical_time is None:
        return None
    for (t0, q0, _), (t1, q1, _) in zip(trajectory, trajectory[1:]):
        if abs(q0) < AMPLITUDE_MARKER <= abs(q1):
            t = t0 + (t1 - t0) * (AMPLITUDE_MARKER - abs(q0)) / (abs(q1) - abs(q0))
            if t >= critical_time:
                return t
    return None


def run_case(alpha, influx, duration, step, q0):
    model = Model(alpha=alpha)
    nc = model.critical_loading()
    tc = threshold_time(nc, influx, LOSS, N0)
    trajectory = integrate_drift(
        model, lambda t: loading(t, influx, LOSS, N0),
        final_time=duration, step=step, q0=q0,
    )
    tr = first_amplitude_time(trajectory, tc)
    return {
        'id': f'alpha_{alpha:+.1f}_J_{influx:.1f}',
        'alpha': alpha, 'J': influx, 'n_infini': influx / LOSS,
        'n_critique': nc, 'temps_critique': tc,
        'seuil_franchi_avant_fin': tc is not None and tc < duration,
        'temps_repere_amplitude': tr,
        'delai_apres_seuil': None if tr is None else tr - tc,
        'q_final': trajectory[-1][1],
        'A_final': model.curvature(trajectory[-1][2]),
        'trajectory': trajectory,
    }


def verify(cases, duration, step, q0):
    """Convergence des trajectoires/événements et contrôles des cas limites."""
    checks = {}
    def check(name, error, tolerance):
        if not math.isfinite(error) or error > tolerance:
            raise AssertionError(f'{name}: {error} > {tolerance}')
        checks[name] = {'erreur_max': error, 'tolerance': tolerance}

    trajectory_error = 0.0
    event_error = 0.0
    critical_error = 0.0
    for case in cases:
        finer = run_case(case['alpha'], case['J'], duration, step / 2, q0)
        # Le nombre de pas est choisi pair et exactement doublé dans main.
        assert len(finer['trajectory']) == 2 * len(case['trajectory']) - 1
        trajectory_error = max(trajectory_error, max(
            abs(a[1] - b[1])
            for a, b in zip(case['trajectory'], finer['trajectory'][::2])
        ))
        ta, tb = case['temps_repere_amplitude'], finer['temps_repere_amplitude']
        assert (ta is None) == (tb is None), 'Événement non convergé'
        if ta is not None:
            event_error = max(event_error, abs(ta - tb))
        tc = case['temps_critique']
        if tc is not None:
            critical_error = max(critical_error, abs(
                loading(tc, case['J'], LOSS, N0) - case['n_critique']))
        if not all(math.isfinite(q) for _, q, _ in case['trajectory']):
            raise AssertionError('Trajectoire non finie')

    check('trajectoires_pas_divise_par_deux', trajectory_error, 1e-7)
    check('temps_repere_pas_divise_par_deux', event_error, 1e-4)
    check('temps_critique_solution_analytique', critical_error, 1e-12)
    assert threshold_time(1.0, 0.2, LOSS) is None  # Égalité seulement asymptotique.
    assert threshold_time(1.0, 0.1, LOSS) is None  # Apport insuffisant.
    checks['plafond_inferieur_ou_egal_au_seuil'] = {'statut': 'OK'}

    model = Model(alpha=0.0)
    n_of_t = lambda t: loading(t, 0.3, LOSS)
    zero = integrate_drift(model, n_of_t, duration, step, 0.0)
    check('etat_exactement_nul_reste_nul_sans_bruit', max(abs(q) for _, q, _ in zero), 0.0)
    negative = integrate_drift(model, n_of_t, duration, step, -q0)
    positive = next(c for c in cases if c['alpha'] == 0 and c['J'] == 0.3)['trajectory']
    check('symetrie_des_perturbations_initiales', max(
        abs(a[1] + b[1]) for a, b in zip(negative, positive)), 1e-12)
    return checks


def number(value, digits=3):
    return '—' if value is None else f'{value:.{digits}f}'


def plot_cases(cases, destination, duration):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt

    plt.rcParams.update({'font.size': 10, 'axes.spines.top': False, 'axes.spines.right': False})
    fig, axes = plt.subplots(2, 2, figsize=(12, 8), sharex=True)
    colors = ('#007c83', '#b76800', '#7e4ab5')
    for col, selected in enumerate((
        [c for c in cases if c['alpha'] == 0],
        [c for c in cases if c['J'] == 0.3],
    )):
        for color, case in zip(colors, selected):
            t, q, n = zip(*case['trajectory'])
            model = Model(alpha=case['alpha'])
            label = f"J = {case['J']:.1f}" if col == 0 else f"α = {case['alpha']:+.1f}"
            axes[0, col].plot(t, [model.curvature(x) for x in n], color=color, label=label, lw=2)
            axes[1, col].plot(t, [abs(x) for x in q], color=color, label=label, lw=2)
            tc = case['temps_critique']
            if tc is not None and tc < duration:
                for row in (0, 1):
                    axes[row, col].axvline(tc, color=color, ls=':', alpha=0.5)
        axes[0, col].axhline(0, color='#444444', lw=1, ls='--')
        axes[1, col].axhline(AMPLITUDE_MARKER, color='#444444', lw=1, ls='--')
        axes[0, col].legend(loc='upper right')
        axes[1, col].set_xlabel('Temps (unités arbitraires)')
        for row in (0, 1):
            axes[row, col].grid(alpha=0.16)
            axes[row, col].set_xlim(0, duration)
    axes[0, 0].set_title('Même seuil, apports différents (α = 0)')
    axes[0, 1].set_title('Même apport, contribution entropique différente (J = 0,3)')
    axes[0, 0].set_ylabel('Courbure A : q = 0 instable si A < 0')
    axes[1, 0].set_ylabel('Amplitude de configuration |q|')
    axes[1, 0].set_ylim(0, 1.02)
    axes[1, 1].set_ylim(0, 1.02)
    fig.suptitle('Comparer des germes indépendants — modèle exploratoire', fontsize=16, y=0.98)
    fig.text(0.5, 0.025,
             'Pointillés verticaux : temps critique. Repère |q| = 0,1 arbitraire.\n'
             'Dérive sans bruit ; q initial = 0,05. Aucune fermeture de corde ni naissance d’univers simulée.',
             ha='center', fontsize=10, color='#444444')
    fig.tight_layout(rect=(0, 0.075, 1, 0.95))
    fig.savefig(destination / 'comparaison_germes.png', dpi=180)
    fig.savefig(destination / 'comparaison_germes.svg')
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plot', action='store_true', help='Produire PNG et SVG avec matplotlib')
    args = parser.parse_args()
    duration, step, q0 = 120.0, 0.01, 0.05
    cases = [run_case(a, j, duration, step, q0) for a in ALPHAS for j in INFLUXES]
    checks = verify(cases, duration, step, q0)
    destination = Path(__file__).resolve().parent
    metadata = {
        'statut': 'Modèle exploratoire sans calibration physique ; germes indépendants, dérive sans bruit.',
        'unites': 'q,n sans dimension ; énergies et temps en unités arbitraires ; k_B=1.',
        'parametres_base': Model().__dict__,
        'parametres_simulation': {'duree': duration, 'pas': step, 'q0': q0, 'n0': N0,
                                 'perte': LOSS, 'repere_amplitude': AMPLITUDE_MARKER},
        'verifications': checks,
        'cas': [{k: v for k, v in c.items() if k != 'trajectory'} for c in cases],
    }
    (destination / 'comparaison_germes.json').write_text(
        json.dumps(metadata, ensure_ascii=False, indent=2, allow_nan=False) + '\n', encoding='utf-8')
    with (destination / 'comparaison_germes_trajectoires.csv').open('w', newline='', encoding='utf-8') as stream:
        writer = csv.writer(stream)
        writer.writerow(['germe', 'alpha', 'J', 'temps', 'n', 'q', 'A', 'Delta_S_interne_sur_kB'])
        for case in cases:
            model = Model(alpha=case['alpha'])
            for t, q, n in case['trajectory'][::10]:
                writer.writerow([case['id'], case['alpha'], case['J'], t, n, q,
                                 model.curvature(n), model.entropy_difference(q)])

    lines = [
        '# Comparaison de neuf germes indépendants', '',
        'Simulation exploratoire, sans données observées ni calibration cosmologique.', '',
        '## Protocole', '',
        'On croise J = 0,1 ; 0,2 ; 0,3 avec alpha = −0,4 ; 0 ; +0,4. '
        'Chaque germe a k = g = b = mobilité = 1, N = 10 modes internes, k_B T = 0,1, '
        'n initial = 0, q initial = 0,05 et un taux de perte lambda = 0,2. '
        'Durée : 120 ; pas RK4 : 0,01 ; unités arbitraires.', '',
        'Lois : dn/dt = J − lambda n ; A = k − g n + N alpha k_B T ; '
        'dq/dt = −mobilité × (A q + b q³). La solution analytique de n(t) alimente le calcul de q.', '',
        'Le temps critique correspond à A = 0. Le minimum quartique est encore stable à cet instant ; '
        'q = 0 devient instable pour A < 0. Le repère |q| = 0,1 indique seulement une amplitude lisible : '
        'il ne définit aucune fermeture, particule ou naissance d’univers.', '',
        '## Résultats', '',
        '| alpha | J | plafond n | seuil n | temps critique | temps à amplitude 0,1 | délai après seuil |',
        '|---:|---:|---:|---:|---:|---:|---:|',
    ]
    for c in cases:
        lines.append(f"| {c['alpha']:+.1f} | {c['J']:.1f} | {c['n_infini']:.2f} | "
                     f"{c['n_critique']:.2f} | {number(c['temps_critique'])} | "
                     f"{number(c['temps_repere_amplitude'])} | {number(c['delai_apres_seuil'])} |")
    lines += [
        '', 'Un tiret dans « temps critique » signifie que le seuil ne peut pas être dépassé en temps fini '
        'sous ces apports constants. Un tiret dans « temps à amplitude » signifie que ce passage montant '
        'n’a pas été observé pendant les 120 unités simulées.', '',
        '## Interprétation et limites', '',
        '- À alpha fixé, les apports changent l’accessibilité et le temps du seuil, sans changer sa valeur.',
        '- À J fixé, alpha change la contribution entropique et donc le seuil. '
        'Cela compare des lois de couplage différentes, pas une mesure de « quantité d’information accumulée ».',
        '- Le retard de croissance dépend de la dynamique, du germe initial q et du repère choisi. '
        'q diminue avant le seuil ; son amplification ultérieure peut prendre du temps.',
        '- Si q initial vaut exactement zéro, il reste nul dans cette équation sans bruit, même après '
        'la perte de stabilité. La perturbation initiale est donc explicite. À température finie, une '
        'simulation de trajectoires thermiques demanderait aussi un bruit cohérent avec la dissipation.',
        '- Le terme entropique est déjà inclus dans A ; le bruit thermique n’est pas simulé. '
        'Delta S interne est une entropie conditionnelle, pas l’entropie totale du germe et de son environnement.',
        '- Les neuf cas sont choisis pour comparer des mécanismes : la fraction qui franchit le seuil '
        'n’est pas une probabilité physique d’émergence. Une telle estimation demanderait une distribution '
        'justifiée des paramètres et une définition physique de l’événement.',
        '- Aucun échange entre germes, changement de dimension spatiale, fermeture topologique, '
        'champ gravitationnel ou modèle d’observation terrestre n’est ajouté.', '',
        '## Vérification', '',
    ]
    for name, result in checks.items():
        lines.append(f'- {name} : {result}.')
    lines += ['', '## Reproduire', '',
              '`python3 comparer_germes.py` depuis ce dossier. Ajouter `--plot` si matplotlib est installé.', '',
              'Le script écrit le tableau Markdown, les paramètres et contrôles JSON, et les trajectoires CSV '
              '(un échantillon toutes les 0,1 unités ; calcul interne toutes les 0,01 unités). '
              'Avec `--plot`, il produit aussi une figure PNG et sa version vectorielle SVG.', '']
    if args.plot:
        plot_cases(cases, destination, duration)
        lines += ['![Comparaison des germes](comparaison_germes.png)', '']
    (destination / 'comparaison_germes.md').write_text('\n'.join(lines), encoding='utf-8')
    print('\n'.join(lines[:lines.index('## Interprétation et limites')]))
    print(f'{len(checks)} contrôles réussis. Résultats : {destination}')


if __name__ == '__main__':
    main()
