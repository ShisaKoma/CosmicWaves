#!/usr/bin/env python3
"""Modèle hypothétique classique : accumulation, stabilité et entropie.

Python 3, bibliothèque standard uniquement. Exécution :
    python3 calcul_seuil.py
Les fichiers de résultats sont écrits à côté du script.
Unités réduites : k_B = 1, échelle d'énergie et de temps arbitraires.
Ce programme ne simule ni la gravitation ni des cordes fondamentales.
"""
from dataclasses import dataclass, replace
from pathlib import Path
import json
import math


@dataclass(frozen=True)
class Model:
    k: float = 1.0
    g: float = 1.0
    b: float = 1.0
    c0: float = 1.0
    modes: int = 10
    temperature: float = 0.1  # k_B T dans les unités d'énergie choisies
    alpha: float = 0.0
    mobility: float = 1.0

    def curvature(self, n):
        return self.k - self.g * n + self.modes * self.alpha * self.temperature

    def critical_loading(self):
        if self.g <= 0:
            raise ValueError("Cette formule suppose un couplage déstabilisant g > 0.")
        return (self.k + self.modes * self.alpha * self.temperature) / self.g

    def bare_energy(self, q, n):
        return 0.5 * (self.k - self.g * n) * q*q + 0.25 * self.b * q**4

    def free_energy(self, q, n):
        # Différence F(q,n,T) - F(0,n,T), sans constante dépendant de T.
        return 0.5 * self.curvature(n) * q*q + 0.25 * self.b * q**4

    def entropy_difference(self, q):
        # Différence d'entropie conditionnelle des y, en unités de k_B.
        return -0.5 * self.modes * self.alpha * q*q

    def drift(self, q, n):
        return -self.mobility * (self.curvature(n) * q + self.b * q**3)


def simpson(f, low, high, intervals=4096):
    if intervals % 2:
        raise ValueError("Nombre pair d'intervalles nécessaire.")
    step = (high-low) / intervals
    odds = math.fsum(f(low+i*step) for i in range(1, intervals, 2))
    evens = math.fsum(f(low+i*step) for i in range(2, intervals, 2))
    return step / 3 * (f(low) + f(high) + 4*odds + 2*evens)


def gaussian_partition(model, q):
    stiffness = model.c0 * math.exp(model.alpha * q*q)
    width = math.sqrt(model.temperature / stiffness)
    return simpson(lambda y: math.exp(-stiffness*y*y/(2*model.temperature)),
                   -12*width, 12*width)


def free_energy_from_integral(model, q, n):
    zq, z0 = gaussian_partition(model, q), gaussian_partition(model, 0.0)
    return model.bare_energy(q, n) - model.temperature * model.modes * math.log(zq/z0)


def thermal_moments(model, n, bound=8.0, intervals=8192):
    """Moyennes canoniques exactes par quadrature de la variable q finie."""
    a = model.curvature(n)
    minimum = -(a*a) / (4*model.b) if a < 0 else 0.0
    def weight(q):
        return math.exp(-(model.free_energy(q, n)-minimum)/model.temperature)
    z = simpson(weight, -bound, bound, intervals)
    return {
        "q_mean": simpson(lambda q: q*weight(q), -bound, bound, intervals)/z,
        "q2_mean": simpson(lambda q: q*q*weight(q), -bound, bound, intervals)/z,
        "q_abs_mean": simpson(lambda q: abs(q)*weight(q), -bound, bound, intervals)/z,
        "edge_relative_weight": max(weight(-bound), weight(bound)),
    }


def loading(t, influx, loss, n0=0.0):
    if loss <= 0:
        raise ValueError("Cet exemple suppose loss > 0.")
    return n0*math.exp(-loss*t) + influx/loss * (-math.expm1(-loss*t))


def threshold_time(critical, influx, loss, n0=0.0):
    if critical <= n0:
        return 0.0
    ceiling = influx/loss
    if ceiling <= critical:
        return None  # Jamais en temps fini, y compris l'égalité asymptotique.
    return math.log((ceiling-n0)/(ceiling-critical))/loss


def integrate_drift(model, n_of_t, final_time=20.0, step=0.01, q0=0.2):
    """RK4 de la dérive déterministe : aucun bruit thermique simulé ici."""
    count = math.ceil(final_time/step)
    h = final_time/count
    q = q0
    result = [(0.0, q, n_of_t(0.0))]
    for i in range(count):
        t = i*h
        k1 = model.drift(q, n_of_t(t))
        k2 = model.drift(q+h*k1/2, n_of_t(t+h/2))
        k3 = model.drift(q+h*k2/2, n_of_t(t+h/2))
        k4 = model.drift(q+h*k3, n_of_t(t+h))
        q += h*(k1+2*k2+2*k3+k4)/6
        result.append(((i+1)*h, q, n_of_t((i+1)*h)))
    return result


def exact_drift(model, n, t, q0):
    a = model.curvature(n)
    if abs(a) < 1e-14:
        return q0 / math.sqrt(1 + 2*model.mobility*model.b*q0*q0*t)
    factor = math.exp(-2*model.mobility*a*t)
    q2 = q0*q0*factor / (1 + model.b*q0*q0/a*(1-factor))
    return math.copysign(math.sqrt(q2), q0)


def verification():
    errors = {}
    def check(name, error, tolerance):
        if not math.isfinite(error) or error > tolerance:
            raise AssertionError(f"{name}: erreur {error}, tolérance {tolerance}")
        errors[name] = {"erreur_max": error, "tolerance": tolerance}

    models = [Model(alpha=x) for x in (-0.4, 0.0, 0.4)]
    check("integration_des_modes_internes", max(
        abs(free_energy_from_integral(m, q, 1.2)-m.free_energy(q, 1.2))
        for m in models for q in (0.3, 1.0, 1.5)), 1e-10)

    delta = 1e-5
    entropy_error = []
    for m in models:
        for q in (0.3, 1.0):
            fp = free_energy_from_integral(replace(m, temperature=m.temperature+delta), q, 1.2)
            fm = free_energy_from_integral(replace(m, temperature=m.temperature-delta), q, 1.2)
            entropy_error.append(abs(-(fp-fm)/(2*delta)-m.entropy_difference(q)))
    check("entropie_par_derivee_thermique_independante", max(entropy_error), 1e-8)

    check("courbure_au_seuil", max(abs(m.curvature(m.critical_loading())) for m in models), 1e-12)
    for m in models:
        assert m.curvature(m.critical_loading()-0.1) > 0
        assert m.curvature(m.critical_loading()+0.1) < 0

    drift_errors, refinement_errors, dissipation_errors = [], [], []
    for m in models:
        for offset in (-0.2, 0.0, 0.2):
            n = m.critical_loading()+offset
            samples = integrate_drift(m, lambda t: n)
            finer = integrate_drift(m, lambda t: n, step=0.005)
            drift_errors.extend(abs(q-exact_drift(m,n,t,0.2)) for t,q,_ in samples)
            refinement_errors.append(abs(samples[-1][1]-finer[-1][1]))
            energies = [m.free_energy(q,n) for _,q,_ in samples]
            dissipation_errors.extend(max(0.0,b-a) for a,b in zip(energies,energies[1:]))
    check("relaxation_RK4_contre_solution_exacte", max(drift_errors), 1e-8)
    check("convergence_pas_divise_par_deux", max(refinement_errors), 1e-8)
    check("energie_libre_decroissante_parametres_fixes", max(dissipation_errors), 1e-12)

    m = Model()
    critical = m.critical_loading()
    numeric = thermal_moments(m, critical)
    exact_q2 = math.sqrt(4*m.temperature/m.b)*math.gamma(0.75)/math.gamma(0.25)
    check("fluctuations_au_seuil_contre_solution_exacte", abs(numeric['q2_mean']-exact_q2), 1e-9)
    alternate = thermal_moments(m, critical, bound=10, intervals=16384)
    check("convergence_quadrature", abs(numeric['q2_mean']-alternate['q2_mean']), 1e-9)
    check("symetrie_moyenne_signee", abs(numeric['q_mean']), 1e-12)
    assert threshold_time(1.0, 0.1, 0.2) is None
    assert threshold_time(1.0, 0.2, 0.2) is None
    t = threshold_time(1.0, 0.3, 0.2)
    check("temps_atteinte_accumulation", abs(loading(t,0.3,0.2)-1), 1e-12)
    return errors


def main():
    checks = verification()
    cases = []
    ramps = []
    for alpha in (-0.4, 0.0, 0.4):
        model = Model(alpha=alpha)
        nc = model.critical_loading()
        cases.append({
            "alpha": alpha, "n_critique": nc,
            "temps_atteinte_critique_J_0_3_perte_0_2": threshold_time(nc,0.3,0.2),
            "courbure_n_1_2": model.curvature(1.2),
            "amplitude_modes_n_1_2": math.sqrt(max(0.0,-model.curvature(1.2))/model.b),
            "moments_thermiques_n_1_2": thermal_moments(model,1.2),
            "accessibilite_par_apport": {
                str(j): threshold_time(nc,j,0.2) for j in (0.1,0.2,0.3,0.4)
            },
        })
        trajectory = integrate_drift(model, lambda t: loading(t,0.3,0.2),
                                     final_time=120,step=0.01,q0=0.05)
        ramps.append({"alpha": alpha,
                      "colonnes": ["temps", "q_deterministe", "n"],
                      "trajectoire": [[round(v,9) for v in row] for row in trajectory[::20]]})
    data = {
        "statut": "Modele hypothetique classique isotherme; aucune prediction cosmologique.",
        "unites": "q,n sans dimension; k_B=1; energie et temps arbitraires",
        "parametres_communs": Model().__dict__,
        "accumulation": {"n0":0,"J":0.3,"perte":0.2},
        "verifications":checks,"cas":cases,"rampes_deterministes":ramps,
    }
    destination = Path(__file__).resolve().parent
    (destination/'resultats.json').write_text(json.dumps(data,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    lines = ["# Résultats calculés", "", "Modèle hypothétique, unités réduites.", "",
             "| alpha | n critique | temps critique | courbure à n=1,2 | moyenne q² à n=1,2 |",
             "|---:|---:|---:|---:|---:|"]
    for case in cases:
        lines.append(f"| {case['alpha']:+.1f} | {case['n_critique']:.3f} | "
                     f"{case['temps_atteinte_critique_J_0_3_perte_0_2']:.6f} | "
                     f"{case['courbure_n_1_2']:+.3f} | "
                     f"{case['moments_thermiques_n_1_2']['q2_mean']:.6f} |")
    lines += ["", "Tous les contrôles suivants sont passés :", ""]
    for name, result in checks.items():
        lines.append(f"- {name} : erreur {result['erreur_max']:.3g}, tolérance {result['tolerance']:.3g}.")
    lines += ["", "Les rampes calculent seulement la dérive sans bruit. Les moments proviennent séparément de la distribution canonique à paramètres fixes.",
              "Le temps critique est un changement de courbure, pas un temps de naissance d'univers.", ""]
    (destination/'resultats.md').write_text('\n'.join(lines))
    print('\n'.join(lines))


if __name__ == '__main__':
    main()
