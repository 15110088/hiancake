/**
 * Page Cinema — GSAP timelines per page face (distinct visual identity)
 * Requires: gsap, optional SplitText
 */
const PageCinema = (() => {
    const splits = new WeakMap();
    const cleanups = new WeakMap();
    let splitPluginReady = false;

    function initSplitText() {
        if (splitPluginReady) return !!window.SplitText;
        if (typeof SplitText !== "undefined" && typeof gsap !== "undefined") {
            gsap.registerPlugin(SplitText);
            splitPluginReady = true;
            return true;
        }
        return false;
    }

    function prefersReduced(ctx) {
        return ctx?.reducedMotion === true;
    }

    function addLayer(face, className, innerHTML) {
        const layer = document.createElement("div");
        layer.className = `cinema-fx ${className || ""}`.trim();
        layer.setAttribute("aria-hidden", "true");
        if (innerHTML) layer.innerHTML = innerHTML;
        face.appendChild(layer);
        return layer;
    }

    function trackCleanup(face, fn) {
        const prev = cleanups.get(face);
        cleanups.set(face, () => {
            prev?.();
            fn?.();
        });
    }

    function cleanupFace(face) {
        if (!face || typeof gsap === "undefined") return;

        gsap.killTweensOf(face);
        gsap.killTweensOf(face.querySelectorAll("*"));

        const stored = splits.get(face);
        if (stored?.length) {
            stored.forEach((s) => {
                try { s.revert(); } catch (_) { /* ignore */ }
            });
            splits.delete(face);
        }

        face.querySelectorAll(".cinema-fx").forEach((el) => el.remove());
        face.querySelectorAll(".cinema-blur-enter").forEach((el) => el.classList.remove("cinema-blur-enter"));
        face.querySelectorAll(".cinema-img-3d").forEach((el) => el.classList.remove("cinema-img-3d"));
        face.querySelectorAll(".cinema-split-parent").forEach((el) => {
            el.classList.remove("cinema-split-parent");
        });

        const off = cleanups.get(face);
        if (off) {
            off();
            cleanups.delete(face);
        }
        face.classList.remove("cinema-active");
    }

    function splitReveal(face, selector, mode = "words") {
        const el = face.querySelector(selector);
        if (!el || typeof gsap === "undefined") return null;

        if (initSplitText()) {
            const split = new SplitText(el, { type: mode, linesClass: "cinema-split-line" });
            const parts = mode.includes("chars") ? split.chars : mode.includes("lines") ? split.lines : split.words;
            if (!parts?.length) return null;
            if (!splits.has(face)) splits.set(face, []);
            splits.get(face).push(split);
            gsap.set(parts, { opacity: 0, y: 28, rotateX: -40, filter: "blur(8px)" });
            return parts;
        }

        el.classList.add("cinema-split-parent");
        const text = el.textContent;
        el.textContent = "";
        const parts = [];
        const unit = mode === "chars" ? text.split("") : text.split(/(\s+)/);
        unit.forEach((chunk) => {
            const span = document.createElement("span");
            span.className = mode === "chars" ? "cinema-split-char" : "cinema-split-word";
            span.textContent = chunk;
            el.appendChild(span);
            parts.push(span);
        });
        gsap.set(parts, { opacity: 0, y: 20, filter: "blur(6px)" });
        return parts;
    }

    function animateSplit(parts, tl, position = 0) {
        if (!parts?.length) return;
        tl.to(
            parts,
            {
                opacity: 1,
                y: 0,
                rotateX: 0,
                filter: "blur(0px)",
                duration: 0.75,
                stagger: 0.035,
                ease: "power3.out"
            },
            position
        );
    }

    function sparkles(face, count = 18) {
        const layer = addLayer(face, "cinema-particles cinema-fx--above");
        const dots = [];
        for (let i = 0; i < count; i++) {
            const d = document.createElement("span");
            d.className = "cinema-particle cinema-particle--spark";
            const size = 3 + Math.random() * 5;
            d.style.width = `${size}px`;
            d.style.height = `${size}px`;
            d.style.left = `${Math.random() * 100}%`;
            d.style.top = `${Math.random() * 100}%`;
            layer.appendChild(d);
            dots.push(d);
        }
        gsap.fromTo(
            dots,
            { opacity: 0, scale: 0 },
            {
                opacity: () => 0.35 + Math.random() * 0.65,
                scale: 1,
                duration: 0.6,
                stagger: { each: 0.04, from: "random" },
                ease: "back.out(2)"
            }
        );
        dots.forEach((d) => {
            gsap.to(d, {
                y: `+=${-12 - Math.random() * 20}`,
                x: `+=${(Math.random() - 0.5) * 16}`,
                opacity: `+=${-0.2}`,
                duration: 2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 1.2
            });
        });
        return layer;
    }

    function macarons(face, n = 6) {
        const layer = addLayer(face, "cinema-particles");
        const colors = ["#FADAE0", "#F497A9", "#E07A92", "#FFF8FA", "#F7B0BE", "#D9C3BE"];
        const items = [];
        for (let i = 0; i < n; i++) {
            const m = document.createElement("span");
            m.className = "cinema-particle cinema-particle--macaron";
            const sz = 14 + Math.random() * 16;
            m.style.width = `${sz}px`;
            m.style.height = `${sz * 0.72}px`;
            m.style.background = colors[i % colors.length];
            m.style.left = `${8 + Math.random() * 84}%`;
            m.style.top = `${10 + Math.random() * 75}%`;
            layer.appendChild(m);
            items.push(m);
        }
        gsap.from(items, {
            opacity: 0,
            scale: 0,
            rotation: () => (Math.random() - 0.5) * 80,
            duration: 0.9,
            stagger: 0.12,
            ease: "elastic.out(1, 0.55)"
        });
        items.forEach((m) => {
            gsap.to(m, {
                y: `+=${-18 - Math.random() * 22}`,
                rotation: `+=${(Math.random() - 0.5) * 30}`,
                duration: 3.2 + Math.random() * 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
        return layer;
    }

    function chocolateDrip(face) {
        const layer = addLayer(face, "cinema-fx--above");
        const drips = [];
        for (let i = 0; i < 5; i++) {
            const d = document.createElement("div");
            d.className = "cinema-drip";
            d.style.left = `${10 + i * 17}%`;
            d.style.height = `${40 + Math.random() * 80}px`;
            layer.appendChild(d);
            drips.push(d);
        }
        gsap.fromTo(
            drips,
            { scaleY: 0, opacity: 0 },
            {
                scaleY: 1,
                opacity: 0.7,
                duration: 1.4,
                stagger: 0.15,
                ease: "power2.inOut",
                transformOrigin: "top center"
            }
        );
        gsap.to(drips, {
            scaleY: 1.08,
            duration: 2.5,
            repeat: -1,
            yoyo: true,
            stagger: { each: 0.2, from: "random" },
            ease: "sine.inOut"
        });
        return layer;
    }

    function creamSwirl(face) {
        const layer = addLayer(face, "cinema-fx--above");
        layer.innerHTML = `<svg class="cinema-swirl" viewBox="0 0 200 200" aria-hidden="true">
            <path d="M20,100 Q60,20 100,100 T180,100" />
            <path d="M30,120 Q80,180 140,90" opacity="0.6"/>
        </svg>`;
        const paths = layer.querySelectorAll("path");
        paths.forEach((p) => {
            const len = p.getTotalLength?.() || 400;
            gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 2.2,
            stagger: 0.25,
            ease: "power2.inOut"
        });
        gsap.to(layer, {
            rotation: 360,
            duration: 28,
            repeat: -1,
            ease: "none",
            transformOrigin: "50% 50%"
        });
        return layer;
    }

    function dynamicLight(face) {
        const light = addLayer(face, "cinema-light cinema-fx--above");
        gsap.to(light, { opacity: 0.85, duration: 1.2, ease: "power2.out" });
        const move = (e) => {
            const r = face.getBoundingClientRect();
            const x = ((e.clientX - r.left) / r.width) * 100;
            const y = ((e.clientY - r.top) / r.height) * 100;
            gsap.to(light, { xPercent: x - 50, yPercent: y - 50, duration: 0.45, ease: "power2.out" });
        };
        face.addEventListener("mousemove", move);
        trackCleanup(face, () => face.removeEventListener("mousemove", move));
        return light;
    }

    function bindImageParallax(face, selector = ".bento-img-wrap img, .cover-brand-logo, .cover-brand-bg") {
        const wraps = [...face.querySelectorAll(selector)].map((img) => {
            const w = img.closest(".bento-img-wrap") || img.parentElement;
            if (w && !w.classList.contains("cinema-img-3d")) w.classList.add("cinema-img-3d");
            return w || img;
        });

        const move = (e) => {
            const r = face.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            wraps.forEach((w, i) => {
                const depth = 1 + (i % 3) * 0.35;
                gsap.to(w, {
                    x: px * 18 * depth,
                    y: py * 12 * depth,
                    rotateY: px * 8,
                    rotateX: -py * 6,
                    duration: 0.55,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            });
        };
        const leave = () => {
            gsap.to(wraps, { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 0.8, ease: "power3.out" });
        };
        face.addEventListener("mousemove", move);
        face.addEventListener("mouseleave", leave);
        trackCleanup(face, () => {
            face.removeEventListener("mousemove", move);
            face.removeEventListener("mouseleave", leave);
        });

        gsap.set(wraps, { opacity: 1 });
        gsap.fromTo(
            wraps,
            { y: 24, scale: 0.94 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.1,
                stagger: 0.08,
                ease: "power3.out",
                onComplete: () => ensureFaceContentVisible(face)
            }
        );
    }

    function ensureFaceContentVisible(face) {
        if (!face || typeof gsap === "undefined") return;
        const els = face.querySelectorAll(
            ".bento-card, .bento-img-wrap, .bento-img-wrap img, img[data-img-key], .bento-quote, .giant-title, .title-gold, .title-red, .title-brown, .white-box, .info-hero__phone, .info-hero__title, .info-hero__line"
        );
        gsap.set(els, { opacity: 1, filter: "blur(0px)", clearProps: "opacity,filter" });
    }

    function motionBlurIn(face, targets, tl, pos = 0) {
        const els = face.querySelectorAll(targets);
        if (!els.length) return;
        els.forEach((el) => el.classList.add("cinema-blur-enter"));
        gsap.set(els, { opacity: 1 });
        tl.fromTo(
            els,
            { filter: "blur(14px)", y: 30 },
            { filter: "blur(0px)", opacity: 1, y: 0, duration: 0.85, stagger: 0.06, ease: "power3.out" },
            pos
        );
        tl.add(() => {
            els.forEach((el) => el.classList.remove("cinema-blur-enter"));
            ensureFaceContentVisible(face);
        }, pos + 0.9);
    }

    function parallaxLayers(face) {
        const isLeftSpread = face.closest(".paper")?.classList.contains("active-left");
        if (!isLeftSpread) {
            const vignette = addLayer(face, "cinema-vignette");
            gsap.to(vignette, { opacity: 0.35, duration: 1.5 });
        }
        const cards = face.querySelectorAll(".bento-card");
        cards.forEach((card, i) => {
            gsap.fromTo(
                card,
                { x: (i % 2 === 0 ? -1 : 1) * 40, opacity: 1 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.9,
                    delay: i * 0.07,
                    ease: "power3.out",
                    onComplete: () => gsap.set(card, { opacity: 1, clearProps: "opacity" })
                }
            );
            gsap.to(card, {
                y: (i % 3) * -4,
                duration: 2.8 + i * 0.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
        });
        gsap.delayedCall(1, () => ensureFaceContentVisible(face));
    }

    function playDefault(face, _paper, ctx) {
        const tl = gsap.timeline();
        motionBlurIn(face, ".bento-card, .cover-brand > *", tl, 0);
        if (!prefersReduced(ctx)) sparkles(face, 10);
    }

    const REGISTRY = {
        "p1-front"(face, paper, ctx) {
            const tl = gsap.timeline();
            const bg = face.querySelector(".cover-brand-bg");
            if (bg) {
                tl.fromTo(bg, { scale: 1.12, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" }, 0);
                if (!prefersReduced(ctx)) {
                    gsap.to(bg, { y: -8, duration: 4, repeat: -1, yoyo: true, ease: "sine.inOut" });
                }
            }
            const parts = splitReveal(face, ".cover-brand-name", "chars");
            animateSplit(parts, tl, 0.2);
            const slogan = splitReveal(face, ".cover-brand-slogan", "words");
            animateSplit(slogan, tl, 0.55);
            sparkles(face, 22);
            dynamicLight(face);
            if (!prefersReduced(ctx)) bindImageParallax(face, ".cover-brand-logo");
        },

        "p1-back"(face, _p, ctx) {
            ensureFaceContentVisible(face);
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card--photo", tl, 0);
            bindImageParallax(face);
            macarons(face, 4);
        },

        "p2-front"(face, _p, ctx) {
            ensureFaceContentVisible(face);
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card--photo", tl, 0.2);
            bindImageParallax(face, ".bento-img-wrap img");
        },

        "p2-back"(face, _p, ctx) {
            chocolateDrip(face);
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card, .bento-img-wrap", tl, 0.25);
            const h = splitReveal(face, ".giant-title, .title-gold", "words");
            animateSplit(h, tl, 0.5);
            sparkles(face, 12);
        },

        "p4-front"(face) {
            macarons(face, 8);
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card", tl, 0.15);
            bindImageParallax(face);
            dynamicLight(face);
        },

        "p4-back"(face) {
            parallaxLayers(face);
            bindImageParallax(face, ".bento-img-wrap img, .stack-img-container img");
            const tl = gsap.timeline();
            const t = splitReveal(face, ".giant-title", "chars");
            animateSplit(t, tl, 0.3);
        },

        "p5-front"(face) {
            sparkles(face, 16);
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card", tl, 0);
            bindImageParallax(face);
        },

        "p5-back"(face) {
            dynamicLight(face);
            chocolateDrip(face);
            const tl = gsap.timeline();
            motionBlurIn(face, ".menu-item-row, .bento-card", tl, 0.2);
        },

        "p6-front"(face) {
            const tl = gsap.timeline();
            const t = splitReveal(face, ".giant-title, .title-gold", "chars");
            animateSplit(t, tl, 0);
            creamSwirl(face);
            motionBlurIn(face, ".bento-card", tl, 0.4);
        },

        "p6-back"(face) {
            dynamicLight(face);
            bindImageParallax(face);
            macarons(face, 5);
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card", tl, 0.1);
        },

        "p7-front"(face) {
            const tl = gsap.timeline();
            motionBlurIn(face, ".pb-film-frames img, .bento-card", tl, 0);
            const frames = face.querySelectorAll(".pb-film-frames img");
            gsap.to(frames, {
                x: -6,
                duration: 1.2,
                repeat: -1,
                yoyo: true,
                stagger: 0.08,
                ease: "sine.inOut"
            });
            sparkles(face, 8);
        },

        "p7-back"(face) {
            bindImageParallax(face);
            const layer = addLayer(face, "cinema-particles");
            for (let i = 0; i < 14; i++) {
                const p = document.createElement("span");
                p.className = "cinema-particle cinema-particle--spark";
                p.style.cssText = `width:6px;height:6px;left:${Math.random() * 100}%;top:${Math.random() * 100}%;background:#FADAE0;opacity:0.5;border-radius:50%`;
                layer.appendChild(p);
                gsap.to(p, {
                    y: "+=30",
                    x: `+=${(Math.random() - 0.5) * 40}`,
                    rotation: 360,
                    duration: 4 + Math.random() * 3,
                    repeat: -1,
                    ease: "none"
                });
            }
        },

        "p17-front"(face) {
            const tl = gsap.timeline();
            const polars = face.querySelectorAll(".pb-polaroid");
            gsap.set(polars, { transformPerspective: 800, rotationY: -25, opacity: 0, y: 40 });
            tl.to(polars, {
                rotationY: 0,
                opacity: 1,
                y: 0,
                duration: 0.95,
                stagger: 0.14,
                ease: "power3.out"
            });
            bindImageParallax(face, ".pb-polaroid");
        },

        "p17-back"(face) {
            const tl = gsap.timeline();
            const frames = face.querySelectorAll(".pb-strip-frame");
            motionBlurIn(face, ".pb-strip-frame", tl, 0);
            gsap.from(frames, {
                clipPath: "inset(0 100% 0 0)",
                duration: 1.1,
                stagger: 0.12,
                ease: "power3.inOut"
            });
        },

        "p18-front"(face) {
            sparkles(face, 20);
            const stream = addLayer(face, "cinema-particles cinema-fx--above");
            for (let i = 0; i < 24; i++) {
                const s = document.createElement("span");
                s.className = "cinema-particle cinema-particle--spark";
                s.style.left = "-5%";
                s.style.top = `${Math.random() * 100}%`;
                stream.appendChild(s);
                gsap.to(s, {
                    x: "110vw",
                    duration: 3 + Math.random() * 4,
                    repeat: -1,
                    delay: Math.random() * 3,
                    ease: "none"
                });
            }
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card", tl, 0);
        },

        "p18-back"(face) {
            const items = face.querySelectorAll(".pb-mosaic-item");
            gsap.from(items, {
                scale: 0.6,
                opacity: 0,
                rotation: () => (Math.random() - 0.5) * 20,
                duration: 0.8,
                stagger: { each: 0.07, from: "random" },
                ease: "back.out(1.4)"
            });
            bindImageParallax(face, ".pb-mosaic-item img");
        },

        "p19-front"(face) {
            const cells = face.querySelectorAll(".pb-insta-item");
            gsap.from(cells, { scale: 0.85, opacity: 0, duration: 0.5, stagger: 0.05, ease: "power2.out" });
            cells.forEach((c, i) => {
                gsap.to(c, {
                    scale: 1.03,
                    duration: 0.6,
                    repeat: -1,
                    yoyo: true,
                    delay: i * 0.15,
                    ease: "sine.inOut"
                });
            });
            dynamicLight(face);
        },

        "p19-back"(face) {
            const scraps = face.querySelectorAll(".pb-scrap-item");
            gsap.from(scraps, {
                rotation: () => gsap.utils.random(-20, 20),
                y: 60,
                opacity: 0,
                duration: 0.85,
                stagger: 0.1,
                ease: "power3.out"
            });
            chocolateDrip(face);
        },

        "p20-front"(face) {
            const frames = face.querySelectorAll(".pb-strip-frame");
            gsap.from(frames, {
                y: -80,
                opacity: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: "bounce.out"
            });
            creamSwirl(face);
        },

        "p20-back"(face) {
            parallaxLayers(face);
            const tl = gsap.timeline();
            motionBlurIn(face, ".bento-card", tl, 0);
            sparkles(face, 14);
        },

        "p22-front"(face) {
            const tl = gsap.timeline();
            const t = splitReveal(face, ".giant-title, .title-brown", "words");
            animateSplit(t, tl, 0);
            const items = face.querySelectorAll(".pb-mosaic-item");
            gsap.from(items, {
                y: 50,
                opacity: 0,
                scale: 0.8,
                duration: 0.75,
                stagger: { each: 0.06, grid: "auto", from: "center" },
                ease: "power3.out"
            });
            macarons(face, 6);
        },

        "p22-back"(face, paper) {
            const isClosedBack = paper?.closest("#book")?.classList.contains("closed-back");
            if (isClosedBack) {
                gsap.set(face.querySelectorAll(".white-box, .qr-section, .stack-img-container img"), {
                    opacity: 1,
                    filter: "blur(0px)",
                    clearProps: "transform"
                });
                return;
            }
            dynamicLight(face);
            sparkles(face, 18);
            const tl = gsap.timeline();
            motionBlurIn(face, ".white-box, .qr-section", tl, 0.2);
            gsap.to(face, {
                boxShadow: "inset 0 0 80px rgba(244, 151, 169, 0.15)",
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut"
            });
            bindImageParallax(face, ".stack-img-container img");
        }
    };

    function resolveFaceKey(paper) {
        if (paper.classList.contains("mobile-show-back")) return `${paper.id}-back`;
        if (paper.classList.contains("active-left")) return `${paper.id}-back`;
        if (paper.classList.contains("active-right")) return `${paper.id}-front`;
        if (paper.classList.contains("mobile-visible")) return `${paper.id}-front`;
        if (paper.id === "p1" && paper.closest("#book")?.classList.contains("closed-front")) return "p1-front";
        if (paper.id === "p22" && paper.closest("#book")?.classList.contains("closed-back")) return "p22-back";
        return `${paper.id}-front`;
    }

    function resolveFace(paper, key) {
        const isBack = key.endsWith("-back");
        return paper.querySelector(isBack ? ".back" : ".front");
    }

    function play(paper, ctx = {}) {
        if (typeof gsap === "undefined" || !paper) return;
        const key = resolveFaceKey(paper);
        const face = resolveFace(paper, key);
        if (!face) return;

        cleanupFace(face);
        face.classList.add("cinema-active");

        if (prefersReduced(ctx)) {
            gsap.fromTo(face.querySelectorAll(".bento-card, .cover-brand > *, .giant-title"), { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.05 });
            return;
        }

        const fn = REGISTRY[key] || playDefault;
        fn(face, paper, ctx);
        gsap.delayedCall(1.15, () => ensureFaceContentVisible(face));
    }

    function sync(activePapers, ctx = {}) {
        if (typeof gsap === "undefined") return;
        document.querySelectorAll("#book .front, #book .back").forEach((f) => {
            if (!activePapers.some((p) => p.contains(f))) cleanupFace(f);
        });
        activePapers.forEach((p) => play(p, ctx));
    }

    function getActivePapers(bookEl, isMobileFn, currentLocation, papers, maxLocation) {
        if (isMobileFn()) {
            const v = bookEl.querySelector(".paper.mobile-visible");
            if (v) return [v];
            if (currentLocation === 1) return [papers[0]];
            if (currentLocation === maxLocation) return [papers[papers.length - 1]];
            return [];
        }
        const active = [...papers].filter(
            (p) => p.classList.contains("active-left") || p.classList.contains("active-right")
        );
        if (active.length) return active;
        if (currentLocation === 1) return [papers[0]];
        if (currentLocation === maxLocation) return [papers[papers.length - 1]];
        return [];
    }

    return { play, sync, cleanupFace, getActivePapers, resolveFaceKey };
})();
