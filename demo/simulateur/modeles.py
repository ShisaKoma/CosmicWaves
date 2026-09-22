"""Extensions des équations du corpus, sans couplage physique implicite.

Les unités sont celles, réduites, des notes. Les taux de fermeture et de
nucléation sont des entrées éventuelles, jamais déduits d'une stabilité locale.
"""
import math


def finite(name, value, minimum=None, strict=False):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        raise ValueError(f'{name} doit être un nombre fini')
    if minimum is not None and (value <= minimum if strict else value < minimum):
        raise ValueError(f'{name} doit être {">" if strict else ">="} {minimum}')
    return value


def grid(duration, step):
    finite('durée', duration, 0, True)
    finite('pas', step, 0, True)
    count = math.ceil(duration / step)
    if count > 200000:
        raise ValueError('Plus de 200 000 pas par trajectoire : augmenter le pas ou réduire la durée')
    return [duration * i / count for i in range(count + 1)]


def rk4(fun, initial, duration, step):
    times = grid(duration, step)
    state = tuple(initial)
    result = [(0., *state)]
    for t0, t1 in zip(times, times[1:]):
        h = t1 - t0
        try:
            a = fun(t0, state)
            b = fun(t0+h/2, tuple(x+h*k/2 for x, k in zip(state, a)))
            c = fun(t0+h/2, tuple(x+h*k/2 for x, k in zip(state, b)))
            d = fun(t1, tuple(x+h*k for x, k in zip(state, c)))
            state = tuple(x+h*(ka+2*kb+2*kc+kd)/6 for x, ka, kb, kc, kd in zip(state, a, b, c, d))
        except OverflowError as exc:
            raise ValueError('Intégration divergente : réduire le pas ou les amplitudes') from exc
        if not all(math.isfinite(x) for x in state):
            raise ValueError('Intégration non finie : réduire le pas')
        result.append((t1, *state))
    return result


def bisect(fun, low, high):
    if fun(low) == 0:
        return low
    if fun(high) == 0:
        return high
    if fun(low)*fun(high) > 0:
        raise ValueError('Racine non encadrée')
    for _ in range(80):
        middle = (low+high)/2
        if fun(low)*fun(middle) <= 0:
            high = middle
        else:
            low = middle
    return (low+high)/2


def tilted_well(ratio, quartic=1., v=1.):
    """h/hc signé ; les barrières restent des densités si V en est une."""
    finite('h/hc', ratio)
    finite('lambda4', quartic, 0, True)
    finite('v', v, 0, True)
    hc = 2*quartic*v**3/(3*math.sqrt(3))
    j = ratio*2/(3*math.sqrt(3))
    u = lambda x: (x*x-1)**2/4-j*x
    if abs(ratio) < 1:
        theta = math.acos(ratio)/3
        roots = sorted(2/math.sqrt(3)*math.cos(theta-2*math.pi*k/3) for k in range(3))
        status = 'minima dégénérés' if ratio == 0 else 'deux minima, dont un métastable'
        meta = roots[0] if ratio >= 0 else roots[-1]
        barrier = quartic*v**4*(u(roots[1])-u(meta))
    elif abs(ratio) == 1:
        sign = math.copysign(1, ratio)
        roots = sorted([-sign/math.sqrt(3), 2*sign/math.sqrt(3)])
        status, barrier = 'seuil : point dégénéré et un minimum', 0.
    else:
        upper = max(2., abs(j)+2)
        roots = [bisect(lambda x: x**3-x-j, -upper, upper)]
        status, barrier = 'un seul minimum', None
    return {'h_sur_hc': ratio, 'h_critique': hc, 'h': ratio*hc,
            'extrema': [{'phi': v*x, 'V': quartic*v**4*u(x),
                         'courbure': quartic*v*v*(3*x*x-1)} for x in roots],
            'barriere_metastable': barrier, 'statut': status}


def reciprocal_energy(x, y, eta):
    return ((x*x-1)**2+(y*y-1)**2)/4+eta*(x-y)**2/2


def reciprocal(eta, perturbation=.01, duration=30., step=.01):
    finite('eta', eta, 0)
    finite('perturbation commune', perturbation)
    q = math.sqrt(1-2*eta) if eta < .5 else None
    if eta < 1/3:
        status = 'coexistence opposée stable'
    elif eta == 1/3:
        status = 'seuil : coexistence non minimale à l’ordre quatre'
    elif eta < .5:
        status = 'coexistence opposée instable (selle)'
    else:
        status = 'aucune branche opposée non nulle'
    initial = (q+perturbation, -q+perturbation) if q is not None else (perturbation, perturbation)
    def drift(t, state):
        x, y = state
        return (-x*(x*x-1)-eta*(x-y), -y*(y*y-1)-eta*(y-x))
    trajectory = rk4(drift, initial, duration, step)
    return {'eta': eta, 'q_oppose': q, 'statut': status,
            'valeurs_propres_opposees': [2-6*eta, 2-4*eta] if q is not None else None,
            'valeurs_propres_communes': [2., 2+2*eta],
            'perturbation_commune': perturbation,
            'trajectory': [(t, x, y, reciprocal_energy(x, y, eta)) for t, x, y in trajectory]}


def jeans_value(t, s2, d0, velocity):
    if s2 > 0:
        s = math.sqrt(s2)
        cp, cm = (d0+velocity/s)/2, (d0-velocity/s)/2
        # Ne pas calculer exp(st) pour un mode croissant exactement absent.
        growing = cp*math.exp(s*t) if cp else 0.
        decaying = cm*math.exp(-s*t)
        return growing+decaying, s*(growing-decaying)
    if s2 < 0:
        w = math.sqrt(-s2)
        return (d0*math.cos(w*t)+velocity*math.sin(w*t)/w,
                -d0*w*math.sin(w*t)+velocity*math.cos(w*t))
    return d0+velocity*t, velocity


def jeans(G, rho, sound, wave, d0=.001, velocity=0., duration=10., step=.02, limit=.1):
    for name, value in [('G', G), ('rho', rho), ('c_s', sound), ('k_onde', wave)]:
        finite(name, value, 0)
    finite('D0', d0)
    finite('vitesse D0', velocity)
    finite('limite linéaire', limit, 0, True)
    if limit > .1 or abs(d0) >= limit:
        raise ValueError('Choisir |D0| < limite <= 0,1 pour le domaine linéaire')
    s2 = 4*math.pi*G*rho-sound**2*wave**2
    pressure = sound**2*wave**2
    times = grid(duration, step)
    # Résoudre les franchissements avant l’échantillonnage : aucun événement
    # n’est manqué, même pour une oscillation plus rapide que le pas demandé.
    event = None
    if s2 > 0:
        s = math.sqrt(s2)
        cp, cm = (d0+velocity/s)/2, (d0-velocity/s)/2
        candidates = []
        for target in (-limit, limit):
            # D=cp*z+cm/z, z=exp(st) ; racines quadratiques stables.
            if cp == 0:
                roots = [cm/target]
            else:
                disc = target*target-4*cp*cm
                if disc < 0:
                    continue
                numerator = (target+math.copysign(math.sqrt(disc), target))/2
                roots = [numerator/cp, cm/numerator] if numerator else []
            candidates.extend(math.log(z)/s for z in roots if z > 1)
        event = min(candidates, default=None)
    elif s2 == 0 and velocity:
        event = (math.copysign(limit, velocity)-d0)/velocity
    elif s2 < 0:
        w = math.sqrt(-s2)
        amplitude = math.hypot(d0, velocity/w)
        if amplitude >= limit:
            phase = math.atan2(velocity/w, d0)
            candidates = []
            for target in (-limit, limit):
                angle = math.acos(max(-1., min(1., target/amplitude)))
                for sign in (-1, 1):
                    candidates.append(((phase+sign*angle) % (2*math.pi))/w)
            event = min(t for t in candidates if t > 0)
    stop = min(duration, event) if event is not None else duration
    sampled = [t for t in times if t < stop]+[stop]
    trajectory = [(t, *jeans_value(t, s2, d0, velocity)) for t in sampled]
    return {'G': G, 'rho0': rho, 'c_s': sound, 'k_onde': wave,
            's2': s2, 'rapport_Jeans': 4*math.pi*G*rho/pressure if pressure else None,
            'regime': 'mode exponentiel possible' if s2 > 0 else ('oscillations' if s2 < 0 else 'marginal : D affine'),
            'coefficient_croissant': (d0+velocity/math.sqrt(s2))/2 if s2 > 0 else None,
            'limite_lineaire': limit, 'temps_limite': event if event is not None and event <= duration else None,
            'trajectory': trajectory}


def matter_growth(t, t0, d0, velocity):
    finite('t', t, 0, True)
    finite('t0', t0, 0, True)
    finite('D0', d0)
    finite('vitesse initiale', velocity)
    growing = 3*(t0*velocity+d0)/5
    decaying = d0-growing
    x = t/t0
    d = growing*x**(2/3)+decaying/x
    v = (2*growing*x**(-1/3)/3-decaying/x**2)/t0
    return d, v


def closure_energy(length, stiffness, binding):
    finite('L', length, 0, True)
    finite('kappa', stiffness, 0, True)
    finite('epsilon', binding, 0)
    return 2*math.pi**2*stiffness/length-binding


def closed_probability(t, close_rate, open_rate, p0=0.):
    for name, value in [('temps', t), ('k_OC', close_rate), ('k_CO', open_rate)]:
        finite(name, value, 0)
    finite('P_C initial', p0, 0)
    if p0 > 1:
        raise ValueError('P_C initial doit être <= 1')
    rate = close_rate+open_rate
    finite('somme des taux', rate, 0)
    return p0 if rate == 0 else p0+(close_rate/rate-p0)*(-math.expm1(-rate*t))


def capture_uniform(barrier_radius, maximum):
    finite('r_max', maximum, 0, True)
    if barrier_radius is None:
        return 0.
    finite('r_barriere', barrier_radius, 0)
    return max(0., 1-barrier_radius/maximum)


def poisson_probability(rate, volume, time):
    for name, value in [('Gamma', rate), ('volume', volume), ('temps', time)]:
        finite(name, value, 0)
    return -math.expm1(-rate*volume*time)
