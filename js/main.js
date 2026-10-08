"use strict";

/* =========================================================
   BLOCK BLAST PRO
   STARTUP + LOADING
========================================================= */

(function () {

    const progress = document.getElementById("loading-progress");
    const percent = document.getElementById("loading-percent");
    const text = document.getElementById("loading-text");
    const loading = document.getElementById("loading-screen");

    const stages = [
        [18, "LOADING GAME"],
        [36, "PREPARING BOARD"],
        [54, "LOADING BLOCKS"],
        [72, "PREPARING AUDIO"],
        [88, "FINALIZING"],
        [100, "READY"]
    ];

    function setProgress(value, label) {
        if (progress) progress.style.width = value + "%";
        if (percent) percent.textContent = value + "%";
        if (text) text.textContent = label;
    }

    function startLoading() {
        let i = 0;
        const next = () => {
            if (i >= stages.length) {
                setTimeout(() => {
                    if (window.BlockBlastUI) {
                        window.BlockBlastUI.hideLoading();
                        window.BlockBlastUI.showMainMenu();
                    } else if (loading) {
                        loading.classList.add("hidden");
                    }
                }, 220);
                return;
            }
            const [value, label] = stages[i++];
            setProgress(value, label);
            setTimeout(next, value === 100 ? 180 : 120);
        };
        next();
    }

    function boot() {
        try {
            if (window.BlockBlastUI && typeof window.BlockBlastUI.init === "function") {
                window.BlockBlastUI.init();
            }
        } catch (error) {
            console.error("Block Blast UI initialization failed:", error);
        }

        requestAnimationFrame(() => {
            requestAnimationFrame(startLoading);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
    } else {
        boot();
    }

})();
