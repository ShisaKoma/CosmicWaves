"""Contrôles des résultats historiques et des extensions réellement exécutées."""
import math

from modeles import (tilted_well, reciprocal, reciprocal_energy, jeans_value,
                     matter_growth, closed_probability, capture_uniform, poisson_probability)


def verify_all(result):
    from simulation import entropy, germs, bubble
    checks = {}
    def check(name, error, tolerance):
        if not math.isfinite(error) or error > tolerance:
            raise AssertionError(f'{name} : erreur {error} > {tolerance}')
        checks[name] = {'erreur_max': error, 'tolerance': tolerance}

    checks.update({'historique_entropie/'+k: v for k, v in entropy.verification().items()})
    # Les références historiques sont toujours vérifiées avec leur protocole
    # exact, même si l’utilisateur demande une autre durée ou un autre pas.
    baseline = [germs.run_case(a, j, 120., .01, .05) for a in germs.ALPHAS for j in germs.INFLUXES]
    checks.update({'historique_germes/'+k: v for k, v in germs.verify(baseline, 120., .01, .05).items()})
    config = result['configuration']
    errors = []
    event_errors = []
    for case in result['germes_reference']:
        fine = germs.run_case(case['alpha'], case['J'], config['duree_germes'], config['pas_germes']/2, config['q_initial'])
        errors.append(abs(case['q_final']-fine['q_final']))
        coarse_event, fine_event = case['temps_repere_amplitude'], fine['temps_repere_amplitude']
        if (coarse_event is None) != (fine_event is None):
            raise AssertionError('Événement non convergé pour les germes configurés : réduire le pas')
        if coarse_event is not None:
            event_errors.append(abs(coarse_event-fine_event))
    check('germes_configures/convergence_pas_divise_par_deux', max(errors), 1e-6)
    check('germes_configures/convergence_evenements', max(event_errors, default=0.), 1e-4)
    b = result['bulles']
    checks.update({'historique_bulle/'+k: v for k, v in bubble.verify(b['cas'], b['accumulation'], b['relaxations']).items()})
    # Comparaison aux nombres publiés : ne pas tester uniquement un code
    # contre une copie de sa propre formule.
    targets = [(.2, .177535), (.4, .114510), (.6, .061929), (.8, .021762)]
    check('AB/table_du_corpus', max(abs(tilted_well(r)['barriere_metastable']-value) for r, value in targets), 5e-7)
    ab = result['configuration']['domaines_AB']
    residuals = []
    for well in result['domaines_AB']:
        for root in well['extrema']:
            phi = root['phi']
            scale = max(1., abs(well['h']), ab['lambda4']*abs(phi)**3)
            residuals.append(abs(ab['lambda4']*phi*(phi*phi-ab['v']**2)-well['h'])/scale)
    check('AB/racines_configurees', max(residuals), 1e-10)
    derivatives = []
    for ratio in (.2, .4, .6, .8):
        current = tilted_well(ratio)
        eps = 1e-5
        derivative = (tilted_well(ratio+eps)['barriere_metastable']-tilted_well(ratio-eps)['barriere_metastable'])/(2*eps*current['h_critique'])
        derivatives.append(abs(derivative-(current['extrema'][0]['phi']-current['extrema'][1]['phi'])))
    check('AB/derivee_barriere', max(derivatives), 1e-8)
    check('AB/symetrie_inclinaison', max(abs(tilted_well(r)['barriere_metastable']-tilted_well(-r)['barriere_metastable']) for r in (.2, .4, .8)), 1e-12)
    differences, increases = [], []
    c = result['configuration']['couplage_reciproque']
    for case in result['couplage_reciproque']:
        fine = reciprocal(case['eta'], c['perturbation'], c['duree'], c['pas']/2)
        differences.extend(abs(a-b) for a, b in zip(case['trajectory'][-1][1:3], fine['trajectory'][-1][1:3]))
        increases.extend(max(0., b[3]-a[3]) for a, b in zip(case['trajectory'], case['trajectory'][1:]))
    check('reciproque/convergence_pas_divise_par_deux', max(differences), 1e-6)
    check('reciproque/dissipation', max(increases), 1e-10)
    reference = reciprocal_energy(1/math.sqrt(3), -1/math.sqrt(3), 1/3)
    errors = []
    for s in (.01, .03, .1):
        d = math.sqrt(1/3-3*s*s)
        difference = reciprocal_energy(s+d, s-d, 1/3)-reference
        if difference >= 0:
            raise AssertionError('Le seuil réciproque ne doit pas être un minimum')
        errors.append(abs(difference+4*s**4))
    check('reciproque/seuil_ordre_quatre', max(errors), 1e-12)
    local_errors = []
    for case in result['germes_locaux']:
        spec = case['parametres']
        model = entropy.Model(**{k: spec[k] for k in ('k', 'g', 'b', 'modes', 'temperature', 'alpha', 'mobility')})
        finer = entropy.integrate_drift(model, lambda t: entropy.loading(t, spec['apport'], spec['perte']), config['duree_germes'], config['pas_germes']/2, config['q_initial'])
        local_errors.append(abs(case['q_final']-finer[-1][1]))
    check('germes_locaux/convergence_pas_divise_par_deux', max(local_errors), 1e-6)
    check('bulle/rappel_local_corpus', abs(next(c for c in b['cas'] if c['delta'] == 1.2)['kappa_locale']-5.243392), 5e-7)
    # Différences finies indépendantes pour les deux équations de gravitation.
    errors = []
    eps = 1e-4
    for s2 in (-3., 0., .75):
        for t in (.2, 1., 2.):
            d, _ = jeans_value(t, s2, .001, .002)
            acceleration = (jeans_value(t+eps, s2, .001, .002)[1]-jeans_value(t-eps, s2, .001, .002)[1])/(2*eps)
            errors.append(abs(acceleration-s2*d))
    check('Jeans/equation_differentielle', max(errors), 1e-9)
    linear = config['gravitation']['limite_lineaire']
    check('Jeans/domaine_lineaire', max(max(0., abs(row[1])-linear) for c in result['gravitation'] for row in c['trajectory']), 1e-12)
    event_errors = [abs(abs(c['trajectory'][-1][1])-linear) for c in result['gravitation'] if c['temps_limite'] is not None]
    check('Jeans/premier_passage_limite', max(event_errors, default=0.), 1e-12)
    errors = []
    for t in (1., 2., 5.):
        d, speed = matter_growth(t, 1., .01, .003)
        acceleration = (matter_growth(t+eps, 1., .01, .003)[1]-matter_growth(t-eps, 1., .01, .003)[1])/(2*eps)
        errors.append(abs(acceleration+4*speed/(3*t)-2*d/(3*t*t)))
    check('expansion/equation_differentielle', max(errors), 1e-9)
    check('fermeture/equation_maitresse', abs((closed_probability(2+eps, .3, .1)-closed_probability(2-eps, .3, .1))/(2*eps)-(.3-.4*closed_probability(2, .3, .1))), 1e-9)
    check('probabilites/capture_uniforme', abs(capture_uniform(.5, 2)-.75), 1e-14)
    check('probabilites/Poisson', abs(poisson_probability(.2, 3, 2)-(1-math.exp(-1.2))), 1e-14)
    return checks
