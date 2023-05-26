export default class timer {
    constructor(index) {
        this.index = index;
        this.color = this.newColor();
        this.name = "New timer";
        this.changingName = false;
        this.time = {
            hour: 0,
            minute: 0,
            second: 0,
        };
        this.recentTimes = [];
    }
    newColor() {
        const red = Math.round(Math.random() * 255).toString(16).padStart(2, '0');
        const green = Math.round(Math.random() * 255).toString(16).padStart(2, '0');
        const blue = Math.round(Math.random() * 255).toString(16).padStart(2, '0');
        return `#${red}${green}${blue}`;
      }
}