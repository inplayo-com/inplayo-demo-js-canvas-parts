'use strict'

export class Debug {
    static get debug() {
        return true;
    }

    static log(info) {
        if (this.debug === true) {
            var styles = [
                'background: gold; border: 1px solid red',
                'background: yellow',
                'background: lightgrey',
            ];

            console.log('%c Canvas Engine %c v1.0 %c ', styles[0], styles[1], styles[2]);
            console.log(info);
            console.log('%c DEBUG end ', styles[2]);
        }
    }
}