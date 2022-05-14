'use strict';

export class PartsImagify {
    constructor(cellPixelMultiplier = 100) {
        this.cellSize = cellPixelMultiplier;

        //hidden container
        this.hiddenContainer = document.createElement('div');
        this.hiddenContainer.style = 'position:absolute;left:0;top:0;visibility:hidden;height:0;top:0;z-index:-99;';
        document.body.append(this.hiddenContainer);

        //canvas image upload
        document.querySelector('#file-upload').addEventListener('change', (e) => {
            var input = e.target, files = input.files;

            // FileReader support
            if (FileReader && files && files.length) {
                var fr = new FileReader();
                fr.onload = () => {
                    this.image = fr.result;

                    this.update();
                }
                fr.readAsDataURL(files[0]);
            }
        });
    }

    afterInit(partsObj){
        this.partsObj = partsObj;
    }

    beforeDraw(matrix) {
        this.matrix = matrix;

        this.matrix.forEach(item => {
            item.imagify = {
                canvas: document.createElement('canvas')
            }
        })
    }

    imagifyAfterPartImage(item){
        item.el().append(item.imagify.canvas);
    }

    set mode(value) {
        this.selectedMode = value;
    }
    get mode() {
        return this.selectedMode ? this.selectedMode : 'AllPanels';
    }
    set image(value) {
        this.selectedImage = value;
    }
    get image() {
        return this.selectedImage ? this.selectedImage : null;
    }
    modeAllPanels() {
        if (this.image !== null) {
            var cover = new Image();
            cover.src = this.image;
            cover.onload = () => {

                //create matrix canvas
                let canvasWidth = 0;
                let canvasHeight = 0;

                this.matrix.forEach(item => {
                    canvasWidth = Math.max((item.x + item.width), canvasWidth);
                    canvasHeight = Math.max((item.y + item.height), canvasHeight);
                })

                let canvas = document.createElement('canvas');
                canvas.width = canvasWidth * this.cellSize;
                canvas.height = canvasHeight * this.cellSize;
                this.hiddenContainer.innerHTML = '';
                this.hiddenContainer.append(canvas);

                //draw image on all canvas
                let matrixCTX = canvas.getContext("2d");
                matrixCTX.drawImage(cover, 0, 0, canvas.width, canvas.height);

                //crop canvas and update doors canvases
                this.matrix.forEach(item => {

                    //crop part
                    var ImageData = matrixCTX.getImageData(
                        item.x * this.cellSize,
                        item.y * this.cellSize,
                        item.width * this.cellSize,
                        item.height * this.cellSize,
                    );

                    //update block canvas with new image part
                    this.partsObj.applyFilter('imagifyBeforePartImage', item);

                    item.imagify.canvas.getContext('2d').putImageData(ImageData, 0, 0);

                    this.partsObj.applyFilter('imagifyAfterPartImage', item);
                });
            };
        }
    }
    modeEachPanel() {
        if (this.image !== null) {
            var cover = new Image();
            cover.src = this.image;
            cover.onload = () => {
                this.matrix.forEach(item => {
                    item.canvas.getContext("2d").drawImage(cover, 0, 0, item.canvas.width, item.canvas.height);
                })

                window.dispatchEvent(new Event('canvas_doors_need_update'));
            };
        }
    }
    modeMultiplePanels() {
        if (this.image !== null) {
            var cover = new Image();
            cover.src = this.image;
            cover.onload = () => {
                let matrix = this.matrix.filter(item => {
                    return this.drawer.isActive(item.canvas.id);
                });

                //create matrix canvas
                let canvasWidth = 0;
                let canvasHeight = 0;
                matrix.forEach(item => {
                    canvasWidth = Math.max((item.x + item.width), canvasWidth);
                    canvasHeight = Math.max((item.y + item.height), canvasHeight);
                })

                let canvas = document.createElement('canvas');
                canvas.width = canvasWidth * this.cellSize;
                canvas.height = canvasHeight * this.cellSize;
                this.hiddenContainer.innerHTML = '';
                this.hiddenContainer.append(canvas);

                //draw image on all canvas
                let matrixCTX = canvas.getContext("2d");
                matrixCTX.drawImage(cover, 0, 0, canvas.width, canvas.height);

                //crop canvas and update doors canvases
                matrix.forEach(item => {

                    //crop part
                    var ImageData = matrixCTX.getImageData(
                        item.x * this.cellSize,
                        item.y * this.cellSize,
                        item.width * this.cellSize,
                        item.height * this.cellSize,
                    );

                    //update block canvas with new image part
                    item.canvas.getContext('2d').putImageData(ImageData, 0, 0);
                });

                window.dispatchEvent(new Event('canvas_doors_need_update'));
            };
        }
    }

    update() {
        this[`mode${this.mode}`](); //apply mode
    }
}