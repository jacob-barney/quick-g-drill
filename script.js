//need to extend step length physically by majordia/2 - stepdia/2 aka chamlengthadj
//and translate accordingly
//1 extend step length by chamferlengthadj 2 modify step pos by 1/2 of chamlengadj
//3 modify tip pos by 1/2 of chamferlengthadj

//remember!! regular js objects.value calls do not need ()
//however, p5 objects do, see bgColorSlider.value();

//WEBGL origin points come from the center of the context in 3d
let canvas;

let overallLength = document.getElementById('overall-length');
let majorDiameter = document.getElementById('major-diameter');

let shankLength;
let shankLengthHTML = document.getElementById('shank-length-html');
let chamferLength;
let chamferLengthHTML = document.getElementById('chamfer-length-html');

let stepOneDiameter = document.getElementById('step-one-diameter');
let stepOneLength = document.getElementById('step-one-length');

let tipAngle = document.getElementById('tip-angle');
let tipLength;
let tipLengthHTML = document.getElementById('tip-length-html');

let chamferPosX;

let chamferLengthAdjusted;


let bgColorSlider;

function preload () {
    
  
}

function setup () {
    canvas = createCanvas(1200, 700, WEBGL);
    canvas.position(200, 0);
    bgColorSlider = createSlider(0, 255, 10);
    bgColorSlider.position(1250, 725);
    bgColorSlider.style('width', '150px');
  
 
    
    frameRate(10);
}

function draw () {
    
    background (bgColorSlider.value());
    orbitControl(5, 5, 0.05);
    directionalLight(200, 200, 200, 0, 0, -500);
    directionalLight(200, 200, 200, 0, 0, 500);
    directionalLight(200, 200, 200, 0, -500, 0);
    directionalLight(200, 200, 200, 0, 500, 0);
    directionalLight(200, 200, 200, -500, 0, 0);
    angleMode(DEGREES);

    chamferLength = getConeLength(majorDiameter.value, 90);
    tipLength = getConeLength(stepOneDiameter.value, tipAngle.value);
    chamferLengthAdjusted = majorDiameter.value/2 - stepOneDiameter.value/2;

    shankLength = overallLength.value - stepOneLength.value - tipLength - chamferLengthAdjusted;
    chamferPosX = chamferLength/2 + chamferLengthAdjusted/2 - (overallLength.value/2 - shankLength);
    
    chamferLengthHTML.innerHTML = chamferLengthAdjusted.toFixed(3);
    tipLengthHTML.innerHTML = tipLength.toFixed(3);
    shankLengthHTML.innerHTML = shankLength.toFixed(3);
    
    smooth();
    noStroke();

    //origin plane shows midpoint of step one length
    push();
    specularMaterial(255, 255, 255, 100)
    box(1, 1, 300);
    pop();

    push();
    specularMaterial(255, 255, 255, 100)
    box(1, 300, 1);
    pop();

    push();
    specularMaterial(255, 255, 255, 100)
    box(300, 1, 1);
    pop();

     //create shank
    push();
    translate(-stepOneLength.value/2 - tipLength*0.5, 0, 0);
    rotate(90);
    drawShank(majorDiameter.value, shankLength);
    pop();

    //create step one
    push();
    translate(shankLength/2 - tipLength/2 + chamferLengthAdjusted, 0, 0);
    rotate(90);
    drawStepOne(stepOneDiameter.value, stepOneLength.value);
    pop();

    //create tip
    push();
    translate(stepOneLength.value*0.5+shankLength*0.5 + chamferLengthAdjusted/*+getConeLength(stepOneDiameter.value, tipAngle.value)*0.5*/, 0, 0);
    rotate(-90);
    drawTip(stepOneDiameter.value, tipLength);
    pop();

    //create chamfer
    push();
    translate(chamferPosX, 0, 0);
    rotate(-90);
    drawChamfer(majorDiameter.value, chamferLength);
    pop();

}

//takes major diameter and shank length as args
function drawShank(dia, len) {
    specularMaterial(255, 200, 200);
    shininess(20);
    cylinder(dia/2, len);
}
//takes step one diameter and step one length as args
function drawStepOne(dia, len) {
    specularMaterial(200, 255, 200);
    shininess(20);
    cylinder(dia/2, len);
}
//takes step one diameter and getConeLength function as args
function drawTip (dia, len) {
    specularMaterial(255, 255, 200);
    shininess(20);
    cone(dia/2, len);
}
function drawStepAdjustment (dia, len) {
    specularMaterial(255, 255, 200);
    shininess(20);
    cylinder(dia/2, len);
}
function drawChamfer (dia, len) {
    specularMaterial(200, 200, 255);
    shininess(20);
    cone(dia/2, len);
}
//call this function in draw with diameter.value and getConeLength(diameter.value, tipAngle.value)
function getConeLength(dia, tipAngle) {
    //convert tipAngle to radians so it plays nice with js
    tipAngle = tipAngle*(Math.PI/180);
    let coneLength;
    //perform Tan of base side angle (aka tipAngle / 2) = base side (opposite aka dia/2) / x (adjacent)
    coneLength = (dia/2)/(Math.tan(tipAngle/2));
    return coneLength;
}


