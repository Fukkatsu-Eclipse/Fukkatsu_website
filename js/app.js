/* =====================================================================
   FUKKATSU — Logique de l'application (SPA en JS vanilla)
   - Routeur basé sur le hash (#/route) : compatible hébergement statique
   - Mise à jour du <title> et de la meta description par vue (SEO)
   - Menu mobile, header au scroll, animations "reveal"
   - Galerie + lightbox, formulaire de contact (démo)
   ===================================================================== */
(function () {
    "use strict";

    /* ------------------- Métadonnées par route (SEO) ------------------- */
    var ROUTES = {
        "/": {
            title: "Fukkatsu — Restauration complète d'une Mitsubishi Eclipse GS 1996",
            desc: "Fukkatsu : le journal de la restauration complète d'une Mitsubishi Eclipse GS de 1996 rongée par la rouille."
        },
        "/projet": {
            title: "Le projet — Fukkatsu",
            desc: "L'histoire et la philosophie du projet Fukkatsu : restaurer intégralement une Eclipse GS 1996."
        },
        "/voiture": {
            title: "La voiture — Mitsubishi Eclipse GS 1996 | Fukkatsu",
            desc: "Fiche technique de la Mitsubishi Eclipse GS 1996, base du projet de restauration Fukkatsu."
        },
        "/restauration": {
            title: "Restauration — Étapes & avancement | Fukkatsu",
            desc: "Les étapes de la restauration : traitement de la rouille, carrosserie, mécanique, peinture et remontage."
        },
        "/galerie": {
            title: "Galerie — Avant / après | Fukkatsu",
            desc: "Galerie photo de la transformation de l'Eclipse GS 1996 : avant, pendant et après restauration."
        },
        "/journal": {
            title: "Journal de bord — Fukkatsu",
            desc: "Les dernières avancées du chantier de restauration de la Mitsubishi Eclipse GS 1996."
        },
        "/contact": {
            title: "Contact — Fukkatsu",
            desc: "Contactez le projet Fukkatsu : questions, conseils, pièces et suivi du chantier."
        }
    };

    var DEFAULT_ROUTE = "/";

    /* ----------------------------- Sélecteurs -------------------------- */
    var views = document.querySelectorAll(".view");
    var navLinks = document.querySelectorAll("[data-route]");
    var header = document.getElementById("site-header");
    var navToggle = document.getElementById("nav-toggle");
    var navMenu = document.getElementById("nav-menu");
    var metaDesc = document.querySelector('meta[name="description"]');

    /* ----------------------------- Routeur ----------------------------- */
    function getRoute() {
        var hash = window.location.hash.replace(/^#/, "");
        if (!hash || hash === "/") return "/";
        // Normalise : retire un éventuel slash final
        return hash.replace(/\/$/, "") || "/";
    }

    function setActiveView(route) {
        if (!ROUTES[route]) route = DEFAULT_ROUTE;

        views.forEach(function (view) {
            var isMatch = view.getAttribute("data-view") === route;
            view.hidden = !isMatch;
        });

        navLinks.forEach(function (link) {
            var isMatch = link.getAttribute("data-route") === route;
            link.classList.toggle("is-active", isMatch);
            if (isMatch) {
                link.setAttribute("aria-current", "page");
            } else {
                link.removeAttribute("aria-current");
            }
        });

        // Mise à jour SEO : titre + description
        var meta = ROUTES[route];
        document.title = meta.title;
        if (metaDesc) metaDesc.setAttribute("content", meta.desc);

        // Retour en haut + déclenche les animations de la nouvelle vue
        window.scrollTo({ top: 0, behavior: "auto" });
        observeReveals();

        closeMenu();
    }

    function onRouteChange() {
        setActiveView(getRoute());
    }

    /* --------------------------- Menu mobile --------------------------- */
    function openMenu() {
        navMenu.classList.add("open");
        navToggle.setAttribute("aria-expanded", "true");
        navToggle.setAttribute("aria-label", "Fermer le menu");
    }
    function closeMenu() {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Ouvrir le menu");
    }
    if (navToggle) {
        navToggle.addEventListener("click", function () {
            if (navMenu.classList.contains("open")) closeMenu();
            else openMenu();
        });
    }
    // Ferme le menu avec Échap
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeMenu();
            closeLightbox();
        }
    });

    /* --------------------------- Header scroll ------------------------- */
    function onScroll() {
        if (window.scrollY > 10) header.classList.add("scrolled");
        else header.classList.remove("scrolled");
    }

    /* ------------------------ Animations "reveal" ---------------------- */
    var io = null;
    if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
    }
    function observeReveals() {
        var items = document.querySelectorAll(".view:not([hidden]) .reveal:not(.visible)");
        if (!io) {
            items.forEach(function (el) { el.classList.add("visible"); });
            return;
        }
        items.forEach(function (el) { io.observe(el); });
    }

    /* ----------------------------- Galerie ----------------------------- */
    // Visuels de démonstration générés en SVG (dégradés) — à remplacer par de vraies photos.
    var GALLERY = [
        { label: "Avant — bas de caisse", c1: "#5a3a22", c2: "#2a1a10" },
        { label: "Diagnostic châssis",     c1: "#3a3f4a", c2: "#16181d" },
        { label: "Démontage moteur",       c1: "#2c3540", c2: "#101418" },
        { label: "Découpe de la rouille",  c1: "#7a4520", c2: "#241208" },
        { label: "Tôlerie neuve",          c1: "#46505c", c2: "#1a1e24" },
        { label: "Apprêt carrosserie",     c1: "#5b5e66", c2: "#202228" },
        { label: "Préparation peinture",   c1: "#7d2b2b", c2: "#2a0f0f" },
        { label: "Objectif final",         c1: "#e23636", c2: "#5a1515" }
    ];

    function svgBg(c1, c2, label) {
        var svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450">' +
            '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
            '<stop offset="0" stop-color="' + c1 + '"/>' +
            '<stop offset="1" stop-color="' + c2 + '"/>' +
            '</linearGradient></defs>' +
            '<rect width="600" height="450" fill="url(#g)"/>' +
            '<text x="300" y="235" font-family="Oswald, sans-serif" font-size="30" ' +
            'fill="rgba(255,255,255,0.25)" text-anchor="middle">復活</text>' +
            '</svg>';
        return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")';
    }

    function buildGallery() {
        var grid = document.getElementById("gallery");
        if (!grid || grid.childElementCount) return;
        GALLERY.forEach(function (item) {
            var fig = document.createElement("figure");
            fig.className = "gallery-item reveal";
            fig.style.backgroundImage = svgBg(item.c1, item.c2);
            fig.setAttribute("role", "button");
            fig.setAttribute("tabindex", "0");
            fig.setAttribute("aria-label", "Agrandir : " + item.label);
            fig.dataset.label = item.label;
            fig.dataset.c1 = item.c1;
            fig.dataset.c2 = item.c2;

            var cap = document.createElement("figcaption");
            cap.textContent = item.label;
            fig.appendChild(cap);

            fig.addEventListener("click", function () { openLightbox(item); });
            fig.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLightbox(item);
                }
            });
            grid.appendChild(fig);
        });
    }

    /* ----------------------------- Lightbox ---------------------------- */
    var lightbox;
    function ensureLightbox() {
        if (lightbox) return lightbox;
        lightbox = document.createElement("div");
        lightbox.className = "lightbox";
        lightbox.setAttribute("role", "dialog");
        lightbox.setAttribute("aria-modal", "true");
        lightbox.innerHTML =
            '<button class="lightbox-close" aria-label="Fermer">×</button>' +
            '<figure class="lightbox-figure"></figure>' +
            '<p class="lightbox-caption"></p>';
        lightbox.addEventListener("click", function (e) {
            if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
                closeLightbox();
            }
        });
        document.body.appendChild(lightbox);
        return lightbox;
    }
    function openLightbox(item) {
        ensureLightbox();
        lightbox.querySelector(".lightbox-figure").style.backgroundImage = svgBg(item.c1, item.c2);
        lightbox.querySelector(".lightbox-caption").textContent = item.label;
        lightbox.classList.add("open");
    }
    function closeLightbox() {
        if (lightbox) lightbox.classList.remove("open");
    }

    /* ------------------------- Formulaire contact ---------------------- */
    var form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            var feedback = document.getElementById("form-feedback");
            if (!form.checkValidity()) {
                feedback.textContent = "Merci de remplir tous les champs correctement.";
                form.reportValidity();
                return;
            }
            // Démo : aucun backend. Brancher ici un service (Formspree, API…).
            feedback.textContent = "Merci ! Votre message a bien été pris en compte (démo).";
            form.reset();
        });
    }

    /* ------------------------------ Init ------------------------------- */
    function init() {
        buildGallery();
        document.getElementById("year").textContent = new Date().getFullYear();

        window.addEventListener("hashchange", onRouteChange);
        window.addEventListener("scroll", onScroll, { passive: true });

        onScroll();
        onRouteChange();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
