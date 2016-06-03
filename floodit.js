((window, document) => {
    'use strict';

    const boardWidth = 17,
        size = 25,
        colors = ['#f00', '#0f0', '#00f', '#ff0', '#f80', '#f0f'],
        grid = new Int8Array(boardWidth * boardWidth),
        checked = new Int32Array(boardWidth * boardWidth);

    function check(x, y, originalColor, color, cells) {
        if (x < 0 || y < 0 || x >= boardWidth || y >= boardWidth) {
            return;
        }

        const idx = x + y * boardWidth;
        if (!checked[idx] && grid[idx] === originalColor) {
            grid[idx] = color;
            checked[idx] = 1;
            cells.push(idx);
        }
    }

    function update(context, color) {
        const originalColor = grid[0];
        if (originalColor === color) {
            return draw(context);
        }

        let filledCount = 0;
        const cells = [0];
        checked.fill(0);
        do {
            const idx = cells.pop();
            const x = idx % boardWidth;
            const y = (idx - x) / boardWidth;
            grid[idx] = color;
            checked[idx] = 1;
            check(x + 1, y, originalColor, color, cells);
            check(x - 1, y, originalColor, color, cells);
            check(x, y + 1, originalColor, color, cells);
            check(x, y - 1, originalColor, color, cells);
            filledCount++;
        } while (cells.length);

        if (filledCount === grid.length) {
            reset();
        }

        draw(context);
    }

    function draw(context) {
        for (let idx = 0; idx < grid.length; idx++) {
            const x = idx % boardWidth;
            const y = (idx - x) / boardWidth;
            context.fillStyle = colors[grid[idx]];
            context.fillRect(x * size, y * size, size, size);
        }
    }

    function reset() {
        for (let idx = 0; idx < grid.length; idx++) {
            grid[idx] = Math.floor(Math.random() * colors.length);
        }
    }

    window.onload = () => {
        reset();

        document.head
            .appendChild(document.createElement('style'))
            .innerHTML = `
                canvas {
                    float: left;
                    clear: both;
                    margin-top: ${size}px
                }
                div {
                    float: left;
                    width: ${size * 4}px;
                    height: ${size * 4}px;
                    margin-right: ${size}px
                }
            `;

        const canvas = document.createElement('canvas');
        canvas.width = size * (boardWidth + 2);
        canvas.height = size * boardWidth;
        const context = canvas.getContext('2d');

        colors.forEach((color, idx) => {
            const div = document.body.appendChild(document.createElement('div'));
            div.style.background = color;
            div.onclick = () => {
                update(context, idx);
            };
        });

        document.body.appendChild(canvas);

        draw(context);
    };
})(window, document);
