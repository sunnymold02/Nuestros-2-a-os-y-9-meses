/* =========================================================
   J ♡ C — JAVASCRIPT
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const openingScreen = document.getElementById("openingScreen");
    const enterButton = document.getElementById("enterButton");

    const musicButton = document.getElementById("musicButton");
    const largeMusicButton = document.getElementById("largeMusicButton");
    const music = document.getElementById("bgMusic");

    const canvas = document.getElementById("heartCanvas");
    const ctx = canvas.getContext("2d");

    let musicPlaying = false;
    let particles = [];
    let mouse = {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
    };


    /* =====================================================
       ENTRADA
    ====================================================== */

    document.body.classList.add("locked");

    enterButton.addEventListener("click", () => {

        openingScreen.classList.add("hidden");

        document.body.classList.remove("locked");

        createHeartBurst(
            window.innerWidth / 2,
            window.innerHeight / 2,
            35
        );

    });


    /* =====================================================
       MÚSICA
    ====================================================== */

    function updateMusicUI() {

        if (musicPlaying) {

            musicButton.classList.add("playing");
            musicButton.querySelector(".music-text").textContent =
                "Música encendida";

            document.body.classList.add("music-playing");

            largeMusicButton.querySelector("span:last-child").textContent =
                "Pausar música";

            document.querySelector(".music-section")
                ?.classList.add("playing");

        } else {

            musicButton.classList.remove("playing");
            musicButton.querySelector(".music-text").textContent =
                "Música apagada";

            document.body.classList.remove("music-playing");

            largeMusicButton.querySelector("span:last-child").textContent =
                "Reproducir música";

            document.querySelector(".music-section")
                ?.classList.remove("playing");
        }
    }


    async function toggleMusic() {

        try {

            if (music.paused) {

                await music.play();

                musicPlaying = true;

            } else {

                music.pause();

                musicPlaying = false;

            }

            updateMusicUI();

        } catch (error) {

            console.log(
                "El navegador necesita una interacción para reproducir el audio."
            );

        }

    }


    musicButton.addEventListener("click", toggleMusic);
    largeMusicButton.addEventListener("click", toggleMusic);


    /* =====================================================
       CANVAS
    ====================================================== */

    function resizeCanvas() {

        const ratio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = window.innerWidth * ratio;
        canvas.height = window.innerHeight * ratio;

        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";

        ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    resizeCanvas();

    window.addEventListener("resize", resizeCanvas);


    /* =====================================================
       PARTÍCULAS
    ====================================================== */

    class HeartParticle {

        constructor(x, y, burst = false) {

            this.x = x;
            this.y = y;

            this.vx =
                (Math.random() - .5) *
                (burst ? 3.5 : .35);

            this.vy =
                (Math.random() - .5) *
                (burst ? 3.5 : 0.8);

            this.size =
                Math.random() *
                (burst ? 8 : 4) +
                (burst ? 4 : 2);

            this.life =
                burst
                    ? 1
                    : Math.random() * .6 + .2;

            this.decay =
                burst
                    ? Math.random() * .012 + .008
                    : Math.random() * .002 + .0005;

            this.rotation =
                Math.random() * Math.PI * 2;

            this.rotationSpeed =
                (Math.random() - .5) * .02;

            this.symbol =
                Math.random() > .25
                    ? "♡"
                    : "✦";
        }


        update() {

            this.x += this.vx;
            this.y += this.vy;

            this.vy -= .002;

            this.rotation += this.rotationSpeed;

            this.life -= this.decay;

        }


        draw() {

            if (this.life <= 0) return;

            ctx.save();

            ctx.globalAlpha =
                Math.max(this.life, 0) *
                (Math.random() > .5 ? .45 : .7);

            ctx.translate(
                this.x,
                this.y
            );

            ctx.rotate(this.rotation);

            ctx.font =
                `${this.size * 3}px Cormorant Garamond`;

            ctx.fillStyle =
                Math.random() > .25
                    ? "#d78a9e"
                    : "#c9a77b";

            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            ctx.fillText(
                this.symbol,
                0,
                0
            );

            ctx.restore();
        }
    }


    /* =====================================================
       CREAR PARTÍCULAS
    ====================================================== */

    function createAmbientParticle() {

        particles.push(
            new HeartParticle(
                Math.random() * window.innerWidth,
                window.innerHeight + 20,
                false
            )
        );
    }


    function createHeartBurst(x, y, amount = 20) {

        for (let i = 0; i < amount; i++) {

            particles.push(
                new HeartParticle(
                    x,
                    y,
                    true
                )
            );

        }
    }


    /* =====================================================
       LOOP DEL CANVAS
    ====================================================== */

    function animateCanvas() {

        ctx.clearRect(
            0,
            0,
            window.innerWidth,
            window.innerHeight
        );

        if (Math.random() < .16) {
            createAmbientParticle();
        }

        particles.forEach(
            particle => {
                particle.update();
                particle.draw();
            }
        );

        particles =
            particles.filter(
                particle => particle.life > 0
            );

        if (particles.length > 180) {
            particles.splice(
                0,
                particles.length - 180
            );
        }

        requestAnimationFrame(
            animateCanvas
        );
    }

    animateCanvas();


    /* =====================================================
       MOUSE
    ====================================================== */

    window.addEventListener("mousemove", event => {

        mouse.x = event.clientX;
        mouse.y = event.clientY;

        if (Math.random() < .045) {

            particles.push(
                new HeartParticle(
                    mouse.x,
                    mouse.y,
                    true
                )
            );

        }

    });


    /* =====================================================
       CLICK = CORAZONES
    ====================================================== */

    document.addEventListener("click", event => {

        if (
            event.target.closest("button") ||
            event.target.closest("a")
        ) {
            return;
        }

        createHeartBurst(
            event.clientX,
            event.clientY,
            10
        );

    });


    /* =====================================================
       REVEAL AL HACER SCROLL
    ====================================================== */

    const revealElements =
        document.querySelectorAll(".reveal");


    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                });

            },
            {
                threshold: .12
            }
        );


    revealElements.forEach(
        element =>
            revealObserver.observe(element)
    );


    /* =====================================================
       PARALLAX SUTIL
    ====================================================== */

    const decorations =
        document.querySelectorAll(
            ".hero-decoration"
        );


    window.addEventListener(
        "mousemove",
        event => {

            const x =
                (event.clientX /
                    window.innerWidth -
                    .5);

            const y =
                (event.clientY /
                    window.innerHeight -
                    .5);

            decorations.forEach(
                (element, index) => {

                    const strength =
                        (index + 1) * 8;

                    element.style.transform =
                        `translate(
                            ${x * strength}px,
                            ${y * strength}px
                        )`;

                }
            );

        }
    );


    /* =====================================================
       SUAVIZAR ENLACES
    ====================================================== */

    document.querySelectorAll(
        'a[href^="#"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const target =
                    document.querySelector(
                        link.getAttribute("href")
                    );

                if (!target) return;

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    });


    /* =====================================================
       EFECTO AL LLEGAR AL FINAL
    ====================================================== */

    const finalSection =
        document.querySelector(
            ".final-words-section"
        );


    const finalObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        createHeartBurst(
                            window.innerWidth / 2,
                            window.innerHeight / 2,
                            45
                        );

                    }

                });

            },
            {
                threshold: .4
            }
        );


    if (finalSection) {
        finalObserver.observe(
            finalSection
        );
    }


    /* =====================================================
       VINILO / MÚSICA
    ====================================================== */

    music.addEventListener(
        "play",
        () => {

            musicPlaying = true;
            updateMusicUI();

        }
    );


    music.addEventListener(
        "pause",
        () => {

            musicPlaying = false;
            updateMusicUI();

        }
    );


    /* =====================================================
       INICIO
    ====================================================== */

    updateMusicUI();

});
