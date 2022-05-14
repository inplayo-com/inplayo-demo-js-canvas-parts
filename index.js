'use strict';
import { Parts } from "./modules/parts/index.js";
import { PartsImagify } from "./modules/partsImagify/index.js";

let parts = [{ x: 0, y: 0, width: 4, height: 4 }, { x: 4, y: 0, width: 2, height: 2 }, { x: 6, y: 6, width: 2, height: 2 }];
let extensions = [(new PartsImagify)];
let engine = new Parts('#canvas_parts', extensions);
engine.create(parts);