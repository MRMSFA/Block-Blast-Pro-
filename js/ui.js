"use strict";

/* =========================================================
   BLOCK BLAST PRO
   UI + SETTINGS + GAME OVER + REPLAY + HOME
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

const BLOCK_BLAST_SETTINGS_KEY =
    "blockblast_settings";


const defaultSettings = {
    music: true,
    sfx: true,
    vibration: true,
    musicVolume: 0.28,
    musicTrack: "default"
};


let blockBlastSettings = {
    ...defaultSettings
};


/* =========================================================
   LOAD SETTINGS
========================================================= */

function loadBlockBlastSettings() {

    try {

        const saved =
            localStorage.getItem(
                BLOCK_BLAST_SETTINGS_KEY
            );


        if (saved) {

            const parsed =
                JSON.parse(saved);


            blockBlastSettings = {
                ...defaultSettings,
                ...parsed
            };

        }

    } catch (error) {

        console.warn(
            "Could not load settings.",
            error
        );

        blockBlastSettings = {
            ...defaultSettings
        };

    }

}


loadBlockBlastSettings();


/* =========================================================
   SAVE SETTINGS
========================================================= */

function saveBlockBlastSettings() {

    try {

        localStorage.setItem(
            BLOCK_BLAST_SETTINGS_KEY,
            JSON.stringify(
                blockBlastSettings
            )
        );

    } catch (error) {

        console.warn(
            "Could not save settings.",
            error
        );

    }

}


window.saveBlockBlastSettings =
    saveBlockBlastSettings;


/* =========================================================
   VIBRATION
========================================================= */

function blockBlastVibrate(pattern) {

    if (!blockBlastSettings.vibration) {
        return;
    }


    if ("vibrate" in navigator) {

        try {

            navigator.vibrate(pattern);

        } catch (error) {}

    }

}


window.BlockBlastVibrate =
    blockBlastVibrate;


/* =========================================================
   UI OBJECT
========================================================= */

const BlockBlastUI = {

    loadingScreen:
        document.getElementById(
            "loading-screen"
        ),

    mainMenu:
        document.getElementById(
            "main-menu"
        ),

    game:
        document.getElementById(
            "game"
        ),

    playButton:
        document.getElementById(
            "play-button"
        ),

    menuBestScore:
        document.getElementById(
            "menu-best-score"
        ),

    settingsButton:
        document.getElementById(
            "settings-button"
        ),

    settingsPanel:
        document.getElementById(
            "settings-panel"
        ),

    settingsClose:
        document.getElementById(
            "settings-close"
        ),

    musicToggle:
        document.getElementById(
            "music-toggle"
        ),

    sfxToggle:
        document.getElementById(
            "sfx-toggle"
        ),

    vibrationToggle:
        document.getElementById(
            "vibration-toggle"
        ),

    musicVolume:
        document.getElementById(
            "music-volume"
        ),

    musicVolumeValue:
        document.getElementById(
            "music-volume-value"
        ),

    fullscreenButton:
        document.getElementById(
            "fullscreen-button"
        ),

    menuFullscreenButton:
        document.getElementById(
            "menu-fullscreen-button"
        ),

    musicChoiceButton:
        document.getElementById(
            "music-choice-button"
        ),

    musicFileInput:
        document.getElementById(
            "music-file-input"
        ),

    musicFileName:
        document.getElementById(
            "music-file-name"
        ),

    gameSettingsButton: null,
    gameSettingsPanel: null,


    /* =====================================================
       INIT
    ===================================================== */

    init() {

        this.setupPlayButton();

        this.setupSettings();

        this.createGameControls();
        this.setupMenuFullscreen();
        this.setupBoardColorPreservation();

        this.updateMenuBestScore();

        this.updateSettingsUI();

        this.showMainMenu();

    },


    /* =====================================================
       PLAY
    ===================================================== */

    setupPlayButton() {

        if (!this.playButton) {
            return;
        }


        this.playButton.addEventListener(
            "click",
            () => {

                this.clickSound();

                blockBlastVibrate(15);

                this.startMusic();

                this.startGame();

            }
        );

    },


    /* =====================================================
       START GAME
    ===================================================== */

    startGame() {

        this.hideMainMenu();

        this.hideSettings();

        this.hideGameOver();

        this.showGame();


        /* RESET SCORE */

        if (
            typeof resetScore ===
            "function"
        ) {
            resetScore();
        }


        /* RESET BOARD */

        if (
            typeof setupBoard ===
            "function"
        ) {
            setupBoard();
        }


        /* NEW BLOCKS */

        if (
            typeof generateBlocks ===
            "function"
        ) {
            generateBlocks();
        }


        /* DRAG */

        if (
            typeof enableDragging ===
            "function"
        ) {
            enableDragging();
        }


        /* SCORE */

        if (
            typeof updateScoreUI ===
            "function"
        ) {
            updateScoreUI();
        }


        this.updateMenuBestScore();

    },


    /* =====================================================
       REPLAY
    ===================================================== */

    replay() {

        this.clickSound();

        blockBlastVibrate(20);

        this.hideGameOver();

        this.startMusic();

        this.startGame();

    },


    /* =====================================================
       SHOW GAME
    ===================================================== */

    showGame() {

        if (!this.game) {
            return;
        }

        this.game.classList.add(
            "active"
        );

    },


    /* =====================================================
       HIDE GAME
    ===================================================== */

    hideGame() {

        if (!this.game) {
            return;
        }

        this.game.classList.remove(
            "active"
        );

    },


    /* =====================================================
       HOME
    ===================================================== */

    goHome() {

        this.clickSound();

        blockBlastVibrate(15);

        this.hideGameOver();

        this.hideSettings();

        this.hideGame();

        this.showMainMenu();

        /*
           IMPORTANT:
           We DO NOT reset the game here.
           So Home doesn't restart the current game.
        */

    },


    /* =====================================================
       MAIN MENU
    ===================================================== */

    showMainMenu() {

        if (!this.mainMenu) {
            return;
        }


        this.mainMenu.classList.add(
            "active"
        );


        this.hideGame();

        this.updateMenuBestScore();

    },


    hideMainMenu() {

        if (!this.mainMenu) {
            return;
        }


        this.mainMenu.classList.remove(
            "active"
        );

    },


    /* =====================================================
       LOADING
    ===================================================== */

    hideLoading() {

        if (!this.loadingScreen) {
            return;
        }


        this.loadingScreen.classList.add(
            "hidden"
        );

    },


    showLoading() {

        if (!this.loadingScreen) {
            return;
        }


        this.loadingScreen.classList.remove(
            "hidden"
        );

    },


    /* =====================================================
       BEST SCORE
    ===================================================== */

    updateMenuBestScore() {

        if (!this.menuBestScore) {
            return;
        }


        let best = 0;


        if (
            typeof getBestScore ===
            "function"
        ) {

            best =
                getBestScore();

        } else {

            try {

                best =
                    Number(
                        localStorage.getItem(
                            "blockblast_best"
                        )
                    ) || 0;

            } catch (error) {

                best = 0;

            }

        }


        this.menuBestScore.textContent =
            best.toLocaleString();

    },


    /* =====================================================
       SETTINGS
    ===================================================== */

    setupSettings() {

        if (this.settingsButton) {

            this.settingsButton.addEventListener(
                "click",
                () => {

                    this.clickSound();

                    blockBlastVibrate(10);

                    this.openSettings();

                }
            );

        }


        if (this.settingsClose) {

            this.settingsClose.addEventListener(
                "click",
                () => {

                    this.clickSound();

                    this.closeSettings();

                }
            );

        }


        /* CHOOSE MUSIC */

        if (this.musicChoiceButton && this.musicFileInput) {

            this.musicChoiceButton.addEventListener(
                "click",
                () => {
                    this.musicFileInput.click();
                }
            );

            this.musicFileInput.addEventListener(
                "change",
                () => {
                    const file = this.musicFileInput.files &&
                        this.musicFileInput.files[0];

                    if (!file) return;

                    if (!file.type || !file.type.startsWith("audio/")) {
                        this.musicFileInput.value = "";
                        return;
                    }

                    blockBlastSettings.customMusicName = file.name;
                    saveBlockBlastSettings();

                    if (this.musicFileName) {
                        this.musicFileName.textContent = file.name;
                    }

                    const oldAudio = window.__blockBlastCustomMusic;
                    if (oldAudio) {
                        oldAudio.pause();
                        oldAudio.removeAttribute("src");
                        oldAudio.load();
                    }

                    const audio = new Audio(URL.createObjectURL(file));
                    audio.loop = true;
                    audio.volume = Number(blockBlastSettings.musicVolume) || 0;
                    window.__blockBlastCustomMusic = audio;

                    if (blockBlastSettings.music) {
                        audio.play().catch(() => {});
                    }
                }
            );

        }


        /* MUSIC */

        if (this.musicToggle) {

            this.musicToggle.addEventListener(
                "change",
                () => {

                    const enabled =
                        this.musicToggle.checked;


                    blockBlastSettings.music =
                        enabled;


                    saveBlockBlastSettings();


                    if (
                        window.BlockBlastSound &&
                        typeof window.BlockBlastSound.setMusicEnabled ===
                        "function"
                    ) {

                        window.BlockBlastSound
                            .setMusicEnabled(
                                enabled
                            );

                    }


                    blockBlastVibrate(10);

                }
            );

        }


        /* SFX */

        if (this.sfxToggle) {

            this.sfxToggle.addEventListener(
                "change",
                () => {

                    blockBlastSettings.sfx =
                        this.sfxToggle.checked;


                    saveBlockBlastSettings();


                    if (
                        window.BlockBlastSound &&
                        typeof window.BlockBlastSound.setEnabled ===
                        "function"
                    ) {

                        window.BlockBlastSound
                            .setEnabled(
                                blockBlastSettings.sfx
                            );

                    }


                    blockBlastVibrate(10);

                }
            );

        }


        /* VIBRATION */

        if (this.vibrationToggle) {

            this.vibrationToggle.addEventListener(
                "change",
                () => {

                    blockBlastSettings.vibration =
                        this.vibrationToggle.checked;


                    saveBlockBlastSettings();


                    if (
                        blockBlastSettings.vibration
                    ) {
                        blockBlastVibrate(20);
                    }

                }
            );

        }


        /* MUSIC VOLUME */

        if (this.musicVolume) {

            this.musicVolume.addEventListener(
                "input",
                () => {

                    const volume =
                        Number(
                            this.musicVolume.value
                        );


                    blockBlastSettings.musicVolume =
                        volume;


                    saveBlockBlastSettings();


                    if (
                        window.BlockBlastSound &&
                        typeof window.BlockBlastSound.setMusicVolume ===
                        "function"
                    ) {

                        window.BlockBlastSound
                            .setMusicVolume(
                                volume
                            );

                    }


                    this.updateVolumeText();

                }
            );

        }


        /* FULLSCREEN */

        if (this.fullscreenButton) {

            this.fullscreenButton.addEventListener(
                "click",
                () => {

                    this.clickSound();

                    this.toggleFullscreen();

                }
            );

        }


        /* CLOSE BY BACKDROP */

        if (this.settingsPanel) {

            this.settingsPanel.addEventListener(
                "click",
                event => {

                    if (
                        event.target ===
                        this.settingsPanel
                    ) {

                        this.closeSettings();

                    }

                }
            );

        }

    },


    /* =====================================================
       MENU FULLSCREEN
    ===================================================== */

    setupMenuFullscreen() {

        if (!this.menuFullscreenButton) {
            return;
        }

        this.menuFullscreenButton.addEventListener(
            "click",
            () => {
                this.clickSound();
                this.toggleFullscreen();
            }
        );

    },


    /* =====================================================
       GAME CONTROLS
    ===================================================== */

    createGameControls() {

        if (!this.game) return;

        if (document.getElementById("bb-game-controls")) return;

        /* Always create the mobile controls. CSS decides visibility.
           This avoids matchMedia/device viewport differences hiding the gear. */
        const controls = document.createElement("div");
        controls.id = "bb-game-controls";
        controls.innerHTML = `
            <button id="bb-home-button" type="button" aria-label="Home">⌂</button>
            <div class="bb-game-controls-right">
                <button id="bb-replay-button" type="button" aria-label="Replay">↻</button>
                <button id="bb-game-settings-button" type="button" aria-label="Game settings">⚙</button>
            </div>
        `;

        const gameHeader = this.game.querySelector("header");
        if (gameHeader) {
            gameHeader.appendChild(controls);
        } else {
            this.game.appendChild(controls);
        }

        this.gameSettingsButton = document.getElementById("bb-game-settings-button");

        const panel = document.createElement("div");
        panel.id = "bb-game-settings-panel";
        panel.innerHTML = `
            <div class="bb-game-settings-box">
                <div class="bb-game-settings-title">GAME</div>
                <button id="bb-popup-replay" type="button"><span>↻</span><b>REPLAY</b></button>
                <button id="bb-popup-home" type="button"><span>⌂</span><b>HOME</b></button>
            </div>
        `;
        this.game.appendChild(panel);
        this.gameSettingsPanel = panel;

        const home = document.getElementById("bb-home-button");
        const replay = document.getElementById("bb-replay-button");
        const popupReplay = document.getElementById("bb-popup-replay");
        const popupHome = document.getElementById("bb-popup-home");

        home?.addEventListener("click", () => {
            this.clickSound();
            blockBlastVibrate(15);
            this.goHome();
        });

        replay?.addEventListener("click", () => {
            this.clickSound();
            blockBlastVibrate(15);
            this.replay();
        });

        this.gameSettingsButton?.addEventListener("click", event => {
            event.stopPropagation();
            this.clickSound();
            blockBlastVibrate(10);
            this.gameSettingsPanel?.classList.toggle("active");
        });

        popupReplay?.addEventListener("click", () => {
            this.gameSettingsPanel?.classList.remove("active");
            this.clickSound();
            blockBlastVibrate(15);
            this.replay();
        });

        popupHome?.addEventListener("click", () => {
            this.gameSettingsPanel?.classList.remove("active");
            this.clickSound();
            blockBlastVibrate(15);
            this.goHome();
        });

        panel.addEventListener("click", event => {
            if (event.target === panel) {
                panel.classList.remove("active");
            }
        });

    },


    /* =====================================================
       SETTINGS OPEN
    ===================================================== */

    openSettings() {

        if (!this.settingsPanel) {
            return;
        }


        this.updateSettingsUI();


        this.settingsPanel.classList.add(
            "active"
        );


        this.settingsPanel.style.display =
            "flex";

    },


    closeSettings() {

        if (!this.settingsPanel) {
            return;
        }


        this.settingsPanel.classList.remove(
            "active"
        );


        this.settingsPanel.style.display =
            "";

    },


    hideSettings() {

        this.closeSettings();

    },


    /* =====================================================
       SETTINGS UI
    ===================================================== */

    updateSettingsUI() {

        if (this.musicToggle) {

            this.musicToggle.checked =
                Boolean(
                    blockBlastSettings.music
                );

        }


        if (this.sfxToggle) {

            this.sfxToggle.checked =
                Boolean(
                    blockBlastSettings.sfx
                );

        }


        if (this.vibrationToggle) {

            this.vibrationToggle.checked =
                Boolean(
                    blockBlastSettings.vibration
                );

        }


        if (this.musicVolume) {

            this.musicVolume.value =
                blockBlastSettings.musicVolume;

        }


        if (this.musicChoice) {

            this.musicChoice.value =
                blockBlastSettings.musicTrack || "default";

        }


        this.updateVolumeText();

    },


    updateVolumeText() {

        if (!this.musicVolumeValue) {
            return;
        }


        const percentage =
            Math.round(
                Number(
                    blockBlastSettings.musicVolume
                ) * 100
            );


        this.musicVolumeValue.textContent =
            percentage + "%";

    },


    /* =====================================================
       SOUND
    ===================================================== */

    clickSound() {

        if (
            window.BlockBlastSound &&
            typeof window.BlockBlastSound.click ===
            "function"
        ) {

            window.BlockBlastSound.click();

        }

    },


    startMusic() {

        if (!blockBlastSettings.music) {
            return;
        }

        if (
            window.BlockBlastSound &&
            typeof window.BlockBlastSound.setMusicTrack ===
            "function"
        ) {
            window.BlockBlastSound.setMusicTrack(
                blockBlastSettings.musicTrack || "default"
            );
        }

        if (
            window.BlockBlastSound &&
            typeof window.BlockBlastSound.startMusic ===
            "function"
        ) {
            window.BlockBlastSound.startMusic();
            return;
        }

        if (
            window.BlockBlastMusic &&
            typeof window.BlockBlastMusic.start ===
            "function"
        ) {
            window.BlockBlastMusic.start();
        }

    },


    /* =====================================================
       PLACED BLOCK COLOR PRESERVATION
    ===================================================== */

    setupBoardColorPreservation() {
        if (this._boardColorObserver) return;

        const board = document.getElementById("board");
        if (!board || typeof MutationObserver === "undefined") return;

        const rememberPlacedColors = () => {
            const cells = board.querySelectorAll(".cell.filled");
            cells.forEach(cell => {
                if (cell.dataset.bbOriginalBackground) return;

                const background = getComputedStyle(cell).background;
                if (background && background !== "rgba(0, 0, 0, 0)") {
                    cell.dataset.bbOriginalBackground = background;
                    cell.style.setProperty("--bb-original-background", background);
                    cell.style.setProperty("--bb-original-border", getComputedStyle(cell).border);
                    cell.style.setProperty("--bb-original-shadow", getComputedStyle(cell).boxShadow);
                }
            });
        };

        /* Capture the real placed colour before drag.js gets a chance to
           add .preview. This keeps every placed block's own colour visible. */
        document.addEventListener("pointermove", rememberPlacedColors, true);
        document.addEventListener("pointerdown", rememberPlacedColors, true);
        rememberPlacedColors();

        this._boardColorObserver = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                if (mutation.type !== "attributes") continue;
                const cell = mutation.target;
                if (!(cell instanceof HTMLElement) || !cell.matches(".cell")) continue;

                if (cell.classList.contains("filled")) {
                    if (!cell.dataset.bbOriginalBackground) {
                        const background = getComputedStyle(cell).background;
                        if (background && background !== "rgba(0, 0, 0, 0)") {
                            cell.dataset.bbOriginalBackground = background;
                            cell.style.setProperty("--bb-original-background", background);
                            cell.style.setProperty("--bb-original-border", getComputedStyle(cell).border);
                            cell.style.setProperty("--bb-original-shadow", getComputedStyle(cell).boxShadow);
                        }
                    }
                } else {
                    delete cell.dataset.bbOriginalBackground;
                    cell.style.removeProperty("--bb-original-background");
                    cell.style.removeProperty("--bb-original-border");
                    cell.style.removeProperty("--bb-original-shadow");
                }
            }
        });

        this._boardColorObserver.observe(board, {
            subtree: true,
            attributes: true,
            attributeFilter: ["class", "style"]
        });
    },


    /* =====================================================
       FULLSCREEN
    ===================================================== */

    async toggleFullscreen() {

        try {

            const doc = document;
            const root = document.documentElement;
            const isFullscreen =
                !!(doc.fullscreenElement || doc.webkitFullscreenElement);

            if (!isFullscreen) {

                const request =
                    root.requestFullscreen ||
                    root.webkitRequestFullscreen ||
                    root.msRequestFullscreen;

                if (typeof request !== "function") {
                    console.warn("Fullscreen API is not supported by this browser.");
                    return false;
                }

                await request.call(root);

            } else {

                const exit =
                    doc.exitFullscreen ||
                    doc.webkitExitFullscreen ||
                    doc.msExitFullscreen;

                if (typeof exit === "function") {
                    await exit.call(doc);
                }

            }

            return true;

        } catch (error) {

            console.warn("Fullscreen unavailable.", error);
            return false;

        }

    },


    /* =====================================================
       GAME OVER HIDE
    ===================================================== */

    hideGameOver() {

        const overlay =
            document.getElementById(
                "game-over"
            );


        if (!overlay) {
            return;
        }


        overlay.style.display =
            "none";


        overlay.classList.remove(
            "active"
        );

    }

};


/* =========================================================
   GAME OVER
========================================================= */

function showGameOver() {

    let overlay =
        document.getElementById(
            "game-over"
        );


    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );


        overlay.id =
            "game-over";


        const panel =
            document.createElement(
                "div"
            );


        panel.className =
            "game-over-panel";


        panel.innerHTML = `

            <div
                class="game-over-badge"
                id="new-high-score-badge"
            >
                🏆 NEW HIGH SCORE
            </div>

            <div class="game-over-icon">
                💥
            </div>

            <h1>
                GAME OVER
            </h1>

            <p>
                No more moves available
            </p>

            <div class="game-over-stats">

                <div class="game-over-stat">
                    <span>SCORE</span>
                    <strong id="game-over-score">
                        0
                    </strong>
                </div>

                <div class="game-over-stat">
                    <span>BEST</span>
                    <strong id="game-over-best">
                        0
                    </strong>
                </div>

            </div>

            <button
                id="restart-game"
                type="button"
            >
                ↻ PLAY AGAIN
            </button>

            <button
                id="game-over-home"
                type="button"
            >
                ⌂ HOME
            </button>

        `;


        overlay.appendChild(
            panel
        );


        document.body.appendChild(
            overlay
        );


        const style =
            document.createElement(
                "style"
            );


        style.id =
            "blockblast-gameover-style";


        style.textContent = `

            #game-over {
                position: fixed;
                inset: 0;
                z-index: 50000;
                display: none;
                align-items: center;
                justify-content: center;
                padding: 20px;
                background:
                    rgba(5,8,18,.78);
                backdrop-filter:
                    blur(16px);
            }

            .game-over-panel {
                width: min(420px,92vw);
                padding: 32px 26px;
                border-radius: 28px;
                text-align: center;
                background:
                    linear-gradient(
                        145deg,
                        rgba(28,35,58,.98),
                        rgba(12,16,30,.98)
                    );
                border:
                    1px solid
                    rgba(255,255,255,.12);
                box-shadow:
                    0 30px 90px
                    rgba(0,0,0,.5);
                animation:
                    bbGameOverIn
                    .35s ease both;
            }

            .game-over-icon {
                font-size: 45px;
                margin-bottom: 8px;
            }

            .game-over-panel h1 {
                margin: 8px 0;
                font-size: 32px;
            }

            .game-over-panel p {
                margin: 0 0 22px;
                opacity: .65;
            }

            .game-over-badge {
                display: none;
                width: fit-content;
                margin: 0 auto 12px;
                padding: 8px 15px;
                border-radius: 999px;
                background:
                    rgba(255,193,7,.14);
                border:
                    1px solid
                    rgba(255,193,7,.4);
                font-size: 12px;
                font-weight: 900;
                letter-spacing: 1px;
                animation:
                    bbBadge .7s ease both;
            }

            .game-over-stats {
                display: flex;
                justify-content: center;
                gap: 12px;
                margin: 20px 0;
            }

            .game-over-stat {
                flex: 1;
                padding: 16px;
                border-radius: 17px;
                background:
                    rgba(255,255,255,.055);
            }

            .game-over-stat span {
                display: block;
                font-size: 10px;
                opacity: .5;
                letter-spacing: 1.5px;
                margin-bottom: 5px;
            }

            .game-over-stat strong {
                font-size: 25px;
            }

            #restart-game,
            #game-over-home {
                width: 100%;
                border: 0;
                border-radius: 15px;
                padding: 15px;
                margin-top: 9px;
                cursor: pointer;
                font-size: 15px;
                font-weight: 850;
                transition:
                    transform .15s ease;
            }

            #restart-game:active,
            #game-over-home:active {
                transform: scale(.97);
            }

            #game-over-home {
                background:
                    rgba(255,255,255,.07);
                color: white;
            }

            @keyframes bbGameOverIn {
                from {
                    opacity: 0;
                    transform:
                        translateY(20px)
                        scale(.95);
                }

                to {
                    opacity: 1;
                    transform:
                        translateY(0)
                        scale(1);
                }
            }

            @keyframes bbBadge {
                0% {
                    opacity: 0;
                    transform: scale(.7);
                }

                70% {
                    transform: scale(1.08);
                }

                100% {
                    opacity: 1;
                    transform: scale(1);
                }
            }

        `;


        document.head.appendChild(
            style
        );

    }


    /* =====================================================
       SCORE
    ===================================================== */

    const score =
        typeof getScore ===
        "function"
            ? getScore()
            : 0;


    const best =
        typeof getBestScore ===
        "function"
            ? getBestScore()
            : 0;


    const scoreElement =
        document.getElementById(
            "game-over-score"
        );


    const bestElement =
        document.getElementById(
            "game-over-best"
        );


    if (scoreElement) {
        scoreElement.textContent =
            score.toLocaleString();
    }


    if (bestElement) {
        bestElement.textContent =
            best.toLocaleString();
    }


    /* =====================================================
       HIGH SCORE
    ===================================================== */

    const badge =
        document.getElementById(
            "new-high-score-badge"
        );


    const record =
        typeof isNewHighScore ===
        "function"
            ? isNewHighScore()
            : false;


    if (badge) {

        badge.style.display =
            record
                ? "flex"
                : "none";

    }


    overlay.style.display =
        "flex";


    overlay.classList.add(
        "active"
    );


    /* =====================================================
       SOUND
    ===================================================== */

    if (
        window.BlockBlastSound &&
        typeof window.BlockBlastSound.gameOver ===
        "function"
    ) {

        window.BlockBlastSound.gameOver();

    }


    if (
        record &&
        window.BlockBlastSound &&
        typeof window.BlockBlastSound.newHighScore ===
        "function"
    ) {

        setTimeout(() => {

            window.BlockBlastSound
                .newHighScore();

        }, 450);

    }


    blockBlastVibrate([
        70,
        50,
        120
    ]);


    /* =====================================================
       BUTTONS
    ===================================================== */

    const restart =
        document.getElementById(
            "restart-game"
        );


    const home =
        document.getElementById(
            "game-over-home"
        );


    if (restart) {

        restart.onclick =
            () => {

                BlockBlastUI.replay();

            };

    }


    if (home) {

        home.onclick =
            () => {

                BlockBlastUI.goHome();

            };

    }

}


/* =========================================================
   GLOBAL
========================================================= */

window.BlockBlastUI =
    BlockBlastUI;


window.showGameOver =
    showGameOver;