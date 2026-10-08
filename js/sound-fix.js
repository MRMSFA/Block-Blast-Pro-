"use strict";

/* Block Blast Pro — keep Choose Your Music inside the normal settings row.
   The real file picker is already wired by ui.js; sound.js also creates a
   second side-card button, so disable only that duplicate creator. */
if (window.BlockBlastSound) {
    window.BlockBlastSound.createMusicPickerButton = function () {};
}

// Safety cleanup if sound.js created the duplicate before this file ran.
document.getElementById("blockblast-custom-music")?.remove();
