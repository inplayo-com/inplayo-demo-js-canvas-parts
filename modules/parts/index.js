'use strict';
import { Drawer } from "./drawer.js";

export class Parts {
    constructor(containerEl, extensions = []) {
        this.containerEl = containerEl;
        this.extensions = extensions;

        this.drawer = new Drawer(this);
        
        this.applyFilter('afterInit', this);
    }

    getUniqId() {
        window.uniqIdLast = window.uniqIdLast !== undefined ? window.uniqIdLast : 0;
        return window.uniqIdLast += 1;
    }

    create(parts){
        this.matrix = parts;

        this.applyFilter('beforeDraw', this.matrix);

        this.matrix.forEach(item => {
            item.id = this.getUniqId();
            item.el = () => { return document.querySelector(`.blocks__matrix .blocks__item[part-id="${item.id}"]`) }
        })
        this.drawer.update(this.matrix);

        this.applyFilter('afterDraw', this.matrix);

        console.log(this.matrix);
    }

    get matrix() {
        if (!this._matrix) {
            console.error('No Matrix Inited, init matrix before.');
        }
        return this._matrix;
    }
    set matrix(value) {
        this._matrix = value;
    }

    //extension actions
    applyFilter(filterName, ...args){
        this.extensions.forEach(module => {
            module[filterName] ? module[filterName](...args) : '';
        });
    }
}