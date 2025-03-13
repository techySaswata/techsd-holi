document.addEventListener('DOMContentLoaded', () => {
    const bubbleGen = document.querySelector("#bubbleGen");
    const colorful = document.querySelector("input");
    const bubbles = new Map();
    const colors = [
        "deeppink", "magenta", // rainbow sex 
        "gold", "yellow", // rainbow sex 
        "limegreen", "springgreen", // Electric greens
        "orangered", "coral", // Fiery oranges
        "crimson", "red", // Passionate reds
        "blue", "dodgerblue", // Bold blues
        "mediumorchid", "violet", // Royal purples
        "darkviolet", "turquoise", // Jewel tones
        "fuchsia" // Bright pink-purple
    ];

    let bubbleIdMax = 0;
    let secForNextBubble = 0;
    let currentTime = Date.now();
    let previousTime = currentTime;
    let bubbleGenX;
    let bubbleGenY;
    let bubbleGenW;
    let dragging;

    function lg(a) { return console.log.apply(console, arguments), a; }

    window.onresize = () => {
        const bcr = bubbleGen.getBoundingClientRect();
        bubbleGenX = bcr.left + bcr.width / 2;
        bubbleGenY = bcr.top + bcr.width / 2;
        bubbleGenW = bcr.width;
    };

    bubbleGen.onmousedown = () => {
        dragging = true;
        bubbleGen.classList.add("dragging");
    };

    document.onmousemove = e => {
        if (dragging) {
            const st = bubbleGen.style;
            bubbleGenX += e.movementX;
            bubbleGenY += e.movementY;
            st.left = bubbleGenX + "px";
            st.top = bubbleGenY + "px";
        }
    };

    document.onmouseup = e => {
        if (dragging) {
            dragging = false;
            bubbleGen.classList.remove("dragging");
        }
    };

    function createBubble() {
        const bb = document.createElement("bubble"),
            st = bb.style,
            id = ++bubbleIdMax;

        bb.className = "bubble";
        bb.dataset.id = id;
        bb.dataset.speed = 4 + Math.random() * 2;
        bb.dataset.poptime = currentTime + (6 + 3 * Math.random()) * 1000;
        bb.dataset.wave = Math.random();
        st.top = bubbleGenY + "px";
        st.left = bubbleGenX + (bubbleGenW / -2 + Math.random() * bubbleGenW) + "px";
        st.width = st.height = "0px";
        if (colorful.checked) {
            st.backgroundColor = colors[Math.floor(colors.length * Math.random())];
        }
        bubbles.set(id, bb);
        document.body.append(bb);
    }

    function frame() {
        currentTime = Date.now();
        if (currentTime - previousTime > secForNextBubble * 1000) {
            // Create 2-3 bubbles at once for more density
            for(let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
                createBubble();
            }
            previousTime = currentTime;
            secForNextBubble = .02 * Math.random();
        }
        bubbles.forEach((bb, id) => {
            const st = bb.style,
                y = parseFloat(st.top),
                x = parseFloat(st.left),
                w = parseFloat(st.width),
                poptime = +bb.dataset.poptime,
                bbWave = +bb.dataset.wave,
                yInc = +bb.dataset.speed,
                wInc = .3; // Increased from .2
    
            st.top = y - wInc / 1.5 - yInc * 1.2 + "px";
            st.left = x - wInc / 2 + (w / 32 * Math.sin(bbWave)) + "px";
            st.width = st.height = w + wInc + "px";
            bb.dataset.wave = bbWave + .15; // Faster wave movement
            bb.dataset.speed = Math.max(.1, yInc - .003); // Slower speed reduction
            if (poptime < currentTime) {
                bb.remove();
                bubbles.delete(id);
            } else if (poptime - 800 < currentTime) { // Shorter pop transition
                bb.classList.add("pop");
            }
        });
        requestAnimationFrame(frame);
    }

    // Initialize
    window.onresize();
    frame();
});
