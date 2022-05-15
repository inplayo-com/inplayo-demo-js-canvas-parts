'use strict';

export class PartsImagify {
    constructor(cellPixelMultiplier = 100) {
        this.cellSize = cellPixelMultiplier;
    }

    afterInit(partsObj) {
        this.partsObj = partsObj;
    }

    afterDraw(matrix) {
        this.matrix = matrix;

        this.matrix.forEach(item => {
            let canvas = document.createElement('canvas');
            canvas.id = `canvase_parts_imageify_${item.id}`;
            canvas.width = item.width * this.cellSize;
            canvas.height = item.height * this.cellSize;

            item.imagify = {
                canvas
            }
        })
    }

    set mode(value) {
        this._mode = value;
    }
    get mode() {
        return this._mode ? this._mode : 'cover_all';
    }
    set image(value) {
        this._image = value;
    }
    get image() {
        let imageTag = new Image();
        imageTag.src = this._image;
        return imageTag;
    }

    set fullCanvas(coverImage) {
        let context = this.fullCanvas.getContext("2d");
        context.clearRect(0, 0, this.fullCanvas.width, this.fullCanvas.height);
        context.drawImage(coverImage, 0, 0, this.fullCanvas.width, this.fullCanvas.height);
    }
    get fullCanvas() {
        if (this._fullCanvas === undefined) {
            let canvasWidth = 0;
            let canvasHeight = 0;
            this.matrix.forEach(item => {
                canvasWidth = Math.max((item.x + item.width), canvasWidth);
                canvasHeight = Math.max((item.y + item.height), canvasHeight);
            })

            this._fullCanvas = document.createElement('canvas');
            this._fullCanvas.width = canvasWidth * this.cellSize;
            this._fullCanvas.height = canvasHeight * this.cellSize;
        }

        return this._fullCanvas;
    }

    async coverItem(item) {
        let rect = {};
        rect.w = item.width * this.cellSize;
        rect.h = item.height * this.cellSize;
        rect.x = item.x * this.cellSize;
        rect.y = this.fullCanvas.height + -(item.y * this.cellSize) + -rect.h;
        rect = [rect.x, rect.y, rect.w, rect.h];

        this.partsObj.applyFilter('imagifyBeforePartImage', item);

        let context = item.imagify.canvas.getContext('2d');
        context.clearRect(0, 0, item.imagify.canvas.width, item.imagify.canvas.height);
        context.putImageData(this.fullCanvas.getContext("2d").getImageData(...rect), 0, 0);

        this.partsObj.applyFilter('imagifyAfterPartImage', item);
    }
    async containItem(item) {
        this.partsObj.applyFilter('imagifyBeforePartImage', item);

        let canvas = item.imagify.canvas;
        var ratio = Math.min(
            canvas.width / this.fullCanvas.width,
            canvas.height / this.fullCanvas.height
        );

        let context = canvas.getContext('2d');
        context.clearRect(0, 0, item.imagify.canvas.width, item.imagify.canvas.height);
        context.drawImage(this.fullCanvas, 0, 0, this.fullCanvas.width, this.fullCanvas.height, 0, 0, this.fullCanvas.width * ratio, this.fullCanvas.height * ratio);

        this.partsObj.applyFilter('imagifyAfterPartImage', item);
    }

    update() {
        this.partsObj.applyFilter('imagifyBeforeUpdate', this.matrix);
        this.image.onload = () => {
            this.fullCanvas = this.image;

            let method = 'contain';
            method = this.mode.includes('cover') ? 'cover' : method;

            for (let i = 0; i < this.matrix.length; i++) {
                let item = this.matrix[i];

                if (this.mode.includes('selected') && !item.el().classList.contains('active')) {
                    continue;
                 }

                this[`${method}Item`](item);
            }
        }
        this.partsObj.applyFilter('imagifyAfterUpdate', this.matrix);
    }
}