document.addEventListener("DOMContentLoaded", () => {
    // Ảnh local — thư mục anh/ (trang 1 có thể trùng; các trang khác mỗi file một lần)
    const BOOK_IMAGES = {
        p1_cover_bg: "anh/32.jpg",
        p1_logo: "anh/logo.jpg",
        p1_about_hero: "anh/2.jpg",
        p1_about_panel1: "anh/3.jpg",
        p1_about_panel2: "anh/34.jpg",
        p1_about_panel3: "anh/85.jpg",
        p1_about_4: "anh/86.jpg",
        p1_about_5: "anh/87.jpg",
        p2_content1: "anh/1.jpg",
        p2_content2: "anh/3.jpg",
        p2_content3: "anh/4.jpg",
        p2_content4: "anh/5.jpg",
        visual_gift_story: "anh/6.jpg",
        p3_tart_sub: "anh/7.jpg",
        p2_sparkler_sub: "anh/8.jpg",
        p3_presents: "anh/9.jpg",
        p3_flower: "anh/10.jpg",
        p3_gift: "anh/11.jpg",
        p4_birthday_hero: "anh/12.jpg",
        p4_cake_top: "anh/13.jpg",
        visual_flavors: "anh/14.jpg",
        p3_tart: "anh/15.jpg",
        p4_cake_sub2: "anh/16.jpg",
        p4_gift_box: "anh/17.jpg",
        p4_cake_bottom: "anh/18.jpg",
        p4_party_top: "anh/19.jpg",
        p4_party_bottom: "anh/20.jpg",
        p5_dessert_top: "anh/21.jpg",
        p5_dessert_bottom: "anh/22.jpg",
        p5_cookies_split_left: "anh/23.jpg",
        p9_gallery_sub1: "anh/24.jpg",
        visual_pb_film: "anh/25.jpg",
        p5_cookies_bottom: "anh/26.jpg",
        p6_pudding_sub: "anh/27.jpg",
        visual_pudding_menu: "anh/28.jpg",
        visual_coffee_menu: "anh/29.jpg",
        visual_cream_menu: "anh/30.jpg",
        p6_cream_top: "anh/31.jpg",
        p6_mousse_cake: "anh/33.jpg",
        p6_pudding_alt: "anh/34.jpg",
        p9_gallery_sub1_dup2: "anh/35.jpg",
        p9_gallery_sub2: "anh/36.jpg",
        p9_gallery_sub3: "anh/37.jpg",
        p8_love_bottom: "anh/38.jpg",
        p7_bread_detail: "anh/39.jpg",
        p7_bread_sub1: "anh/40.jpg",
        p7_bread_sub2: "anh/41.jpg",
        p7_bread_sub3: "anh/42.jpg",
        p7_wedding_main: "anh/43.jpg",
        pb_polar8: "anh/44.jpg",
        p7_wedding_sub2: "anh/45.jpg",
        pb_film11: "anh/46.jpg",
        pb_film12: "anh/47.jpg",
        pb_film13: "anh/48.jpg",
        visual_pb_film_b: "anh/49.jpg",
        pb_insta13: "anh/50.jpg",
        pb_insta14: "anh/51.jpg",
        pb_insta15: "anh/52.jpg",
        pb_insta16: "anh/53.jpg",
        pb_strip1: "anh/54.jpg",
        pb_strip2: "anh/55.jpg",
        pb_strip3: "anh/56.jpg",
        pb_strip4: "anh/57.jpg",
        pb_strip5: "anh/58.jpg",
        pb_strip6: "anh/59.jpg",
        pb_strip7: "anh/60.jpg",
        pb_strip8: "anh/61.jpg",
        pb_strip9: "anh/62.jpg",
        pb_polar13: "anh/63.jpg",
        pb_strip13: "anh/64.jpg",
        pb_strip14: "anh/65.jpg",
        visual_pb_cream: "anh/66.jpg",
        pb_mosaic16: "anh/67.jpg",
        pb_mosaic17: "anh/68.jpg",
        pb_mosaic20: "anh/69.jpg",
        pb_film16: "anh/70.jpg",
        pb_film17: "anh/71.jpg",
        pb_film18: "anh/72.jpg",
        visual_pb_film_c: "anh/73.jpg",
        pb_insta19: "anh/74.jpg",
        pb_insta20: "anh/75.jpg",
        pb_insta21: "anh/76.jpg",
        pb_insta22: "anh/77.jpg",
        pb_mosaic21: "anh/78.jpg",
        pb_mosaic22: "anh/79.jpg",
        pb_mosaic25: "anh/80.jpg",
        p9_back_cover_top: "anh/81.jpg",
        p9_back_cover_bottom: "anh/82.jpg",
        p2_content5: "anh/83.jpg",
        p2_content6: "anh/84.jpg",
        pb_film14: "anh/85.jpg",
        pb_film15: "anh/86.jpg",
        pb_insta17: "anh/87.jpg",
    };




    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const book = document.getElementById("book");
    const papers = document.querySelectorAll(".paper");
    const flipbookShell = document.getElementById("flipbook-shell");

    const BOOK_ASPECT = 480 / 640;
    const MOBILE_BREAKPOINT = 768;
    const DRAG_THRESHOLD = 55;

    const mobileMedia = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const reducedMotionMedia = window.matchMedia("(prefers-reduced-motion: reduce)");

    function isMobile() {
        return mobileMedia.matches;
    }

    function prefersReducedMotion() {
        return reducedMotionMedia.matches;
    }

    function flipDuration() {
        return prefersReducedMotion() ? 0.01 : 0.9;
    }

    let currentLocation = 1;
    let numOfPapers = papers.length;
    let maxLocation = numOfPapers + 1;

    let isDragging = false;
    let isFlipAnimating = false;
    let dragStartX = 0;
    let dragPaper = null;
    let dragDirection = 0;

    const paperRotY = new Map();
    const paperScaleX = new Map();
    const paperFoldOpacity = new Map();

    function initGsapFlipEngine() {
        if (typeof gsap === "undefined") return;

        papers.forEach((paper) => {
            if (!paper.querySelector(".page-fold-shadow")) {
                const fold = document.createElement("div");
                fold.className = "page-fold-shadow";
                fold.setAttribute("aria-hidden", "true");
                paper.appendChild(fold);
            }

            const startRot = paper.classList.contains("flipped") ? -180 : 0;
            gsap.set(paper, {
                rotationY: startRot,
                rotationX: 0,
                scaleX: 1,
                z: 0,
                transformStyle: "preserve-3d",
                transformOrigin: "left center",
                force3D: true
            });

            paperRotY.set(paper, gsap.quickSetter(paper, "rotationY", "deg"));
            paperScaleX.set(paper, gsap.quickSetter(paper, "scaleX"));
            const foldEl = paper.querySelector(".page-fold-shadow");
            if (foldEl) {
                paperFoldOpacity.set(paper, gsap.quickSetter(foldEl, "opacity"));
            }
        });
    }

    function updatePageFlipFX(paper, rotY) {
        const progress = Math.min(1, Math.abs(rotY) / 180);
        const curve = Math.sin(progress * Math.PI);
        const scaleX = 1 - curve * 0.042;
        const lift = curve * 3;
        const foldOpacity = curve * 0.65;

        const setScale = paperScaleX.get(paper);
        const setFold = paperFoldOpacity.get(paper);
        if (setScale) setScale(scaleX);
        gsap.set(paper, { z: lift });

        showFoldShadow(paper, foldOpacity);

        const shadowPx = curve * 32;
        if (shadowPx > 0.5) {
            paper.style.boxShadow = `${-shadowPx}px 0 ${shadowPx * 1.5}px rgba(89, 60, 66, ${0.05 + curve * 0.18})`;
        } else {
            paper.style.boxShadow = "";
        }
    }

    function resetPageFlipFX(paper) {
        gsap.set(paper, { rotationX: 0, z: 0, scaleX: 1 });
        paper.style.boxShadow = "";
        const foldEl = paper.querySelector(".page-fold-shadow");
        if (foldEl) {
            gsap.set(foldEl, { opacity: 0, clearProps: "opacity" });
            foldEl.style.visibility = "hidden";
        }
    }

    function showFoldShadow(paper, opacity) {
        const foldEl = paper.querySelector(".page-fold-shadow");
        if (!foldEl) return;
        foldEl.style.visibility = opacity > 0.02 ? "visible" : "hidden";
        const setFold = paperFoldOpacity.get(paper);
        if (setFold) setFold(opacity);
    }

    function getActiveBentoCards(paper) {
        if (!paper) return [];
        const selector = paper.classList.contains("mobile-show-back") || paper.classList.contains("active-left")
            ? ".back .bento-card"
            : ".front .bento-card";
        return Array.from(paper.querySelectorAll(selector));
    }

    function revealActiveBentoCards(paper) {
        if (!paper) return;
        const cards = getActiveBentoCards(paper);
        const face = paper.classList.contains("active-left") || paper.classList.contains("mobile-show-back")
            ? paper.querySelector(".back")
            : paper.querySelector(".front");

        if (cards.length) {
            gsap.killTweensOf(cards);
            gsap.set(cards, { opacity: 1, clearProps: "opacity,transform,y,scale,filter" });
        }

        if (face && typeof gsap !== "undefined") {
            const media = face.querySelectorAll(".bento-img-wrap, .bento-img-wrap img, img[data-img-key]");
            gsap.killTweensOf(media);
            gsap.set(media, { opacity: 1, filter: "blur(0px)", clearProps: "opacity,filter" });
            const infoHero = face.querySelectorAll(".bento-card--info-hero, .info-hero__phone, .info-hero__title, .info-hero__line");
            gsap.killTweensOf(infoHero);
            gsap.set(infoHero, { opacity: 1, filter: "blur(0px)", clearProps: "opacity,filter,transform" });
        }
    }

    function syncPaperRotation(paper, flipped) {
        if (typeof gsap === "undefined") return;
        gsap.killTweensOf(paper);
        gsap.set(paper, { rotationY: flipped ? -180 : 0 });
        resetPageFlipFX(paper);
    }

    function getBookSpreadX() {
        const stageW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--book-stage-width")) || 960;
        const pageW = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--book-width")) || 480;
        const isOpen = book.classList.contains("open") || book.classList.contains("is-closing");
        return isOpen ? stageW - pageW : 0;
    }

    function syncBookPosition() {
        if (typeof gsap === "undefined" || isMobile()) return;
        book.classList.add("gsap-drive");
        gsap.set(book, { x: getBookSpreadX() });
    }

    /** Đồng bộ tư thế 3D khi đóng sách — GSAP inline transform phải khớp CSS closed-front / closed-back */
    function syncClosedCoverPose() {
        if (typeof gsap === "undefined") return;

        const firstPaper = papers[0];
        const lastPaper = papers[numOfPapers - 1];

        if (book.classList.contains("closed-back") && lastPaper) {
            gsap.killTweensOf(lastPaper);
            gsap.set(lastPaper, {
                rotationY: 0,
                rotationX: 0,
                scaleX: 1,
                z: 0,
                transformOrigin: "left center"
            });
            lastPaper.classList.remove("flipped", "is-flipping", "dragging");
            resetPageFlipFX(lastPaper);
            revealActiveBentoCards(lastPaper);
        } else if (book.classList.contains("closed-front") && firstPaper) {
            gsap.killTweensOf(firstPaper);
            gsap.set(firstPaper, {
                rotationY: 0,
                rotationX: 0,
                scaleX: 1,
                z: 0,
                transformOrigin: "left center"
            });
            firstPaper.classList.remove("flipped", "is-flipping", "dragging");
            resetPageFlipFX(firstPaper);
            revealActiveBentoCards(firstPaper);
        }

        if (!isMobile()) {
            gsap.killTweensOf(book);
            gsap.set(book, { x: 0 });
        }
    }

    function animateBookSpread(open, onComplete) {
        if (typeof gsap === "undefined" || isMobile()) {
            onComplete?.();
            return;
        }

        book.classList.add("gsap-drive");
        const targetX = open
            ? (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--book-stage-width")) || 960) -
              (parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--book-width")) || 480)
            : 0;

        gsap.to(book, {
            x: targetX,
            duration: flipDuration(),
            ease: "power2.inOut",
            overwrite: true,
            onComplete: () => {
                syncBookPosition();
                onComplete?.();
            }
        });
    }

    function animatePageFlip(paper, toFlipped, onComplete) {
        if (typeof gsap === "undefined" || isMobile() || prefersReducedMotion()) {
            if (toFlipped) paper.classList.add("flipped");
            else paper.classList.remove("flipped");
            syncPaperRotation(paper, toFlipped);
            onComplete?.();
            return;
        }

        gsap.killTweensOf(paper);
        paper.classList.add("is-flipping");
        paper.classList.remove("dragging");

        const targetRot = toFlipped ? -180 : 0;
        const startRot = gsap.getProperty(paper, "rotationY") || 0;

        const tl = gsap.timeline({
            onComplete: () => {
                paper.classList.remove("is-flipping");
                if (toFlipped) paper.classList.add("flipped");
                else paper.classList.remove("flipped");
                resetPageFlipFX(paper);
                onComplete?.();
            }
        });

        tl.to(paper, {
            rotationY: targetRot,
            duration: flipDuration(),
            ease: "power2.inOut",
            onUpdate: () => {
                const ry = gsap.getProperty(paper, "rotationY");
                updatePageFlipFX(paper, ry);
            }
        }, 0);

        if (!prefersReducedMotion()) {
            const midBend = toFlipped ? -4.2 : 4.2;
            tl.fromTo(
                paper,
                { rotationX: 0 },
                {
                    rotationX: midBend,
                    duration: flipDuration() * 0.38,
                    ease: "sine.inOut",
                    yoyo: true,
                    repeat: 1
                },
                0
            );
        }

        if (startRot === targetRot) {
            tl.progress(1);
        }
    }

    function animateBentoEntrance(paper) {
        if (!paper) return;

        const cards = getActiveBentoCards(paper);
        if (!cards.length) return;

        revealActiveBentoCards(paper);

        if (typeof gsap === "undefined" || prefersReducedMotion()) return;

        gsap.fromTo(
            cards,
            { y: 18, scale: 0.97 },
            {
                y: 0,
                scale: 1,
                duration: 0.55,
                stagger: 0.06,
                ease: "power3.out",
                overwrite: true,
                onComplete: () => revealActiveBentoCards(paper)
            }
        );
    }

    function initBookEntrance() {
        if (typeof gsap === "undefined" || !flipbookShell || prefersReducedMotion()) return;

        gsap.from(flipbookShell, {
            opacity: 0,
            y: 28,
            scale: 0.94,
            duration: 1.05,
            ease: "power3.out",
            delay: 0.12
        });
    }

    // Load images dynamically from the configuration object
    const FRAME_CLASSES = [
        "bento-frame--portrait",
        "bento-frame--portrait-tall",
        "bento-frame--landscape",
        "bento-frame--landscape-wide"
    ];

    function applyFrameRatio(img) {
        const wrap = img.closest(".bento-img-wrap");
        if (!wrap || img.closest(".pb-polaroid, .pb-mosaic-item, .pb-insta-item, .pb-film-frames, .cover-layout")) return;

        const mosaic = wrap.closest(".bento-grid--portrait-mosaic");
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        FRAME_CLASSES.forEach((c) => wrap.classList.remove(c));
        wrap.classList.add("bento-frame");

        if (mosaic) {
            wrap.classList.add("bento-frame--portrait");
            return;
        }

        if (!w || !h) return;

        const ratio = w / h;
        if (ratio >= 1.35) wrap.classList.add("bento-frame--landscape-wide");
        else if (ratio >= 1.02) wrap.classList.add("bento-frame--landscape");
        else if (ratio >= 0.72) wrap.classList.add("bento-frame--portrait-tall");
        else wrap.classList.add("bento-frame--portrait");
    }

    function bindFrameOnLoad(img) {
        const run = () => applyFrameRatio(img);
        if (img.complete && img.naturalWidth) run();
        else img.addEventListener("load", run, { once: true });
    }

    function loadImages() {
        const images = document.querySelectorAll("img[data-img-key]");
        images.forEach(img => {
            const key = img.getAttribute("data-img-key");
            if (BOOK_IMAGES[key]) {
                img.src = BOOK_IMAGES[key];
            }
            bindFrameOnLoad(img);
        });
    }

    /** Slogan tiệm bánh — gán tự động thay cho placeholder trống */
    const BAKERY_SLOGANS = [
        "Bánh thủ công từ tâm",
        "HiAn Cake — ngọt từ lò",
        "Homemade — nướng mỗi ngày",
        "Ngọt từng lớp kem",
        "Mỗi chiếc là quà tặng",
        "Kem bơ cao cấp",
        "Cốt bông mềm tan",
        "Chocolate đậm vị",
        "Hoa trên bánh — tinh tế",
        "Lò nướng ấm mỗi sáng",
        "Cắn một miếng — yêu ngay",
        "Tươi ngon từng ngày",
        "Bánh mì giòn tan",
        "Cookies bơ thơm",
        "Tiệc sinh nhật trọn vị",
        "Ngày vui — bánh ngọt",
        "Wedding cake sang trọng",
        "Tình yêu trong từng lớp kem",
        "Gói quà xinh cho người thương",
        "Bánh kem phủ mịn",
        "Mousse nhẹ — tan trong miệng",
        "Tiramisu đậm vị cà phê",
        "Bánh tart chua ngọt",
        "Macaron sắc màu",
        "Cupcake xinh cho bé",
        "Bánh cuốn kem tươi",
        "Nướng bằng tâm — không vội",
        "Nguyên liệu chọn kỹ",
        "Ngọt vừa — không ngán",
        "Thơm bơ — mềm cốt",
        "Tiệm bánh nhà làm",
        "Order — giao tận tay",
        "Sinh nhật bé yêu",
        "Party table đầy màu",
        "Kem phủ như cánh hoa",
        "Bánh mừng ngày cưới",
        "Hạnh phúc trọn vẹn ♥",
        "Bánh mì sourdough",
        "Croissant giòn lớp",
        "Pain au chocolat thơm",
        "Bánh quy giòn vàng",
        "Pudding mịn màng",
        "Trà chiều — bánh ngọt",
        "Cà phê kèm bánh kem",
        "Mùi vani lan tỏa",
        "Dâu tươi trên bánh",
        "Matcha thanh nhẹ",
        "Caramel sánh mịn",
        "Phô mai kem béo",
        "Socola Belgiê đậm",
        "Bánh cho mọi khoảnh khắc",
        "Làm bằng yêu thương",
        "HiAn Cake — sweet life",
        "Artisan — từng chi tiết",
        "Bánh sinh nhật đặt riêng",
        "Thiết kế theo ý bạn",
        "Ngọt lành như nụ cười",
        "Từ tiệm bánh đến tim bạn",
        "Fresh bake — hot from oven",
        "Mỗi ngày một hương vị mới"
    ];

    const SLOGAN_THEMES = [
        { test: /wedding|meet|love_bottom|love_top|iloveyou/i, lines: ["Ngày cưới ngọt ngào", "Love is sweet ♥", "Bánh mừng hạnh phúc", "Tình trong từng lớp kem"] },
        { test: /bread|loaf|crust|oven|bakery_menu/i, lines: ["Bánh mì nướng tươi", "Giòn vỏ — thơm ruột", "Mùi lò quyến rũ", "Sáng nào cũng nóng hổi"] },
        { test: /cookie|crisp/i, lines: ["Cookies giòn tan", "Bơ thơm từng miếng", "Crispy & gold", "Cắn là mê"] },
        { test: /birthday|party|sparkler|celebration|gift|present|tart|cake_top|cake_sub/i, lines: ["Sinh nhật rực rỡ", "Thổi nến — ước hay", "Tiệc ngọt đáng nhớ", "Quà sinh nhật từ tim"] },
        { test: /film|strip|cinema|pb_film/i, lines: ["Khoảnh khắc ngọt ngào", "Mỗi khung — một hương vị", "Film reel bánh kem", "Lưu giữ vị ngọt"] },
        { test: /polar|scrap|mosaic|insta|gallery/i, lines: ["Kỷ niệm ngọt ngào", "Ảnh đẹp — bánh đẹp", "Sweet memories", "Góc tiệm bánh xinh"] },
        { test: /cream|mousse|dessert|pudding|flavor|menu/i, lines: ["Kem bơ mịn màng", "Dessert cao cấp", "Ngọt từng lớp phủ", "Hương vị đa dạng"] },
        { test: /coffee|tea/i, lines: ["Trà & bánh chiều", "Cà phê kèm ngọt nhẹ", "Break time — HiAn Cake"] }
    ];

    const themeSloganIndex = new Map();

    function pickBakerySlogan(imgKey) {
        const key = (imgKey || "").toLowerCase();
        for (const theme of SLOGAN_THEMES) {
            if (theme.test.test(key)) {
                const i = themeSloganIndex.get(theme) || 0;
                themeSloganIndex.set(theme, i + 1);
                return theme.lines[i % theme.lines.length];
            }
        }
        const i = themeSloganIndex.get("default") || 0;
        themeSloganIndex.set("default", i + 1);
        return BAKERY_SLOGANS[i % BAKERY_SLOGANS.length];
    }

    function applySloganText(el, imgKey) {
        if (!el || el.textContent.trim()) return;
        el.textContent = pickBakerySlogan(imgKey);
    }

    /** Khung ảnh chữ nhật + slogan — tỷ lệ khung theo độ rộng ô lưới */
    function initPhotoSlogans() {
        const skipSelector = ".pb-mosaic, .pb-insta-grid, .pb-filmstrip, .pb-strip-page, .pb-photobooth-polaroids, .pb-scrapbook, .mock-player";
        document.querySelectorAll(".bento-card").forEach((card) => {
            if (card.closest(".cover-layout")) return;
            if (card.querySelector(skipSelector)) return;

            const wrap = card.querySelector(":scope > .bento-img-wrap");
            if (!wrap) return;

            card.classList.add("bento-card--photo");

            const hasSlogan = card.querySelector(":scope > .bento-slogan");
            const hasHeading = card.querySelector(":scope > .subtitle, :scope > .giant-title, :scope > .title-gold, :scope > .title-red, :scope > .luxury-badge, :scope > .price-tag");
            const hasQuote = card.querySelector(":scope > .bento-quote");

            if (hasHeading || card.classList.contains("bento-card--heading")) {
                card.classList.add("bento-card--has-title");
            }

            wrap.classList.add("bento-frame");
            const img = wrap.querySelector("img[data-img-key]");
            const inMosaic = card.closest(".bento-grid--portrait-mosaic");

            if (inMosaic) {
                wrap.classList.add("bento-frame--portrait");
            } else if (img) {
                bindFrameOnLoad(img);
            } else if (card.classList.contains("span-6") || wrap.classList.contains("bento-img-wrap--fill")) {
                wrap.classList.add("bento-frame--landscape-wide");
            } else if (card.classList.contains("span-4")) {
                wrap.classList.add("bento-frame--portrait-tall");
            } else {
                wrap.classList.add("bento-frame--portrait");
            }

            if (!hasSlogan && !hasQuote && !hasHeading) {
                const slogan = document.createElement("p");
                slogan.className = "bento-slogan";
                slogan.setAttribute("contenteditable", "true");
                slogan.setAttribute("spellcheck", "false");
                slogan.setAttribute("data-placeholder", "Slogan HiAn Cake…");
                applySloganText(slogan, img ? img.getAttribute("data-img-key") : "");
                card.appendChild(slogan);
            } else if (hasSlogan) {
                const existing = card.querySelector(":scope > .bento-slogan");
                applySloganText(existing, img ? img.getAttribute("data-img-key") : "");
            }
        });

        document.querySelectorAll(".bento-slogan").forEach((el) => {
            const card = el.closest(".bento-card");
            const img = card && card.querySelector("img[data-img-key]");
            applySloganText(el, img ? img.getAttribute("data-img-key") : "");
        });

        const coverSlogan = document.querySelector(".cover-brand-slogan");
        if (coverSlogan && !coverSlogan.textContent.trim()) {
            coverSlogan.textContent = "Bánh thủ công — ngọt từng khoảnh khắc";
        }

        document.querySelectorAll(".bento-card .bento-img-wrap").forEach((wrap) => {
            if (wrap.closest(skipSelector)) return;
            if (!wrap.classList.contains("bento-frame")) {
                wrap.classList.add("bento-frame", "bento-frame--portrait");
            }
        });

        document.querySelectorAll(".bento-card > div[style*='display:flex']").forEach((row) => {
            const card = row.closest(".bento-card");
            if (!card) return;
            row.querySelectorAll("img[data-img-key]").forEach((img) => {
                if (!img.parentElement.classList.contains("bento-img-wrap")) {
                    const shell = document.createElement("div");
                    shell.className = "bento-img-wrap bento-img-wrap--inline bento-frame bento-frame--portrait";
                    img.parentNode.insertBefore(shell, img);
                    shell.appendChild(img);
                }
            });
        });
    }

    // Set initial z-index for papers
    function initZIndex() {
        papers.forEach((paper, index) => {
            paper.style.zIndex = numOfPapers - index;
        });
    }

    // Toggle navigation buttons state
    function updateNavButtons() {
        prevBtn.disabled = currentLocation === 1;
        nextBtn.disabled = currentLocation === maxLocation;
    }

    // Sound effect
    const flipSound = new Audio("https://actions.google.com/sounds/v1/water/water_splash.ogg");
    flipSound.volume = 0.3;

    function playSound() {
        flipSound.currentTime = 0;
        flipSound.play().catch(e => console.log("Audio autoplay blocked by browser"));
    }

    function checkBookState(animateSpread = false) {
        const wasOpen = book.classList.contains("open") || book.classList.contains("is-closing");

        book.classList.remove("closed-front", "closed-back", "open");

        let willOpen = false;

        if (currentLocation === 1) {
            book.classList.add("closed-front");
        } else if (currentLocation === maxLocation) {
            book.classList.add("closed-back");
        } else {
            book.classList.add("open");
            willOpen = true;
        }

        updateBookLayout();
        updateMobileView();

        if (currentLocation === 1 || currentLocation === maxLocation) {
            syncClosedCoverPose();
        }

        if (!isMobile() && typeof gsap !== "undefined") {
            if (animateSpread) {
                if (willOpen && !wasOpen) {
                    gsap.set(book, { x: 0 });
                    animateBookSpread(true);
                } else if (!willOpen && wasOpen) {
                    animateBookSpread(false, () => {
                        syncClosedCoverPose();
                    });
                } else {
                    syncBookPosition();
                }
            } else {
                syncBookPosition();
            }
        }
    }

    /** Mobile: chá»‰ hiá»‡n 1 máº·t trang táº¡i má»—i vá»‹ trÃ­ (láº­t tuáº§n tá»±) */
    function updateMobileView() {
        book.classList.toggle("mobile-view", isMobile());

        papers.forEach((paper) => {
            paper.classList.remove("mobile-visible", "mobile-show-back");
        });

        if (!isMobile()) return;

        let visiblePaper = null;
        let showBack = false;

        if (currentLocation === 1) {
            visiblePaper = papers[0];
        } else if (currentLocation === maxLocation) {
            visiblePaper = papers[numOfPapers - 1];
            showBack = true;
        } else {
            const k = currentLocation - 2;
            if (k % 2 === 0) {
                visiblePaper = papers[k / 2];
                showBack = true;
            } else {
                visiblePaper = papers[(k + 1) / 2];
            }
        }

        if (visiblePaper) {
            visiblePaper.classList.add("mobile-visible");
            if (showBack) visiblePaper.classList.add("mobile-show-back");
        }
    }

    function playEffectsOnPaper(paper) {
        paper.querySelectorAll(".pb-effect-popup, .pb-effect-reveal, .pb-effect-blur-in").forEach((container) => {
            setTimeout(() => container.classList.add("play-anim"), 50);
        });
    }

    function runPageCinema() {
        if (typeof PageCinema === "undefined") return;
        const targets = PageCinema.getActivePapers(
            book,
            isMobile,
            currentLocation,
            papers,
            maxLocation
        );
        PageCinema.sync(targets, {
            reducedMotion: prefersReducedMotion(),
            isMobile: isMobile()
        });
        targets.forEach((paper) => revealActiveBentoCards(paper));
    }

    /** Mobile: reset rá»“i báº­t láº¡i active Ä‘á»ƒ cháº¡y láº¡i hiá»‡u á»©ng Ä‘an xen má»—i láº§n Ä‘á»•i trang */
    function triggerMobilePageEntrance(visible) {
        if (!visible) return;

        const activeClass = visible.classList.contains("mobile-show-back") ? "active-left" : "active-right";

        visible.classList.remove("active-left", "active-right");
        visible.querySelectorAll(".pb-effect-popup, .pb-effect-reveal, .pb-effect-blur-in").forEach((el) => {
            el.classList.remove("play-anim");
        });

        void visible.offsetWidth;

        requestAnimationFrame(() => {
            visible.classList.add(activeClass);
            revealActiveBentoCards(visible);
            playEffectsOnPaper(visible);
            animateBentoEntrance(visible);
            runPageCinema();
        });
    }

    // Update active page classes to trigger transitions
    function updateActivePages() {
        const isBookClosed = currentLocation === 1 || currentLocation === maxLocation;

        if (isMobile()) {
            papers.forEach((paper) => {
                paper.classList.remove("active-left", "active-right");
                paper.querySelectorAll(".pb-effect-popup, .pb-effect-reveal, .pb-effect-blur-in").forEach((el) => {
                    el.classList.remove("play-anim");
                });
            });
            if (!isBookClosed) {
                const visible = book.querySelector(".paper.mobile-visible");
                triggerMobilePageEntrance(visible);
            } else if (currentLocation === 1) {
                triggerMobilePageEntrance(papers[0]);
            } else if (currentLocation === maxLocation) {
                triggerMobilePageEntrance(papers[numOfPapers - 1]);
            }
            return;
        }

        papers.forEach((paper, index) => {
            if (isBookClosed) {
                paper.classList.remove("active-left", "active-right");
                paper.querySelectorAll(".pb-effect-popup, .pb-effect-reveal, .pb-effect-blur-in").forEach((el) => {
                    el.classList.remove("play-anim");
                });
                return;
            }

            const isActiveLeft = currentLocation > 1 && index === currentLocation - 2;
            const isActiveRight = index === currentLocation - 1;
            
            if (isActiveLeft || isActiveRight) {
                if (isActiveLeft) {
                    paper.classList.add("active-left");
                } else {
                    paper.classList.add("active-right");
                }

                revealActiveBentoCards(paper);
                playEffectsOnPaper(paper);
                animateBentoEntrance(paper);
            } else {
                paper.classList.remove("active-left", "active-right");
                
                const effectContainers = paper.querySelectorAll(".pb-effect-popup, .pb-effect-reveal, .pb-effect-blur-in");
                effectContainers.forEach(container => {
                    container.classList.remove("play-anim");
                });
            }
        });

        runPageCinema();
    }

    /** Kích thước quyển sách full viewport (desktop: 2 trang khi mở; mobile: 1 trang full màn hình) */
    function updateBookLayout() {
        const mobile = isMobile();
        const vv = window.visualViewport;
        const viewW = vv ? vv.width : window.innerWidth;
        const viewH = vv ? vv.height : window.innerHeight;

        const pad = mobile ? 0 : 8;
        const navChrome = mobile
            ? 0
            : parseFloat(
                  getComputedStyle(document.documentElement).getPropertyValue("--nav-outside-chrome")
              ) || 136;
        const isSpread = !mobile && (
            book.classList.contains("open") || book.classList.contains("is-closing")
        );
        const spreadFactor = isSpread ? 2 : 1;
        const maxW = (viewW - pad - navChrome) / spreadFactor;
        const maxH = viewH - pad;

        let width;
        let height;
        if (mobile) {
            /* Mobile: phủ kín viewport (cover), stage cắt phần thừa */
            width = maxW;
            height = width / BOOK_ASPECT;
            if (height < maxH) {
                height = maxH;
                width = height * BOOK_ASPECT;
            }
        } else {
            height = maxH;
            width = height * BOOK_ASPECT;
            if (width > maxW) {
                width = maxW;
                height = width / BOOK_ASPECT;
            }
        }

        width = Math.floor(width);
        height = Math.floor(height);

        const stageWidth = isSpread ? width * 2 : width;

        document.documentElement.style.setProperty("--book-width", `${width}px`);
        document.documentElement.style.setProperty("--book-height", `${height}px`);
        document.documentElement.style.setProperty("--book-stage-width", `${stageWidth}px`);
        document.documentElement.style.setProperty("--book-scale", "1");
        syncBookPosition();
    }

    function clearDragTransform(paper) {
        if (!paper) return;
        paper.classList.remove("dragging");
        if (typeof gsap !== "undefined") {
            const flipped = paper.classList.contains("flipped");
            syncPaperRotation(paper, flipped);
        } else {
            paper.style.transform = "";
        }
    }

    function setNavLocked(locked) {
        isFlipAnimating = locked;
        prevBtn.disabled = locked || currentLocation === 1;
        nextBtn.disabled = locked || currentLocation === maxLocation;
    }

    function goNext(playAudio = true) {
        if (currentLocation >= maxLocation || isFlipAnimating) return false;
        if (playAudio) playSound();

        const currentPaper = papers[currentLocation - 1];
        setNavLocked(true);

        animatePageFlip(currentPaper, true, () => {
            currentPaper.style.zIndex = String(currentLocation);
            currentLocation++;
            const isFinalClose = currentLocation === maxLocation;

            if (isFinalClose) {
                updateNavButtons();
                updateMobileView();
                updateActivePages();

                if (isMobile()) {
                    updateBookLayout();
                    checkBookState();
                    updateActivePages();
                    setNavLocked(false);
                } else {
                    book.classList.add("open", "is-closing");
                    book.classList.remove("closed-back", "closed-front");
                    updateBookLayout();
                    animateBookSpread(false, () => {
                        book.classList.remove("is-closing");
                        checkBookState();
                        updateActivePages();
                        setNavLocked(false);
                    });
                }
            } else {
                const opening = currentLocation === 2;
                checkBookState(opening);
                updateNavButtons();
                updateActivePages();
                setNavLocked(false);
            }
        });

        return true;
    }

    function goPrev(playAudio = true) {
        if (currentLocation <= 1 || isFlipAnimating) return false;
        if (playAudio) playSound();

        const previousPaper = papers[currentLocation - 2];
        setNavLocked(true);

        animatePageFlip(previousPaper, false, () => {
            previousPaper.style.zIndex = String(numOfPapers - (currentLocation - 2));
            currentLocation--;
            const reopening = currentLocation === 1;
            checkBookState(reopening);
            updateNavButtons();
            updateActivePages();
            setNavLocked(false);
        });

        return true;
    }

    function getDragTarget(direction) {
        if (direction < 0 && currentLocation < maxLocation) {
            return { paper: papers[currentLocation - 1], direction: -1, baseAngle: 0 };
        }
        if (direction > 0 && currentLocation > 1) {
            const paper = papers[currentLocation - 2];
            const closedBack = currentLocation === maxLocation && book.classList.contains("closed-back");
            return { paper, direction: 1, baseAngle: closedBack ? 0 : -180 };
        }
        return null;
    }

    function isDragBlockedTarget(target) {
        return target && (
            target.closest(".nav-btn") ||
            target.closest(".mock-player") ||
            target.closest("button") ||
            target.closest("a") ||
            target.closest("input") ||
            target.closest("img[data-img-key]") ||
            target.closest(".image-lightbox")
        );
    }

    /** Bấm ảnh → phóng to full màn hình, nút X / Escape / nền để đóng */
    function initImageLightbox() {
        const lightbox = document.getElementById("image-lightbox");
        if (!lightbox) return;

        const lightboxImg = lightbox.querySelector(".image-lightbox__img");
        const closeBtn = lightbox.querySelector(".image-lightbox__close");
        const backdrop = lightbox.querySelector(".image-lightbox__backdrop");
        if (!lightboxImg || !closeBtn || !backdrop) return;

        const openLightbox = (sourceImg) => {
            const src = sourceImg.currentSrc || sourceImg.src;
            if (!src) return;
            lightboxImg.src = src;
            lightboxImg.alt = sourceImg.alt || "HiAn Cake";
            lightbox.classList.add("is-open");
            lightbox.setAttribute("aria-hidden", "false");
            document.body.classList.add("lightbox-open");
            closeBtn.focus();
        };

        const closeLightbox = () => {
            lightbox.classList.remove("is-open");
            lightbox.setAttribute("aria-hidden", "true");
            document.body.classList.remove("lightbox-open");
            lightboxImg.removeAttribute("src");
            lightboxImg.alt = "";
        };

        book.addEventListener("click", (e) => {
            const img = e.target.closest("img[data-img-key]");
            if (!img || !book.contains(img)) return;
            e.stopPropagation();
            e.preventDefault();
            openLightbox(img);
        });

        closeBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            closeLightbox();
        });

        backdrop.addEventListener("click", closeLightbox);

        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox || e.target.classList.contains("image-lightbox__stage")) {
                closeLightbox();
            }
        });

        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("is-open")) {
                closeLightbox();
            }
        });
    }

    function initPageDrag() {
        const onPointerDown = (e) => {
            if (isFlipAnimating) return;
            if (isDragBlockedTarget(e.target)) return;
            if (e.button !== undefined && e.button !== 0) return;

            isDragging = true;
            dragStartX = e.clientX;
            dragDirection = 0;
            dragPaper = null;
            book.classList.add("is-dragging");

            if (book.setPointerCapture && e.pointerId !== undefined) {
                try { book.setPointerCapture(e.pointerId); } catch (_) { /* ignore */ }
            }
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - dragStartX;
            const direction = deltaX < 0 ? -1 : deltaX > 0 ? 1 : 0;
            if (direction === 0) return;

            const target = getDragTarget(direction);
            if (!target) return;

            if (dragPaper && dragPaper !== target.paper) {
                clearDragTransform(dragPaper);
            }

            dragPaper = target.paper;
            dragDirection = target.direction;
            dragPaper.classList.add("dragging");

            const width = book.offsetWidth || parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--book-width")) || 480;
            const progress = Math.max(0, Math.min(1, Math.abs(deltaX) / (width * 0.45)));
            const angle = target.baseAngle + progress * -180 * target.direction;

            if (typeof gsap !== "undefined" && !isMobile()) {
                const setRot = paperRotY.get(dragPaper);
                if (setRot) setRot(angle);
                updatePageFlipFX(dragPaper, angle);
            } else {
                dragPaper.style.transform = `rotateY(${angle}deg)`;
            }
        };

        const finishDrag = (e) => {
            if (!isDragging) return;
            isDragging = false;
            book.classList.remove("is-dragging");

            if (book.releasePointerCapture && e.pointerId !== undefined) {
                try { book.releasePointerCapture(e.pointerId); } catch (_) { /* ignore */ }
            }

            const deltaX = e.clientX - dragStartX;
            const didFlip =
                (deltaX < -DRAG_THRESHOLD && goNext()) ||
                (deltaX > DRAG_THRESHOLD && goPrev());

            if (!didFlip && dragPaper) {
                const shouldBeFlipped = dragPaper.classList.contains("flipped");
                if (typeof gsap !== "undefined" && !isMobile()) {
                    animatePageFlip(dragPaper, shouldBeFlipped);
                } else {
                    clearDragTransform(dragPaper);
                }
            }

            dragPaper = null;
            dragDirection = 0;
        };

        book.addEventListener("pointerdown", onPointerDown);
        book.addEventListener("pointermove", onPointerMove);
        book.addEventListener("pointerup", finishDrag);
        book.addEventListener("pointercancel", finishDrag);
        book.addEventListener("lostpointercapture", (e) => {
            if (isDragging) finishDrag(e);
        });
    }

    nextBtn.addEventListener("click", () => goNext());
    prevBtn.addEventListener("click", () => goPrev());

    // Mock Audio Player Controller
    function initMockPlayer() {
        const playerContainer = document.querySelector(".mock-player");
        if (!playerContainer) return;
        
        const playBtn = playerContainer.querySelector(".player-btn:nth-child(2)");
        const progressLine = playerContainer.querySelector(".progress-bar-line");
        const progressHandle = playerContainer.querySelector(".progress-handle");
        const timeDisplay = playerContainer.querySelector(".player-time");
        
        if (!playBtn) return;
        
        let isPlaying = false;
        let progress = 30; // initial progress %
        let interval = null;
        
        playBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // Avoid triggering page flips
            isPlaying = !isPlaying;
            
            const icon = playBtn.querySelector("i");
            if (isPlaying) {
                icon.className = "fas fa-pause";
                playerContainer.classList.add("playing"); // KÃ­ch hoáº¡t visualizer sÃ³ng nháº¡c
                interval = setInterval(() => {
                    progress += 0.5;
                    if (progress > 100) {
                        progress = 0;
                    }
                    progressLine.style.width = `${progress}%`;
                    progressHandle.style.left = `${progress}%`;
                    
                    // Calculate mock time
                    let totalSeconds = 45;
                    let currentSeconds = Math.floor((progress / 100) * totalSeconds);
                    let formatSecs = currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds;
                    timeDisplay.textContent = `00.${formatSecs} / 00.45`;
                }, 100);
            } else {
                icon.className = "fas fa-play";
                playerContainer.classList.remove("playing"); // Táº¯t visualizer
                clearInterval(interval);
            }
        });
        
        // Reset button
        const resetBtn = playerContainer.querySelector(".player-btn:nth-child(1)");
        if (resetBtn) {
            resetBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                progress = 0;
                progressLine.style.width = `0%`;
                progressHandle.style.left = `0%`;
                timeDisplay.textContent = `00.00 / 00.45`;
                if (isPlaying) {
                    playBtn.click();
                }
            });
        }
    }

    // Bento 3D Tilt Effect (Luxury Micro-interaction)
    function initBentoTilt() {
        const cards = document.querySelectorAll(".bento-card");
        cards.forEach(card => {
            // KhÃ´ng Ã¡p dá»¥ng tilt cho cÃ¡c Ã´ chá»©a bento-img-wrap lá»›n Ä‘á»ƒ trÃ¡nh bá»‹ biáº¿n dáº¡ng áº£nh ngoÃ i Ã½ muá»‘n
            if (card.querySelector(".bento-img-wrap")) return;
            
            card.addEventListener("mousemove", (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const xc = rect.width / 2;
                const yc = rect.height / 2;
                
                // NghiÃªng nháº¹ tá»‘i Ä‘a 8 Ä‘á»™
                const angleX = (yc - y) / 10; 
                const angleY = (x - xc) / 10;
                
                card.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg) scale(1.02)`;
            });
            
            card.addEventListener("mouseleave", () => {
                card.style.transform = "";
            });
        });
    }

    reducedMotionMedia.addEventListener("change", () => {
        papers.forEach((paper) => {
            syncPaperRotation(paper, paper.classList.contains("flipped"));
        });
        runPageCinema();
    });

    // Initializations
    loadImages();
    initPhotoSlogans();
    initZIndex();
    initGsapFlipEngine();
    initBookEntrance();
    checkBookState();
    updateNavButtons();
    updateActivePages();
    initPageDrag();
    initImageLightbox();
    initMockPlayer();
    initBentoTilt();

    mobileMedia.addEventListener("change", () => {
        checkBookState();
        updateActivePages();
        runPageCinema();
    });

    let resizeTimer;
    function onViewportChange() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateBookLayout();
            updateMobileView();
            updateActivePages();
        }, 100);
    }

    window.addEventListener("resize", onViewportChange);
    if (window.visualViewport) {
        window.visualViewport.addEventListener("resize", onViewportChange);
        window.visualViewport.addEventListener("scroll", onViewportChange);
    }
});

