# Canvas Parts

Module for visualize and customize 2d matrix according to objects. Each generated 2d part can be cuztomized with image, using several rendering image modes.

## Usage cases

- generate customizable 3d object material textures
- generate complex images, with mesh of image parts
- visual editor of images, cropping

## Description

### Part configuration

Part - single area of on plot. Part should describe each item of 2d mesh that should be drawn, using params:

- **x** - top coordinate of part
- **y** - left coordinate of part
- **width** - width of part
- **height** - height of part

Sizes: dimensions are calculating in **points**, a **point** is natural number greater or equals to 0

Format: element data should be described in json format

### Example of part

`let element = { x: 0, y: 0, width: 2, height: 2 }; //json: {"top":0,"left":0,"width":2,"height":2}`

## Demo

[Example of usage](https://demo.inplayo.com/js/canvas-parts/)

## Badges

[<img alt="Deployed with FTP Deploy Action" src="https://img.shields.io/badge/Deployed With-FTP DEPLOY ACTION-%3CCOLOR%3E?style=for-the-badge&color=0077b6">](https://github.com/SamKirkland/FTP-Deploy-Action)