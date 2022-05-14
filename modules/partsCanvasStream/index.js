'use strict'

export class partsCanvasStream {
    constructor() { }

    beforeDraw(matrix) {
        for (const index in matrix) {
            let block = this.matrix[index];            
            if (block.canvas.id === "") {
                block.canvas.setAttribute('id', `matrix_canvas_${this.getUniqId()}`);
            }
        }
    }
    
    partAttrsPrepare(block, attrs){
        attrs += ` data-canvas-id="${block.canvas.id}" `;
    }
} 