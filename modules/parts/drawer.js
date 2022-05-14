'use strict'

export class Drawer {
    constructor(partsObj) {
        this.partsObj = partsObj;
        this.container = (partsObj.containerEl instanceof HTMLElement) ? partsObj.containerEl : document.querySelector(partsObj.containerEl);
        this.listeners();
    }
    isActive(canvas_id) {
        return this.container.querySelector(`[data-canvas-id="${canvas_id}"].active`) !== null;
    }
    update(matrix) {
        let blockHtml = '';

        for (const block of matrix) {
            let blockAttrs = `style="--w:${block.width};--h:${block.height};--x:${block.x};--y:${block.y};" part-id="${block.id}"`;
            this.partsObj.applyFilter('partAttrsPrepare', block, blockAttrs);

            blockHtml += `<div class="blocks__item" ${blockAttrs}></div>`;
        }

        this.container.innerHTML = blockHtml;
    }
    listeners() {
        this.container.addEventListener('click', (e) => {
            let item = e.target;
            if (item.classList.contains('blocks__item')) {
                item.classList.toggle('active');

                window.dispatchEvent(new Event('canvas_doors_matrix_active_changed'));
            }
        })
    }
}