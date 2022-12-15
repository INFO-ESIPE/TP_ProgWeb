/*Fonction dessinant une horloge sur un canvas en fonction de l'heure*/
function refresh(canvas, context) {

    /*Récupération de la date*/
    let date = new Date();
    let seconds = date.getSeconds();
    let minutes = date.getMinutes();
    let hours = date.getHours();
    console.log(hours + ":" + minutes + ":" + seconds);

    /* Récupération de la taille du canvas */
    console.log(canvas.width + "x" + canvas.height);

    /* On efface l'ancienne horloge*/
    context.clearRect(0, 0, canvas.width, canvas.height);

    /*Calcul du rayon*/
    let radius = (Math.min(canvas.width, canvas.height) / 2) * 0.8;

    /* Dessine les 12 ticks autour de l'horloge*/
    drawTicks(context, canvas, radius, 30, 3, "lightblue", 12);

    /* Petit bonus pour les minutes*/
    drawTicks(context, canvas, radius, 5, 2, "gray", 60);


    let basicLineWidth = 1;
    let lineLength = 1;
    /* Dessin aiguille des secondes */
    drawAiguille(context, canvas, "red", seconds, 60, radius, basicLineWidth, lineLength);

    /* Dessin aiguille des minutes */
    drawAiguille(context, canvas, "black", minutes, 60, radius, basicLineWidth, lineLength);

    /* Dessin aiguille des heures*/
    drawAiguille(context, canvas, "black", hours, 12, radius, basicLineWidth * 1.8, lineLength * 0.8);


    /*Dessin cercle de l'horloge*/
    context.beginPath();
    context.strokeStyle = "lightblue";
    context.lineWidth = 3;
    context.arc(canvas.width / 2, canvas.height / 2, radius, 0, 2 * Math.PI);
    context.stroke();
}

/* Dessine les ticks pour chaque heure autour de l'horloge*/
function drawTicks(context, canvas, radius, lineLength, lineWidth, color, tickNumber) {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;

    for (let i = 0; i < tickNumber; i++) {
        /* Pour les 12 ticks de l'horloge*/
        context.beginPath();
        /* Point de départ*/
        context.moveTo(
            (canvas.width / (2)) + (radius) * Math.cos(Math.PI * ((i - (tickNumber / 4)) / (tickNumber / 2))),
            (canvas.height / (2)) + (radius) * Math.sin(Math.PI * ((i - (tickNumber / 4)) / (tickNumber / 2)))
        );
        /*Point d'arrivé*/
        context.lineTo(
            (canvas.width / (2)) + (radius + lineLength) * Math.cos(Math.PI * ((i - (tickNumber / 4)) / (tickNumber / 2))),
            (canvas.height / (2)) + (radius + lineLength) * Math.sin(Math.PI * ((i - (tickNumber / 4)) / (tickNumber / 2)))
        );

        context.stroke();
    }
}

/*Fonction pour dessiner une aiguille */
function drawAiguille(context, canvas, color, counter, maxCounter, radius, lineWidth, lineLength) {
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.moveTo(canvas.width / 2, canvas.height / 2);
    context.lineTo(
        canvas.width / 2 + (radius * lineLength) * Math.cos(Math.PI * ((counter - (maxCounter / 4)) / (maxCounter / 2))),
        canvas.height / 2 + (radius * lineLength) * Math.sin(Math.PI * ((counter - (maxCounter / 4)) / (maxCounter / 2)))
    );
    context.stroke();
}

/*Variable globale permettant d'acutaliser toutes les horloges en même temps*/
let canvasDrawElements = [];

/* Actualise l'affichage de toutes les horloges au même moment*/
function synchronizedRefresh() {
    /* Code permettant d'appeller la fonction refresh pour tous les canvas du tableau canvasDrawElements*/
    canvasDrawElements.forEach(canvasDrawElements => {
        refresh(canvasDrawElements.canvas, canvasDrawElements.context);
    });
}

/* Fonction prenant l'ID d'un canvas pour dessiner une horloge dessin*/
function startClock(canvasID) {
    let canvas = document.getElementById(canvasID);
    let context = canvas.getContext("2d");
    refresh(canvas, context); /*Permet d'afficher l'horloge directement sans attendre une seconde*/

    canvasDrawElements.push({
        canvas,
        context
    }); /*On ajoute le canvas et son context au tableau où tous les éléments seront passé en argument de la fonction refresh */
}

/*Au chargement des éléments DOM, on commence l'actualisation des horloges */
window.addEventListener("load", () => {
    window.setInterval(synchronizedRefresh, 1000);
});