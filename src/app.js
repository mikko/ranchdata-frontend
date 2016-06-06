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
            "id": 0,
            "value": 42,
            "x": 100,
            "y": 100
        },
        {
            "id": 1,
            "value": 20,
            "x": 400,
            "y": 100
        },
        {
            "id": 2,
            "value": 20,
            "x": 600,
            "y": 100
        },
        {
            "id": 3,
            "value": 20,
            "x": 100,
            "y": 600
        },
        {
            "id": 4,
            "value": 20,
            "x": 400,
            "y": 600
        },
    ]
};

window.componentStorage = {};

uiStructure.components.forEach(c => {
    var container = new PIXI.Container();

    let valueText = new PIXI.Text(c.value, {
        font : 'bold italic 36px Arial',
        fill : '#FFFFFF',
        stroke : '#FFFFFF',
        align: 'center'
    });

    valueText.x = c.x;
    valueText.y = c.y;
    valueText.interactive = true;

    let moveFunction;

    valueText.on('mousedown', event => {
        moveFunction = ev => {
            console.log(ev);
            event.target.x = ev.data.global.x - event.target.width / 2;
            event.target.y = ev.data.global.y - event.target.height / 2;
        };
        event.target.on('mousemove', moveFunction);
    });

    valueText.on('mouseup', event => {
        event.target.off('mousemove', moveFunction);
    });
    //valueText.on('mouseup', event => console.log('Mouse up'));

    stage.addChild(container);
    container.addChild(valueText);

    let unitText = new PIXI.Text("°C", {
        font : 'bold italic 36px Arial',
        fill : '#FFFFFF',
        stroke : '#FFFFFF',
        strokeThickness : 1,
        wordWrap : true,
        wordWrapWidth : 440
    });

    unitText.x = c.x + 100;
    unitText.y = c.y;

    container.addChild(unitText);

    window.componentStorage[c.id] = {
        valueText,
        update: data => valueText.text = data
    };
});

animate();

var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':7000');
ws.onmessage = function (event) {
    var msg = JSON.parse(event.data);
    msg.updatedData.forEach(d => {
        window.componentStorage[d.id].update(d.data);
    });
};

function animate() {

    requestAnimationFrame( animate );
    //setTimeout(animate, 500);
    // render the stage   
    renderer.render(stage);
}

/*
setInterval(function() {
    window.componentStorage.forEach(c => {
        let oldValue = parseFloat(c.text);
        let newValue =Math.max(18, Math.min(22, oldValue + (Math.random() * 0.5 - 0.25)));
        c.text = newValue.toFixed(2);
        c.style.fill = newValue < 20 ? "#0000FF": newValue < 21 ? "#00FF00": "#FF0000";
    });    
}, 1000);
*/

