#!/usr/bin/env python3
"""Bulle sphérique et rétroaction d'un réservoir fini, modèle phénoménologique.

Calculs reproductibles sans dépendance. Option --plot : Matplotlib nécessaire.
Tous les paramètres sont en unités arbitraires. Aucune équation d'état QCD,
formation de plasma, nucléation stochastique ou gravitation n'est simulée.
"""
import argparse
import csv
import json
import math
from pathlib import Path

OUT = Path(__file__).resolve().parent
DELTA_EQ = 3**0.75/2

def f(r, delta):
    return r*r - 8*delta*r**3/9 + r**6/9

def df(r, delta):
    return 2*r - 8*delta*r*r/3 + 2*r**5/3

def ddf(r, delta):
    return 2 - 16*delta*r/3 + 10*r**4/3

def bisect(fun, left, right):
    assert fun(left)*fun(right) <= 0
    for _ in range(90):
        mid = (left+right)/2
        if fun(left)*fun(mid) <= 0:
            right = mid
        else:
            left = mid
    return (left+right)/2

def radii(delta):
    if delta < 1:
        return None, None
    if delta == 1:
        return 1.0, 1.0  # point stationnaire dégénéré, pas un minimum
    g = lambda r: r**4 - 4*delta*r + 3
    upper = 2.0
    while g(upper) <= 0:
        upper *= 2
    return bisect(g,0,1), bisect(g,1,upper)

def scales(sigma=1.0, K=100.0, reservoir=200*math.pi):
    rsn = (sigma*reservoir/(2*math.pi*K))**.25
    psn = 8*sigma/(3*rsn)
    return rsn, psn, 4*math.pi*sigma*rsn*rsn

def dimensional_energy(R, delta_p, sigma, K, reservoir):
    volume = 4*math.pi*R**3/3
    return 4*math.pi*sigma*R*R-delta_p*volume+K*volume*volume/(2*reservoir)

def integrate(delta, initial, dt=.01, duration=60.0):
    steps = round(duration/dt)
    assert abs(steps*dt-duration) < 1e-9
    r = initial
    data = [(0.0,r,f(r,delta))]
    for i in range(steps):
        fun = lambda x: -df(x,delta)
        a = fun(r)
        b = fun(r+dt*a/2)
        c = fun(r+dt*b/2)
        d = fun(r+dt*c)
        r += dt*(a+2*b+2*c+d)/6
        assert r >= 0 and math.isfinite(r)
        data.append(((i+1)*dt,r,f(r,delta)))
    return data

def threshold_time(target, influx, loss=.2, initial=0.0):
    if target <= initial:
        return 0.0
    ceiling = influx/loss
    if ceiling <= target:
        return None
    return math.log((ceiling-initial)/(ceiling-target))/loss

def generate():
    params = {'sigma':1.0,'K':100.0,'V_reservoir':200*math.pi,
              'delta_initial':.8,'beta':1.0,'perte_gamma':.2,
              'unites':'Arbitraires ; aucune calibration QCD ou cosmologique'}
    rsn, psn, scale_f = scales()
    cases = []
    for delta in [.8,1.0,1.05,DELTA_EQ,1.2,1.5,2.0]:
        rb,rs = radii(delta)
        if delta < 1:
            status = 'aucun équilibre de rayon positif'
        elif delta == 1:
            status = 'point dégénéré sans minimum'
        elif delta < DELTA_EQ:
            status = 'minimum local de bulle défavorisé face à R=0'
        elif delta == DELTA_EQ:
            status = 'égalité des deux minima de cette famille'
        else:
            status = 'minimum de bulle favorisé face à R=0'
        cases.append({'delta':delta,'delta_p':delta*psn,'r_barriere':rb,
                      'r_bulle':rs,'statut':status,
                      'f_barriere':f(rb,delta) if rb is not None else None,
                      'f_bulle':f(rs,delta) if rs is not None else None,
                      'barriere_sortie_bulle':f(rb,delta)-f(rs,delta) if delta>1 else None,
                      'fraction_volume':(4*math.pi*(rs*rsn)**3/3)/params['V_reservoir'] if rs else None})
    scenarios = []
    for influx in [.03,.04,.05,.07,.14]:
        scenarios.append({'I':influx,'q_plafond':influx/.2,'delta_plafond':.8+influx/.2,
                          't_apparition_branches':threshold_time(.2,influx),
                          't_egalite_energies':threshold_time(DELTA_EQ-.8,influx)})
    rb, rs = radii(1.2)
    runs = []
    for name,initial in [('sans_germe',0.0),('sous_barriere',.9*rb),
                         ('au_dessus_barriere',1.1*rb),('bulle_plus_grande',1.1*rs)]:
        trajectory = integrate(1.2,initial)
        runs.append({'nom':name,'delta':1.2,'r_initial':initial,
                     'r_final':trajectory[-1][1],'trajectory':trajectory})
    scans = []
    for sigma in [.5,1,2]:
        r0,p0,e0 = scales(sigma=sigma)
        delta = 3.2/p0
        rb_,rs_ = radii(delta)
        scans.append({'sigma':sigma,'delta_p_fixe':3.2,'delta':delta,
                      'R_bulle':rs_*r0 if rs_ is not None and delta>1 else None})
    return params,cases,scenarios,runs,scans

def verify(cases,scenarios,runs):
    checks = {}
    def check(name,error,tol):
        assert error <= tol,(name,error,tol)
        checks[name] = {'erreur_max':error,'tolerance':tol}
    stationary = []
    for c in cases:
        if c['delta']>1:
            rb,rs=c['r_barriere'],c['r_bulle']
            stationary += [abs(df(rb,c['delta'])),abs(df(rs,c['delta']))]
            assert ddf(rb,c['delta'])<0 and ddf(rs,c['delta'])>0
            stationary += [abs(ddf(rs,c['delta'])-2*(rs**4-1))]
    check('racines_et_courbures',max(stationary),1e-11)
    check('seuil_degenere',max(abs(df(1,1)),abs(ddf(1,1))),1e-12)
    assert f(.999,1)<f(1,1)<f(1.001,1)
    check('absence_minimum_au_seuil',0,0)
    _,r_eq=radii(DELTA_EQ)
    check('coexistence_analytique',max(abs(r_eq-3**.25),abs(f(r_eq,DELTA_EQ))),1e-12)
    errors=[]
    for sigma,K,res in [(1,100,200*math.pi),(2,70,800),(.5,200,300)]:
        r0,p0,e0=scales(sigma,K,res)
        for r in [.1,.8,1,1.8]:
            for delta in [.8,1.2,2]:
                errors.append(abs(dimensional_energy(r*r0,delta*p0,sigma,K,res)/e0-f(r,delta)))
    check('reduction_dimensionnelle',max(errors),1e-12)
    h=1e-5
    errors=[abs((f(r+h,d)-f(r-h,d))/(2*h)-df(r,d))
            for r in [.1,.8,1.2,1.8] for d in [.8,1.2,2]]
    check('gradient_par_differences_finies',max(errors),1e-7)
    for d in [1.05,1.2,1.5,2]:
        rb,rs=radii(d)
        # différences de pression, tension de Laplace et rétroaction
        for r in [rb,rs]:
            residual=d*(8/3)-100*(4*math.pi*r**3/3)/(200*math.pi)-2/r
            errors.append(abs(residual))
    check('balance_mecanique',max(errors[len(errors)-8:]),1e-11)
    convergence=[]
    energy_increase=[]
    for run in runs:
        tr=run['trajectory']
        fine=integrate(run['delta'],run['r_initial'],dt=.005)
        convergence.extend(abs(row[1]-fine[2*i][1]) for i,row in enumerate(tr))
        energy_increase.extend(max(0,tr[i+1][2]-tr[i][2]) for i in range(len(tr)-1))
    check('convergence_RK4_pas_divise_par_deux',max(convergence),1e-7)
    check('dissipation_energie_parametres_fixes',max(energy_increase),1e-12)
    _,rs=radii(1.2)
    check('deux_bassins_attraction',max(runs[1]['r_final'],
           abs(runs[2]['r_final']-rs),abs(runs[3]['r_final']-rs)),1e-10)
    check('absence_creation_deterministe_depuis_zero',runs[0]['r_final'],0)
    ramp_errors=[]
    for s in scenarios:
        for key,target in [('t_apparition_branches',.2),('t_egalite_energies',DELTA_EQ-.8)]:
            t=s[key]
            if t is not None:
                ramp_errors.append(abs(s['q_plafond']*(1-math.exp(-.2*t))-target))
            else:
                assert s['q_plafond'] <= target+1e-15
    check('temps_atteinte_solution_exacte',max(ramp_errors),1e-12)
    # Sans rétroaction, F0=4πσR²-4πΔpR³/3 a un maximum, non un minimum.
    sigma,p=1.,3.2
    rc=2*sigma/p
    assert 8*math.pi*sigma-8*math.pi*p*rc<0
    check('contre_cas_sans_retroaction',abs((8*math.pi*sigma-8*math.pi*p*rc)+8*math.pi*sigma),1e-12)
    assert max(c['fraction_volume'] or 0 for c in cases)<.05
    check('fraction_convertie_inferieure_5_pourcent',0,0)
    return checks

def plot(cases,runs):
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    plt.rcParams.update({'font.size':10,'axes.spines.top':False,'axes.spines.right':False})
    fig,axs=plt.subplots(1,3,figsize=(15,4.8),layout='constrained')
    for delta,color in [(.8,'#777777'),(1.05,'#bc6c25'),(1.2,'#16716b'),(1.5,'#3a5c9b')]:
        xs=[i*1.95/450 for i in range(451)]
        axs[0].plot(xs,[f(r,delta) for r in xs],label=f'δ = {delta:g}',color=color)
        if delta>1:
            rb,rs=radii(delta)
            axs[0].scatter([rb],[f(rb,delta)],marker='x',color=color,s=40,zorder=5)
            axs[0].scatter([rs],[f(rs,delta)],marker='o',color=color,s=30,zorder=5)
    axs[0].axhline(0,color='#aaaaaa',lw=.7)
    axs[0].set(xlabel='Rayon réduit r',ylabel='Énergie libre réduite f',ylim=(-1.6,1.2),
               title='A   Barrière et minimum de bulle')
    axs[0].legend(frameon=False,fontsize=9)
    ds=[1+i/400 for i in range(401)]
    axs[1].plot(ds,[radii(d)[0] for d in ds],'--',color='#bc6c25',label='Rayon barrière')
    axs[1].plot(ds,[radii(d)[1] for d in ds],color='#16716b',label='Minimum radial')
    axs[1].scatter([1],[1],facecolors='none',edgecolors='#333333',zorder=4)
    axs[1].axvline(DELTA_EQ,color='#777777',lw=.8,ls=':')
    axs[1].annotate('Égalité des énergies',xy=(DELTA_EQ,1.72),xytext=(1.21,1.72),fontsize=9)
    axs[1].set(xlabel='Poussée réduite δ',ylabel='Rayon réduit r',xlim=(.8,2),ylim=(0,2),
               title='B   Deux seuils distincts')
    axs[1].legend(frameon=False,loc='lower left',fontsize=9)
    labels={'sans_germe':'Sans germe', 'sous_barriere':'Germe sous la barrière',
            'au_dessus_barriere':'Germe au-dessus', 'bulle_plus_grande':'Bulle initialement plus grande'}
    colors=['#333333','#bc6c25','#16716b','#3a5c9b']
    styles=[':', '--', '-', '-.']
    for run,color,style in zip(runs,colors,styles):
        tr=run['trajectory'][:1501:5]
        axs[2].plot([z[0] for z in tr],[z[1] for z in tr],label=labels[run['nom']],color=color,ls=style)
    axs[2].set(xlabel='Temps réduit τ',ylabel='Rayon réduit r',title='C   Relaxation à δ = 1,2')
    axs[2].legend(frameon=False,fontsize=8,loc='center right')
    fig.suptitle('Modèle de bulle avec rétroaction finie · hypothèses phénoménologiques · sans gravitation',fontsize=12)
    fig.savefig(OUT/'bulles_stabilite.png',dpi=180)
    fig.savefig(OUT/'bulles_stabilite.svg')
    plt.close(fig)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plot',action='store_true')
    args=parser.parse_args()
    params,cases,scenarios,runs,scans=generate()
    checks=verify(cases,scenarios,runs)
    result={'statut':'Modèle effectif conditionnel ; stabilité radiale seulement',
            'parametres':params,'seuils':{'delta_apparition':1,'delta_egalite':DELTA_EQ,
             'q_apparition':.2,'q_egalite':DELTA_EQ-.8},'cas':cases,'accumulation':scenarios,
            'sensibilite_tension':scans,'relaxations':[{k:v for k,v in r.items() if k!='trajectory'} for r in runs],
            'verifications':checks}
    (OUT/'resultats_bulle.json').write_text(json.dumps(result,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
    with (OUT/'trajectoires_bulle.csv').open('w',newline='') as stream:
        writer=csv.writer(stream)
        writer.writerow(['scenario','delta','temps_reduit','rayon_reduit','energie_reduite'])
        for run in runs:
            for t,r,energy in run['trajectory'][::10]:
                writer.writerow([run['nom'],run['delta'],t,r,energy])
    lines=['# Résultats du modèle de bulle','',
        'Unités réduites, rétroaction postulée ; aucune identification au plasma QCD.','',
        '| δ | Rayon barrière | Rayon bulle | f barrière | f bulle | État |',
        '|---:|---:|---:|---:|---:|---|']
    fmt=lambda x:'—' if x is None else f'{x:.6f}'
    for c in cases:
        lines.append('| '+' | '.join([fmt(c[k]) for k in ['delta','r_barriere','r_bulle','f_barriere','f_bulle']]+[c['statut']])+' |')
    lines+=['','À δ = 1, le rayon affiché est un point stationnaire dégénéré, sans minimum local.',
            'La barrière depuis r = 0 reste positive pour tout δ fini. Les minima sont comparés dans la seule famille sphérique définie.','',
            '## Accessibilité sous accumulation','',
            'q(t) = (I/γ)(1 − exp(−γt)), γ = 0,2 ; δ = 0,8 + q. Calcul avant nucléation à volume de nuage fixé.','',
            '| I | δ plafond | Temps δ = 1 | Temps égalité des énergies |','|---:|---:|---:|---:|']
    for s in scenarios:
        lines.append('| '+' | '.join(fmt(s[k]) for k in ['I','delta_plafond','t_apparition_branches','t_egalite_energies'])+' |')
    lines+=['','Un tiret indique une absence d’atteinte à temps fini. Aucun de ces temps ne calcule la nucléation.',
            '','## Relaxations à δ fixé','', '| Préparation | Rayon initial | Rayon final à τ = 60 |', '|---|---:|---:|']
    for run in runs:
        lines.append(f"| {run['nom']} | {run['r_initial']:.6f} | {run['r_final']:.6f} |")
    lines+=['','## Sensibilité à tension variable','',
            'Poussée dimensionnée réduite fixée à 3,2 ; K = 100 et Vréservoir = 200π.','',
            '| σ | δ correspondant | Rayon minimum dimensionné réduit |','|---:|---:|---:|']
    for row in scans:
        lines.append('| '+' | '.join(fmt(row[k]) for k in ['sigma','delta','R_bulle'])+' |')
    lines+=['','## Vérifications','']
    for name,value in checks.items():
        lines.append(f"- {name} : erreur {value['erreur_max']:.3g}, tolérance {value['tolerance']:.3g}.")
    lines+=['','Reproduction : `python3 calcul_bulle.py`. Ajouter `--plot` avec Matplotlib pour les figures.','']
    if args.plot:
        plot(cases,runs)
        lines+=['![Énergies, branches et relaxations](bulles_stabilite.png)','']
    (OUT/'resultats_bulle.md').write_text('\n'.join(lines))
    print('\n'.join(lines[:17]))
    print(f'{len(checks)} contrôles réussis.')

if __name__=='__main__':
    main()
