'use strict';

//const Component = require('./component');
//console.log(Component.initialize('komponentti'));

const PIXI = require('./vendor/pixi');

// create an new instance of a pixi stage
const stage = new PIXI.Stage(0x66FF99);

// create a renderer instance.
const renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight);

// add the renderer view element to the DOM
document.body.appendChild(renderer.view);

const uiStructure = {
    "components": [
        {
            "value": 42,
            "x": 100,
            "y": 100
        },
        {
            "value": 20,
            "x": 400,
            "y": 100
        },
        {
            "value": 20,
            "x": 600,
            "y": 100
        },
        {
            "value": 20,
            "x": 100,
            "y": 600
        },
        {
            "value": 20,
            "x": 400,
            "y": 600
        },
    ]
};

window.componentStorage = [];

uiStructure.components.forEach(c => {
    let uiComponent = new PIXI.Text(c.value, {
    font : 'bold italic 36px Arial',
    fill : '#F7EDCA',
    stroke : '#4a1850',
    strokeThickness : 5,
    dropShadow : true,
    dropShadowColor : '#000000',
    dropShadowAngle : Math.PI / 6,
    dropShadowDistance : 6,
    wordWrap : true,
    wordWrapWidth : 440
});
    uiComponent.x = c.x;
    uiComponent.y = c.y;
    uiComponent.interactive = true;

    let moveFunction;

    uiComponent.on('mousedown', event => {
        moveFunction = ev => {
            event.target.x = ev.data.global.x - event.target.width / 2;
            event.target.y = ev.data.global.y - event.target.height / 2;
        };
        event.target.on('mousemove', moveFunction);
    });

    uiComponent.on('mouseup', event => {
        event.target.off('mousemove', moveFunction);
    });
    //uiComponent.on('mouseup', event => console.log('Mouse up'));

    stage.addChild(uiComponent);
    window.componentStorage.push(uiComponent);
});

animate();

function animate() {

    requestAnimationFrame( animate );
    //setTimeout(animate, 500);
    // render the stage   
    renderer.render(stage);
}

setInterval(function() {
    window.componentStorage.forEach(c => {
        let oldValue = parseFloat(c.text);
        let newValue =Math.max(18, Math.min(22, oldValue + (Math.random() * 0.5 - 0.25)));
        c.text = newValue.toFixed(2);
        c.style.fill = newValue < 20 ? "#0000FF": newValue < 21 ? "#00FF00": "#FF0000";
    });    
}, 1000);
