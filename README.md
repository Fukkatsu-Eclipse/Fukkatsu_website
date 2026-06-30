# Fukkatsu (復活)

Site vitrine **SPA** présentant le projet **Fukkatsu** : la restauration complète
d'une **Mitsubishi Eclipse GS de 1996** rongée par la rouille, de l'épave à la
machine vivante.

> _Fukkatsu_ signifie « résurrection » en japonais.

## Stack

HTML / CSS / JavaScript **vanilla** — aucune dépendance, aucun build.

## Structure

```
.
├── index.html          # Page unique (SPA) + balises SEO + JSON-LD
├── css/
│   └── style.css        # Thème sombre, responsive, composants
├── js/
│   └── app.js           # Routeur hash (#/route), menu, galerie, animations
├── robots.txt           # SEO
├── sitemap.xml          # SEO
└── site.webmanifest     # PWA / icône
```

## Lancer en local

Ouvrir directement `index.html`, ou via un petit serveur statique :

```bash
python3 -m http.server 8080
# puis http://localhost:8080
```

## Fonctionnement (SPA)

- Navigation par **hash** (`#/`, `#/projet`, `#/voiture`, `#/restauration`,
  `#/galerie`, `#/journal`, `#/contact`) — compatible hébergement statique
  (GitHub Pages, Netlify…), pas besoin de réécriture serveur.
- Le `<title>` et la `meta description` sont **mis à jour par vue** (`js/app.js`,
  objet `ROUTES`) pour le référencement.
- Tout le contenu reste dans le DOM (les vues sont masquées/affichées),
  ce qui le garde lisible par les robots.

## Référencement (SEO)

- HTML sémantique (`header`, `nav`, `main`, `section`, `article`, `footer`).
- Métadonnées : description, mots-clés, Open Graph, Twitter Card, canonical.
- Données structurées **JSON-LD** (`CreativeWork` + `Car`).
- `robots.txt` + `sitemap.xml` + `site.webmanifest`.
- Respect de `prefers-reduced-motion`.

## Personnalisation rapide

- **Couleurs / typographie** : variables CSS en haut de `css/style.css` (`:root`).
- **Domaine** : remplacer `https://fukkatsu.example.com/` dans `index.html`,
  `robots.txt` et `sitemap.xml`.
- **Galerie** : remplacer les visuels SVG de démonstration (tableau `GALLERY`
  dans `js/app.js`) par de vraies photos (`<img>` avec attribut `alt`).
- **Étapes / avancement** : section `#/restauration` dans `index.html`
  (statuts `is-done` / `is-active` et largeur de la barre de progression).
- **Journal** : ajouter des `<article class="post">` dans la vue `#/journal`.
- **Formulaire de contact** : brancher un service (Formspree, API…) dans
  `js/app.js` (gestionnaire `submit`).

---

Projet personnel, non affilié à Mitsubishi Motors.
