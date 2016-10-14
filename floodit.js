((window, document) => {
  'use strict';

  const boardWidth = 17,
    size = 25,
    colors = ['#f00', '#0f0', '#00f', '#ff0', '#f80', '#f0f'],
    grid = new Int8Array(boardWidth * boardWidth),
    sanitize = pos =>
      Math.min(boardWidth, Math.max(0, pos)),
    check = (x, y, originalColor, color, cells) => {
      const idx = sanitize(x) + sanitize(y) * boardWidth;
      if (grid[idx] === originalColor) {
        grid[idx] = color;
        return [
          ...cells,
          idx
        ];
      }

      return cells;
    },
    checkCells = (originalColor, color, [idx, ...rest] = [0]) => {
      if (typeof idx === 'undefined') {
        return;
      }
      const x = idx % boardWidth;
      const y = (idx - x) / boardWidth;
      grid[idx] = color;
      checkCells(
        originalColor,
        color,
        check(x, y - 1, originalColor, color,
          check(x, y + 1, originalColor, color,
            check(x - 1, y, originalColor, color,
              check(x + 1, y, originalColor, color, rest)
            )
          )
        ));
    },
    update = (context, color) => {
      const originalColor = grid[0];
      if (originalColor !== color) {
        checkCells(originalColor, color);
      }
      for (const idx of grid) {
        if (idx !== color) {
          return draw(context);
        }
      }

      reset(context);
    },
    draw = context => {
      for (let idx = 0; idx < grid.length; idx++) {
        const x = idx % boardWidth;
        const y = (idx - x) / boardWidth;
        context.fillStyle = colors[grid[idx]];
        context.fillRect(x * size, y * size, size, size);
      }
    },
    reset = context => {
      for (let idx = 0; idx < grid.length; idx++) {
        grid[idx] = Math.floor(Math.random() * colors.length);
      }
      draw(context);
    };

  window.onload = () => {

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

    reset(context);
  };
})(window, document);
