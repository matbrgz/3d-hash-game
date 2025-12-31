// Core logic for Tic-Tac-Toe gameplay
class TicTacToe {
  constructor(game) {
    this.game = game;
    this.reset();
  }

  reset() {
    this.turn = "X";
    this.board = {}; // Key: unused, we rely on edge.userData.mark
    this.moves = 0;
    this.winner = null;
    this.game.cube.resetVisuals();
    this.updateUI();
  }

  makeMove(edge) {
    if (this.winner) return;

    // Check if edge is already marked
    if (edge.userData.mark) return;

    // Mark the edge
    edge.userData.mark = this.turn;
    this.game.cube.setEdgeMark(edge, this.turn);
    this.moves++;

    if (this.checkWin()) {
      this.winner = this.turn;
      this.game.complete(true, this.winner);
    } else if (this.moves >= 54) {
      this.game.complete(true, null); // Draw
    } else {
      this.turn = this.turn === "X" ? "O" : "X";
      this.updateUI();
    }
  }

  updateUI() {
    if (this.game.dom.texts.timer) {
      this.game.dom.texts.timer.innerText = `Turn: ${this.turn}`;
    }
  }

  checkWin() {
    const sides = {
      "x-": [],
      "x+": [],
      "y-": [],
      "y+": [],
      "z-": [],
      "z+": []
    };

    // Group edges by face
    this.game.cube.edges.forEach(edge => {
      const position = edge.parent
        .localToWorld(edge.position.clone())
        .sub(this.game.cube.object.position);

      const mainAxis = this.game.controls.getMainAxis(position);
      const mainSign =
        position.multiplyScalar(2).round()[mainAxis] < 1 ? "-" : "+";

      const mark = edge.userData.mark || null;
      sides[mainAxis + mainSign].push({ mark, position });
    });

    // Check each face
    for (const sideKey in sides) {
      if (this.checkFaceWin(sides[sideKey], sideKey)) return true;
    }

    return false;
  }

  checkFaceWin(stickers, sideKey) {
    if (stickers.length !== 9) return false;

    // Determine axes to sort by
    const axis = sideKey.charAt(0);
    let u = "x",
      v = "y";
    if (axis === "x") {
      u = "y";
      v = "z";
    } else if (axis === "y") {
      u = "x";
      v = "z";
    } else {
      u = "x";
      v = "y";
    }

    // Sort stickers by v (row) then u (col)
    // We use a small tolerance or round to 1 decimal
    stickers.sort((a, b) => {
      const va = Math.round(a.position[v] * 10);
      const vb = Math.round(b.position[v] * 10);
      if (va !== vb) return vb - va; // Sort by row (descending v?)
      return Math.round(a.position[u] * 10) - Math.round(b.position[u] * 10); // Sort by col
    });

    // Winning lines (indices in sorted array)
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // Rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // Cols
      [0, 4, 8],
      [2, 4, 6] // Diagonals
    ];

    return wins.some(combo => {
      const marks = combo.map(i => stickers[i].mark);
      return marks.every(m => m === this.turn);
    });
  }
}

export { TicTacToe };
