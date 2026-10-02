/* ================================================= */
/* J ♡ C — NUESTRA HISTORIA                         */
/* ================================================= */


/* ================================================= */
/* ELEMENTOS                                         */
/* ================================================= */

const openingScreen = document.getElementById("openingScreen");
const enterButton = document.getElementById("enterButton");

const musicButton = document.getElementById("musicButton");
const musicCardButton = document.getElementById("musicCardButton");

const musicText = document.getElementById("musicText");
const bgMusic = document.getElementById("bgMusic");

const canvas = document.getElementById("heartCanvas");
const ctx = canvas.getContext("2d");


/* ================================================= */
/* PANTALLA DE INICIO                                */
/* ================================================= */

enterButton.addEventListener("click", () => {

    openingScreen.classList.add("hidden");

    setTimeout(() => {

        document.body.classList.add("site-open");

    }, 500);

    startMusic();

});


/* ================================================= */
/* MÚSICA                                            */
/* ================================================= */

let musicPlaying = false;


async function startMusic() {

    try {

        await bgMusic.play();

        musicPlaying = true;

        updateMusicUI();

    } catch (error) {

        musicPlaying = false;

        updateMusicUI();

    }

}


function toggleMusic() {

    if (bgMusic.paused) {

        bgMusic.play()
            .then(() => {

                musicPlaying = true;

                updateMusicUI();

            })
            .catch(() => {

                musicPlaying = false;

                updateMusicUI();

            });

    } else {

        bgMusic.pause();

        musicPlaying = false;

        updateMusicUI();

    }

}


function updateMusicUI() {

    if (musicPlaying) {

        musicText.textContent = "Música: Encendida";

        musicButton.classList.add("active");

        document.body.classList.add("music-playing");

        if (musicCardButton) {

            musicCardButton.querySelector(".play-symbol").textContent = "❚❚";

        }

    } else {

        musicText.textContent = "Música: Apagada";

        musicButton.classList.remove("active");

        document.body.classList.remove("music-playing");

        if (musicCardButton) {

            musicCardButton.querySelector(".play-symbol").textContent = "▶";

        }

    }

}


musicButton.addEventListener("click", toggleMusic);


if (musicCardButton) {

    musicCardButton.addEventListener("click", toggleMusic);

}


/* ================================================= */
/* CANVAS                                             */
/* ================================================= */

let width = window.innerWidth;
let height = window.innerHeight;


function resizeCanvas() {

    width = window.innerWidth;

    height = window.innerHeight;

    canvas.width = width * window.devicePixelRatio;

    canvas.height = height * window.devicePixelRatio;

    canvas.style.width = width + "px";

    canvas.style.height = height + "px";

    ctx.setTransform(
        window.devicePixelRatio,
        0,
        0,
        window.devicePixelRatio,
        0,
        0
    );

}


resizeCanvas();


window.addEventListener("resize", resizeCanvas);


/* ================================================= */
/* CORAZONES FLOTANTES                                */
/* ================================================= */

const hearts = [];

const heartCharacters = [
    "♡",
    "♡",
    "♥",
    "✦"
];


function random(min, max) {

    return Math.random() * (max - min) + min;

}


function createHeart(
    x = random(0, width),
    y = height + random(10, 100),
    burst = false
) {

    hearts.push({

        x: x,

        y: y,

        size: burst
            ? random(10, 24)
            : random(8, 17),

        speed: burst
            ? random(.5, 2.5)
            : random(.15, .55),

        drift: random(-.35, .35),

        rotation: random(-.5, .5),

        rotationSpeed: random(-.01, .01),

        opacity: random(.15, .55),

        life: burst
            ? 1
            : random(.5, 1),

        burst: burst,

        char:
            heartCharacters[
                Math.floor(
                    Math.random() *
                    heartCharacters.length
                )
            ]

    });

}


for (let i = 0; i < 35; i++) {

    createHeart(
        random(0, width),
        random(0, height)
    );

}


function drawHeart(heart) {

    ctx.save();

    ctx.translate(
        heart.x,
        heart.y
    );

    ctx.rotate(
        heart.rotation
    );

    ctx.globalAlpha =
        heart.opacity *
        heart.life;

    ctx.font =
        `${heart.size}px Cormorant Garamond`;

    ctx.textAlign = "center";

    ctx.textBaseline = "middle";

    ctx.fillStyle =
        heart.char === "✦"
            ? "#c9a77b"
            : "#d28a9f";

    ctx.fillText(
        heart.char,
        0,
        0
    );

    ctx.restore();

}


function animateHearts() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    for (let i = hearts.length - 1; i >= 0; i--) {

        const heart = hearts[i];


        heart.y -= heart.speed;

        heart.x +=
            Math.sin(
                heart.y * .008
            ) * heart.drift;


        heart.rotation +=
            heart.rotationSpeed;


        if (heart.burst) {

            heart.life -= .012;

        }


        drawHeart(heart);


        if (
            heart.y < -50 ||
            heart.life <= 0
        ) {

            hearts.splice(i, 1);

        }

    }


    while (hearts.length < 35) {

        createHeart();

    }


    requestAnimationFrame(
        animateHearts
    );

}


animateHearts();


/* ================================================= */
/* EXPLOSIÓN DE CORAZONES AL HACER CLICK             */
/* ================================================= */

function heartBurst(x, y) {

    for (let i = 0; i < 12; i++) {

        const heart = {

            x: x,

            y: y,

            size: random(10, 22),

            speed: random(.5, 2.5),

            drift: random(-2, 2),

            rotation: random(-1, 1),

            rotationSpeed: random(-.05, .05),

            opacity: random(.4, .9),

            life: 1,

            burst: true,

            char:
                Math.random() > .2
                    ? "♡"
                    : "✦"

        };

        hearts.push(heart);

    }

}


document.addEventListener(
    "click",
    (event) => {

        if (
            event.target.closest("button") ||
            event.target.closest("a")
        ) {

            return;

        }


        heartBurst(
            event.clientX,
            event.clientY
        );

    }
);


/* ================================================= */
/* REVEAL AL HACER SCROLL                            */
/* ================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.classList.add(
                            "visible"
                        );

                        revealObserver.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: .12
        }
    );


revealElements.forEach(
    (element) => {

        revealObserver.observe(
            element
        );

    }
);


/* ================================================= */
/* PARALLAX SUAVE                                    */
/* ================================================= */

let ticking = false;


function handleParallax() {

    const scroll =
        window.scrollY;


    document
        .querySelectorAll(".hero-glow")
        .forEach(
            (element, index) => {

                const movement =
                    scroll *
                    (index === 0
                        ? .08
                        : -.05);

                element.style.transform =
                    `translateY(${movement}px)`;

            }
        );


    ticking = false;

}


window.addEventListener(
    "scroll",
    () => {

        if (!ticking) {

            window.requestAnimationFrame(
                handleParallax
            );

            ticking = true;

        }

    },
    {
        passive: true
    }
);


/* ================================================= */
/* NAVEGACIÓN SUAVE                                  */
/* ================================================= */

document
    .querySelectorAll(
        'a[href^="#"]'
    )
    .forEach(
        (link) => {

            link.addEventListener(
                "click",
                (event) => {

                    const targetId =
                        link.getAttribute("href");


                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {

                        return;

                    }


                    event.preventDefault();


                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }
            );

        }
    );


/* ================================================= */
/* PAUSAR MÚSICA SI LA PÁGINA NO ESTÁ VISIBLE       */
/* ================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            document.hidden &&
            !bgMusic.paused
        ) {

            bgMusic.pause();

            musicPlaying = false;

            updateMusicUI();

        }

    }
);


/* ================================================= */
/* EFECTO FINAL                                      */
/* ================================================= */

const finalSection =
    document.getElementById("final");


let finalTriggered = false;


const finalObserver =
    new IntersectionObserver(
        (entries) => {

            entries.forEach(
                (entry) => {

                    if (
                        entry.isIntersecting &&
                        !finalTriggered
                    ) {

                        finalTriggered = true;


                        setTimeout(
                            () => {

                                for (
                                    let i = 0;
                                    i < 25;
                                    i++
                                ) {

                                    createHeart(
                                        random(
                                            width * .25,
                                            width * .75
                                        ),
                                        height * .75,
                                        true
                                    );

                                }

                            },
                            400
                        );

                    }

                }
            );

        },
        {
            threshold: .35
        }
    );


if (finalSection) {

    finalObserver.observe(
        finalSection
    );

}


/* ================================================= */
/* MENSAJE DE AUDIO                                  */
/* ================================================= */

bgMusic.addEventListener(
    "play",
    () => {

        musicPlaying = true;

        updateMusicUI();

    }
);


bgMusic.addEventListener(
    "pause",
    () => {

        musicPlaying = false;

        updateMusicUI();

    }
);


/* ================================================= */
/* CARGA INICIAL                                     */
/* ================================================= */

window.addEventListener(
    "load",
    () => {

        document
            .querySelectorAll(".hero .reveal")
            .forEach(
                (element) => {

                    setTimeout(
                        () => {

                            element.classList.add(
                                "visible"
                            );

                        },
                        700
                    );

                }
            );

    }
);
