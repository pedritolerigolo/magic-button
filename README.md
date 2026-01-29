# 🪄 Magic Button (Cursor Escape Edition)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Custom Cursor](https://img.shields.io/badge/Cursor-Custom-FF4500.svg)](#)

**Magic Button** est une bibliothèque JavaScript légère et surprenante. Contrairement aux boutons classiques qui s'enfuient, ici c'est le **curseur de l'utilisateur** qui subit une force de répulsion magnétique à l'approche du bouton.



## ✨ Le Concept

L'illusion repose sur trois piliers :
1. **Masquage** : Le vrai curseur système est caché.
2. **Simulation** : Un faux curseur (SVG) suit la souris mais subit un décalage (offset) calculé mathématiquement.
3. **Interaction** : Le faux curseur simule les états `:hover` et les clics réels sur les éléments qu'il survole, même s'il est décalé par rapport à la position réelle de la souris.

## Installation Rapide

Vous pouvez l'intégrer directement dans votre projet en utilisant les modules ES :

```html
<script type="module">
  import { RunawayButton } from "[https://pedritolerigolo.github.io/magic-button/src/RunawayButton.js](https://pedritolerigolo.github.io/magic-button/src/RunawayButton.js)";

  new RunawayButton('#votre-bouton', {
    speed: 2.5,  // Puissance de la dérive (plus élevé = plus dur)
    radius: 200  // Rayon d'influence en pixels
    mode: "attract", // "attract ou escape
  });
</script>
```

## Configuration CSS Nécessaire

Puisque le navigateur ne peut pas détecter nativement le survol par notre curseur "virtuel", la bibliothèque injecte une classe .fake-hover. Vous devez l'ajouter à vos styles :

```css
/* Style normal du bouton */
.btn-custom {
    transition: all 0.2s;
}

/* Effet activé par le faux curseur */
.btn-custom.fake-hover {
    background-color: #ff4500;
    transform: scale(1.1);
}

/* Nécessaire sinon deux curseurs */
.btn-custom:hover {
    cursor: none;
}
```
## Fonctionnement Technique

La bibliothèque utilise document.elementFromPoint(x, y) pour projeter les interactions du faux curseur sur le DOM.Calcul de l'angle : Utilise Math.atan2 pour déterminer la direction opposée au centre du bouton.Accumulation d'offset : Tant que le curseur est dans le radius, le décalage s'accentue, forçant l'utilisateur à lutter physiquement avec sa souris pour atteindre la cible.Friction : Lorsque l'utilisateur s'éloigne, le décalage est multiplié par un facteur de friction (0.95) pour que le curseur revienne doucement à sa position réelle.

## Licence

Distribué sous licence MIT. Libre à vous de l'utiliser!

Développé par pedritolerigolo