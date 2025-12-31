class Themes {
  constructor(game) {
    this.game = game;
    this.theme = null;

    this.defaults = {
      cube: {
        U: 0xfff7ff, // white
        D: 0xffef48, // yellow
        F: 0xef3923, // red
        R: 0x41aac8, // blue
        B: 0xff8c0a, // orange
        L: 0x82ca38, // green
        P: 0x08101a, // piece
        G: 0xd1d5db // background
      }
    };

    this.colors = JSON.parse(JSON.stringify(this.defaults));
  }

  getColors() {
    return this.defaults.cube;
  }

  setTheme(theme = false, force = false) {
    if (theme === this.theme && force === false) return;
    if (theme !== false) this.theme = theme;

    const colors = this.getColors();

    this.game.dom.prefs
      .querySelectorAll(".range__handle div")
      .forEach(range => {
        range.style.background = "#" + colors.R.toString(16).padStart(6, "0");
      });

    this.game.cube.updateColors(colors);

    this.game.confetti.updateColors(colors);

    this.game.dom.back.style.background =
      "#" + colors.G.toString(16).padStart(6, "0");
  }
}

export { Themes };
