document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    const cyberToggle = document.getElementById('cyber-toggle');
    const body = document.body;
    const transitionOverlay = document.querySelector('.transition-overlay');
    const splash = document.getElementById('cyber-splash');
    const heroImg = document.getElementById('cyber-hero-img');
    const heroName = document.getElementById('cyber-hero-name');
    const iris = document.querySelector('.iris-flash');

    const isCyberPage = window.location.pathname.includes('cyber-');

    // --- AUDIO SYSTEM (Aura & Lo-Fi) ---
    let ambientAudio = null;
    const TRACKS = {
        standard: 'audio/Origami.mp3',
        sunset: 'audio/Snowfall.mp3'
    };

    function initAmbientAudio() {
        // Inject Mute Button if missing
        if (!document.getElementById('cyber-mute-btn')) {
            const btn = document.createElement('button');
            btn.id = 'cyber-mute-btn';
            btn.title = 'Toggle Ambient Audio';
            btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path class="volume-waves" d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            cyberToggle.insertAdjacentElement('afterend', btn);
            btn.addEventListener('click', toggleMute);
        }

        // Inject Volume Slider if missing
        if (!document.getElementById('cyber-volume-slider')) {
            const container = document.createElement('div');
            container.className = 'cyber-volume-container';

            const slider = document.createElement('input');
            slider.type = 'range';
            slider.id = 'cyber-volume-slider';
            slider.min = '0';
            slider.max = '1';
            slider.step = '0.01';
            slider.title = 'Volume Control';

            container.innerHTML = '<div class="volume-track-fill"></div>';
            container.appendChild(slider);
            document.getElementById('cyber-mute-btn').insertAdjacentElement('afterend', container);

            slider.addEventListener('input', (e) => {
                const vol = parseFloat(e.target.value);
                // ambientAudio.volume = vol; // Removed to let loop logic handle smoothing
                localStorage.setItem('spirit_audio_volume', vol);
                updateSliderGlow(vol);
            });
        }

        function updateSliderGlow(vol) {
            const fill = document.querySelector('.volume-track-fill');
            if (fill) fill.style.height = (vol * 100) + '%';
        }

        const currentTrack = isCyberPage ? TRACKS.sunset : TRACKS.standard;
        ambientAudio = new Audio(currentTrack);
        ambientAudio.loop = true;

        // Default to 0.25 or restored value
        const savedVol = localStorage.getItem('spirit_audio_volume');
        const defaultVol = savedVol !== null ? parseFloat(savedVol) : 0.25;
        // Start at 0 for fade-in
        ambientAudio.volume = 0;
        document.getElementById('cyber-volume-slider').value = defaultVol;
        updateSliderGlow(defaultVol);

        // Restore State
        const savedTime = localStorage.getItem('spirit_audio_time');
        const isMuted = localStorage.getItem('spirit_audio_muted') === 'true';

        if (savedTime && !isNaN(parseFloat(savedTime))) {
            ambientAudio.currentTime = parseFloat(savedTime);
        }
        ambientAudio.muted = isMuted;
        updateMuteUI(isMuted);

        // Fading Logic Variables
        let fadeInterval = null;
        const fadeDuration = 3000; // ms

        // Fade In Function
        const fadeIn = () => {
            // Clear any existing fade interval to prevent conflicts
            if (fadeInterval) clearInterval(fadeInterval);

            const startVol = ambientAudio.volume;
            // Get latest target volume from slider
            const targetVol = parseFloat(document.getElementById('cyber-volume-slider').value);
            const step = 50;
            const increment = targetVol / (fadeDuration / step);

            fadeInterval = setInterval(() => {
                if (ambientAudio.volume >= targetVol) {
                    ambientAudio.volume = targetVol;
                    clearInterval(fadeInterval);
                } else {
                    // Safe increment
                    ambientAudio.volume = Math.min(targetVol, ambientAudio.volume + increment);
                }
            }, step);
        };

        // Auto-play attempt with Fade In
        const tryPlay = () => {
            ambientAudio.play().then(() => {
                if (!ambientAudio.muted) fadeIn();
            }).catch(() => {
                document.addEventListener('click', () => {
                    if (ambientAudio) {
                        ambientAudio.play();
                        if (!ambientAudio.muted) fadeIn();
                    }
                }, { once: true });
            });
        };
        tryPlay();

        // Loop Fading Logic
        ambientAudio.addEventListener('timeupdate', () => {
            const timeLeft = ambientAudio.duration - ambientAudio.currentTime;
            const targetVol = parseFloat(document.getElementById('cyber-volume-slider').value);

            // Fade Out near end (last 4 seconds)
            if (timeLeft < 4 && !ambientAudio.paused) {
                // Calculate volume based on time left to smooth out 
                // (TimeLeft / 4) * Target -> goes to 0 as TimeLeft goes to 0
                const fadeOutVol = (timeLeft / 4) * targetVol;
                ambientAudio.volume = Math.max(0, fadeOutVol);
            }
            // Fade In at start (first 4 seconds) - Handle Loop Restart
            else if (ambientAudio.currentTime < 4 && !ambientAudio.paused) {
                const fadeInVol = (ambientAudio.currentTime / 4) * targetVol;
                ambientAudio.volume = Math.min(targetVol, fadeInVol);
            }
            else {
                // Ensure volume is steady in the middle
                // Only reset if we aren't manually dragging slider? 
                // Actually, just set it to target to correct any drift
                // But check if manual volume change happening?
                // For simplicity, snapping to target is safest for pure loop logic
                if (Math.abs(ambientAudio.volume - targetVol) > 0.01) {
                    ambientAudio.volume = targetVol;
                }
            }
        });

        // Save progress periodically
        setInterval(() => {
            if (ambientAudio && !ambientAudio.paused) {
                localStorage.setItem('spirit_audio_time', ambientAudio.currentTime);
            }
        }, 1000);
    }

    function toggleMute() {
        if (!ambientAudio) return;
        const newMuted = !ambientAudio.muted;
        ambientAudio.muted = newMuted;
        localStorage.setItem('spirit_audio_muted', newMuted);
        updateMuteUI(newMuted);
    }

    function updateMuteUI(muted) {
        const waves = document.querySelector('.volume-waves');
        if (waves) waves.style.opacity = muted ? '0' : '1';
        const btn = document.getElementById('cyber-mute-btn');
        if (btn) btn.style.borderColor = muted ? 'rgba(255,255,255,0.3)' : 'var(--spirit-white)';
        const slider = document.getElementById('cyber-volume-slider');
        if (slider) slider.style.opacity = muted ? '0.3' : '1';
    }

    // Always start audio on first interaction
    initAmbientAudio();

    // --- AUDIO SHIMMER (Harmonic Bloom) ---
    function playShimmer() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const gain = ctx.createGain();

            // Primary Sine Chime
            const osc1 = ctx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5 (Pleasant tone)

            // Soft Shimmer Harmonic
            const osc2 = ctx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(1046.50, ctx.currentTime); // C6 (Octave up)

            gain.gain.setValueAtTime(0.04, ctx.currentTime); // Much quieter
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2); // Longer, softer fade

            osc1.connect(gain);
            osc2.connect(gain);
            gain.connect(ctx.destination);

            osc1.start();
            osc2.start();
            osc1.stop(ctx.currentTime + 1.2);
            osc2.stop(ctx.currentTime + 1.2);
        } catch (e) { console.log("Audio limited by browser"); }
    }

    // HAND-CRAFTED SVG MOTIFS (NO AI USED)
    const MIRAI_GLASSES_SVG = `
        <svg viewBox="0 0 120 50" class="header-glasses-svg" style="width: 100px; margin: 0 auto 15px; display: block;">
            <path d="M10,15 L10,25 Q10,40 35,40 Q60,40 60,15 Q60,40 85,40 Q110,40 110,25 L110,15" fill="none" stroke="var(--mirai-red)" stroke-width="5" stroke-linecap="round"/>
            <rect x="15" y="10" width="35" height="20" rx="5" fill="rgba(255,255,255,0.1)" stroke="var(--mirai-red)" stroke-width="4"/>
            <rect x="70" y="10" width="35" height="20" rx="5" fill="rgba(255,255,255,0.1)" stroke="var(--mirai-red)" stroke-width="4"/>
            <path d="M50,20 L70,20" stroke="var(--mirai-red)" stroke-width="4"/>
        </svg>
    `;

    const ANTLER_LEFT = `
        <svg viewBox="0 0 100 120" class="antler-svg antler-left deco-svg">
            <path d="M90,110 C80,80 60,70 50,50 M90,110 C100,75 80,30 65,10" 
                  fill="none" stroke="#8d6e63" stroke-width="12" stroke-linecap="round"/>
        </svg>
    `;

    const ANTLER_RIGHT = `
        <svg viewBox="0 0 100 120" class="antler-svg antler-right deco-svg">
            <path d="M10,110 C20,80 40,70 50,50 M10,110 C0,75 20,30 35,10" 
                  fill="none" stroke="#8d6e63" stroke-width="12" stroke-linecap="round"/>
        </svg>
    `;

    const LILY_SVG = `
        <svg viewBox="0 0 120 120" class="lily-svg deco-svg">
            <g fill="none" stroke="#ff1744" stroke-width="4" stroke-linecap="round">
                <path d="M60,115 C60,85 20,65 10,40 M60,115 C60,85 100,65 110,40 M60,115 C60,75 10,85 5,105 M60,115 C60,75 110,85 115,105 M60,115 C60,65 30,30 20,10 M60,115 C60,65 90,30 100,10"/>
                <circle cx="60" cy="115" r="5" fill="#ff1744"/>
            </g>
        </svg>
    `;

    if (isCyberPage) {
        body.classList.add('cyber-mode');
        // Ensure Iris Wipe exists
        if (!document.querySelector('.circle-wipe')) {
            const wipe = document.createElement('div');
            wipe.className = 'circle-wipe';
            body.appendChild(wipe);
        }
        initAnimeSpirit();
        updateNavLinks();

        if (window.location.pathname.includes('cyber-index')) {
            startProtocol(true);
        } else {
            applyCyberStylesDirectly();
        }
    } else {
        // --- Standard Site Entry Animations ---
        initStandardAnimations();
    }

    function initStandardAnimations() {
        const header = document.querySelector('header');
        const sections = document.querySelectorAll('.content-section');
        const footer = document.querySelector('footer');

        // Hide only the header and footer for the initial reveal
        if (header) header.classList.add('reveal-hidden');
        if (footer) footer.classList.add('reveal-hidden');
        // Sections will be handled by individual animations/triggers
        sections.forEach(s => s.classList.add('reveal-hidden'));

        // --- HUD Splash Injection ---
        const splashHTML = `
            <div id="standard-splash">
                <div class="hud-iris">
                    <img src="images/red_spider_lily.jpg" alt="Hero">
                    <div class="hud-scanner"></div>
                </div>
                <h1 id="standard-hero-name">ARSHDEEP</h1>
            </div>
        `;
        document.body.insertAdjacentHTML('afterbegin', splashHTML);

        const splash = document.getElementById('standard-splash');
        const scanner = splash.querySelector('.hud-scanner');
        const heroName = splash.querySelector('#standard-hero-name');
        const iris = splash.querySelector('.hud-iris');

        const tl = gsap.timeline();

        // HUD Sequence
        tl.fromTo(iris, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" })
            .fromTo(scanner, { top: "-100%" }, { top: "100%", duration: 1.5, repeat: 1, ease: "none" }, "-=0.2")
            .fromTo(heroName, { opacity: 0, scale: 0.8, letterSpacing: "30px" }, { opacity: 1, scale: 1, letterSpacing: "12px", duration: 1, ease: "power4.out" }, "-=1.5")
            .to(splash, {
                opacity: 0, duration: 0.8, delay: 0.3, ease: "power2.inOut", onComplete: () => {
                    splash.remove();
                    ScrollTrigger.refresh();
                }
            });

        // Reveal Header and Footer initially
        tl.to([header, footer], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        }, "-=0.4");

        // Scroll Reveal for sections - use "to" with reveal-hidden instead of "from" to avoid conflicts
        sections.forEach(section => {
            gsap.to(section, {
                scrollTrigger: {
                    trigger: section,
                    start: "top 92%",
                    toggleActions: "play none none reverse"
                },
                opacity: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out"
            });
        });
    }

    cyberToggle.addEventListener('click', () => {
        const pageMap = {
            'index.html': 'cyber-index.html',
            'flexbox-projects.html': 'cyber-projects.html',
            'grid-gallery.html': 'cyber-gallery.html',
            'bootstrap-resume.html': 'cyber-resume.html',
            'interactive.html': 'cyber-interactive.html'
        };

        const reverseMap = Object.fromEntries(Object.entries(pageMap).map(([k, v]) => [v, k]));
        const currentPath = window.location.pathname.split('/').pop() || 'index.html';

        playShimmer();

        if (!isCyberPage) {
            const target = pageMap[currentPath] || 'cyber-index.html';
            startProtocol();
            setTimeout(() => { window.location.href = target; }, 2500);
        } else {
            const target = reverseMap[currentPath] || 'index.html';
            window.location.href = target;
        }
    });

    function initAnimeSpirit() {
        createAtmosphere();
        injectDeco();

        // Add Mirai's glasses to header
        const header = document.querySelector('header');
        if (header && !document.querySelector('.header-glasses-svg')) {
            header.querySelector('h1').insertAdjacentHTML('beforebegin', MIRAI_GLASSES_SVG);
        }

        // Add Red Spider Lily Web Image (Atmospheric background)
        if (!document.querySelector('.lily-web-img')) {
            const img = document.createElement('img');
            img.src = 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Red_Spider_Lily----Lycoris_radiata.jpg';
            img.className = 'lily-web-img';
            img.alt = 'Red Spider Lily';
            body.appendChild(img);
        }
    }

    function injectDeco() {
        document.querySelectorAll('.content-section').forEach(section => {
            if (!section.querySelector('.antler-left')) {
                section.insertAdjacentHTML('afterbegin', ANTLER_LEFT);
                section.insertAdjacentHTML('afterbegin', ANTLER_RIGHT);
                section.insertAdjacentHTML('beforeend', LILY_SVG);
            }
        });
    }

    function updateNavLinks() {
        const navLinks = document.querySelectorAll('nav a');
        const map = {
            'index.html': 'cyber-index.html',
            'flexbox-projects.html': 'cyber-projects.html',
            'grid-gallery.html': 'cyber-gallery.html',
            'bootstrap-resume.html': 'cyber-resume.html',
            'interactive.html': 'cyber-interactive.html'
        };
        navLinks.forEach(link => {
            const h = link.getAttribute('href');
            if (h && (map[h] || Object.values(map).includes(h))) {
                // If we are already in cyber mode, links targets should be cyber
                if (map[h]) link.setAttribute('href', map[h]);
            }
        });
    }

    function applyCyberStylesDirectly() {
        body.classList.add('cyber-mode');
        gsap.from(".content-section", {
            opacity: 0, y: 120, scale: 0.95, duration: 1.5, stagger: 0.25, ease: "expo.out"
        });
    }

    function startProtocol(skipOverlay = false) {
        const tl = gsap.timeline();
        let wipe = document.querySelector('.circle-wipe');

        if (!wipe) {
            wipe = document.createElement('div');
            wipe.className = 'circle-wipe';
            body.appendChild(wipe);
        }

        if (!skipOverlay && wipe) {
            tl.to(wipe, { clipPath: "circle(150% at 50% 50%)", duration: 1.2, ease: "power4.inOut" })
                .set(body, { className: "cyber-mode" })
                .set(splash, { display: "flex" })
                .to(wipe, { opacity: 0, duration: 0.8, onComplete: () => gsap.set(wipe, { clipPath: "circle(0% at 50% 50%)", opacity: 1 }) });
        } else {
            tl.set(body, { className: "cyber-mode" }).set(splash, { display: "flex", opacity: 1 });
        }

        // Anime OP Entrance
        tl.fromTo(heroImg, { opacity: 0, scale: 0.5, y: 150 }, { opacity: 1, scale: 1, y: 0, duration: 1, ease: "back.out(1.7)" }, skipOverlay ? 0.1 : "-=0.2")
            .fromTo(heroName, { opacity: 0, y: 50, scale: 1.3 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.5)" }, "-=0.4");

        tl.to(splash, {
            opacity: 0, duration: 1.2, delay: 1.5, ease: "power4.inOut", onComplete: () => {
                gsap.set(splash, { display: "none" });
                ScrollTrigger.refresh();
            }
        });

        // Scroll animations
        document.querySelectorAll('.content-section').forEach(section => {
            gsap.from(section, {
                opacity: 0, y: 180, scale: 0.9, duration: 1.5,
                scrollTrigger: { trigger: section, start: "top 95%", toggleActions: "play none none reverse" }
            });
        });
    }

    function createAtmosphere() {
        const layer = document.createElement('div');
        layer.className = 'atmosphere-layer';
        body.appendChild(layer);

        // Falling items + Spirit Orbs
        for (let i = 0; i < 60; i++) {
            const item = document.createElement('div');
            const r = Math.random();
            let bg = '#ff1744';
            let size = 12;
            let radius = '50% 0 50% 50%';
            let isOrb = false;

            if (r > 0.9) { // Spirit Orb
                bg = 'radial-gradient(circle, #fff, var(--mirai-red))';
                size = 15;
                radius = '50%';
                isOrb = true;
                item.className = 'spirit-orb';
            } else if (r > 0.7) { // Red glass bit Simple
                bg = 'rgba(214, 48, 49, 0.6)';
                size = 6;
                radius = '2px';
            } else if (r > 0.4) { // Amber spirit
                bg = '#ffe082';
                size = 8;
                radius = '50%';
            }

            gsap.set(item, {
                position: 'fixed', x: Math.random() * window.innerWidth, y: -100,
                width: size, height: size, background: bg, borderRadius: radius,
                opacity: Math.random() * 0.6 + 0.3, zIndex: -1
            });

            layer.appendChild(item);

            gsap.to(item, {
                y: window.innerHeight + 100, x: "+=" + (Math.random() * 400 - 200),
                rotate: isOrb ? 0 : "+=" + (Math.random() * 1440),
                duration: isOrb ? Math.random() * 15 + 15 : Math.random() * 12 + 10,
                repeat: -1, delay: Math.random() * 20, ease: "none"
            });
        }
    }
});

function randomAntlerTwitch() {
    const antlers = document.querySelectorAll('.antler-svg');
    if (antlers.length === 0) return;
    const target = antlers[Math.floor(Math.random() * antlers.length)];
    gsap.to(target, {
        rotate: (target.classList.contains('antler-left') ? -30 : 30),
        scale: 1.15,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
    });
    setTimeout(randomAntlerTwitch, Math.random() * 5000 + 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.body.classList.contains('cyber-mode')) {
        setTimeout(randomAntlerTwitch, 3000);
    }
});
