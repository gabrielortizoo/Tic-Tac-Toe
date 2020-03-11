/*
 * Code Written by Gabriel Ortiz
 * 
 */
 
const tablero = {
    casilla: document.getElementsByClassName('tablero__casilla'),
    casillasOcupadas: [false, false, false,
                       false, false, false,
                       false, false, false]
},
informationBox = {
    turno: document.querySelector('.information__player-text-box')
},
startWindow = {
    sign: document.querySelector('.start-window'),
    overlay: document.querySelector('.start-window__overlay'),
    opt: document.getElementsByClassName('start-window__opt')
},
btnReplay = document.querySelector('.btn--replay'),
victoryWindow = {
    sign: document.querySelector('.tablero__pantalla-victoria'),
    player: document.querySelector('.pantalla-victoria__jugador')
},

jugador_x = {
    ficha: 'x',
    style: 'jugador--x',
    casillasOcupadas: [false, false, false, 
              false, false, false,
              false, false, false]
},
jugador_o = {
    ficha: 'o',
    style: 'jugador--o',
    casillasOcupadas: [false, false, false, 
              false, false, false,
              false, false, false]
};

var jugadorActual, maquina, humano,
    juegoTerminado = false;

/* 
    -- Parte logica
    Esto es lo que hace que funcione el juego
 
*/
agregarEventosClick();

function agregarEventosClick() {
    // Eventlistener de las opciones de la pantalla incial
    for (let i = 0; i < startWindow.opt.length; i++) {
        startWindow.opt[i].addEventListener('click', () => {
            cerrarVentana(i);
        });
    }
    
    // Eventlistener del boton replay
    btnReplay.addEventListener('click', reiniciarJuego);
    
    // Eventlistener de las casillas
    for (let i = 0; i < tablero.casilla.length; i++) {
        tablero.casilla[i].addEventListener('click', () => {
            hacerClick(i);
        });
    }
}

function cerrarVentana(fichaElegida) {
    startWindow.overlay.classList.add('hide');
    startWindow.sign.classList.add('hide');
    estableceJugadores(fichaElegida);
    cambiarInformationBox(jugadorActual);
}

function estableceJugadores(fichaElegida) {
    /* fichaElegida puede tener valores de:
        0 = jugador x  
        1 = jugador o
    */
    if (fichaElegida === 0) {
        humano = jugador_x;
        maquina = jugador_o;
        jugadorActual = humano;
    } else {
        humano = jugador_o;
        maquina = jugador_x;
        jugadorActual = jugador_o;
    }
}

// Comprueba si esa casilla ya fue clickeada
function hacerClick(numeroDeCasilla) {
    if (!tablero.casillasOcupadas[numeroDeCasilla]) {
        noHaSidoClickeada(numeroDeCasilla);
    } else if (jugadorActual === maquina) {
        hacerClick(generarNumeroRandom(0, 9));
    }
}

function noHaSidoClickeada(numeroDeCasilla) {
    agregarACasilla(numeroDeCasilla);
    asignarValorEnMatriz(numeroDeCasilla, jugadorActual);
    comprobarVictoria(jugadorActual);
    cambiarDeJugador();
}

// Modifica visualizacion de la casilla despues de hacer click
function agregarACasilla(numeroDeCasilla) {
    tablero.casilla[numeroDeCasilla].classList.add('tablero__casilla--clicked', 'fade-in');
    if (jugadorActual === jugador_x) {
        tablero.casilla[numeroDeCasilla].classList.add(jugador_x.style);
    } else {
        tablero.casilla[numeroDeCasilla].classList.add(jugador_o.style);
    }
    tablero.casilla[numeroDeCasilla].innerHTML = jugadorActual.ficha;
}

function asignarValorEnMatriz(numeroDeCasilla, jugador) {
    tablero.casillasOcupadas.splice(numeroDeCasilla, 1, true);
    jugador.casillasOcupadas.splice(numeroDeCasilla, 1, true);
}

function comprobarVictoria(jugador) {
    let casillasOcupadas = jugador.casillasOcupadas;
    for (let i = 0; i < 3; i++) {
        // Horizontal
        if ((casillasOcupadas[i * 3] && casillasOcupadas[i * 3 + 1] && casillasOcupadas[i * 3 + 2])
        // Vertical
        || (casillasOcupadas[i] && casillasOcupadas[i + 3] && casillasOcupadas[i + 6]) ){
            mensajeDeVictoria(jugador);
            juegoTerminado = true;
        }
    }
    // Diagonal
    if ((casillasOcupadas[0] && casillasOcupadas[4] && casillasOcupadas[8])
    || (casillasOcupadas[2] && casillasOcupadas[4] && casillasOcupadas[6]) ){
        mensajeDeVictoria(jugador);
        juegoTerminado = true;
    }
}

function mensajeDeVictoria(jugador) {
    for (let i = 0; i < tablero.casilla.length; i++) {
        tablero.casilla[i].classList.add('hide');
    }
    victoryWindow.player.classList.add(jugador.style);
    victoryWindow.player.innerHTML = jugador.ficha;
    victoryWindow.sign.classList.remove('hide');
}

function cambiarDeJugador() {
    if (jugadorActual == humano) {
        jugadorActual = maquina;
        if (!juegoTerminado) {
            setTimeout(juegaLaMaquina, 350);
        }
    } else {
        jugadorActual = humano;
    }
    cambiarInformationBox();
}

function juegaLaMaquina() {
    hacerClick(generarNumeroRandom(0, 9));
}

// Retorna un número aleatorio entre min (incluido) y max (excluido)
function generarNumeroRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min); 
}


/* 
    -- Extras
    Se puede presindir de esta parte del codigo, aunque 
    tambien habria que eliminarlo del html

*/

// Muestra de quien es el turno en el infobox
function cambiarInformationBox(jugador) {
    if (jugador === jugador_o) {
        informationBox.turno.classList.remove('jugador--x');
        informationBox.turno.classList.add('jugador--o');
    } else {
        informationBox.turno.classList.remove('jugador--o');
        informationBox.turno.classList.add('jugador--x');
    }
    informationBox.turno.innerHTML = jugadorActual.ficha;
}

function reiniciarJuego() {
    startWindow.overlay.classList.remove('hide');
    startWindow.sign.classList.remove('hide');
    victoryWindow.sign.classList.add('hide');
    victoryWindow.player.classList.remove('jugador--x', 'jugador--o');
    reiniciarMatriz(tablero);
    reiniciarMatriz(jugador_o);
    reiniciarMatriz(jugador_x);
    removerDeCasilla();
    juegoTerminado = false;
}

// Coloca todos los valores de la matriz en false
function reiniciarMatriz({casillasOcupadas}) {
    for (let i = 0; i < tablero.casillasOcupadas.length; i++) {
        casillasOcupadas.splice(i, 1, false);
    }
}

// Elimina los estilos y valores de cada casilla
function removerDeCasilla() {
    for (let i = 0; i < tablero.casilla.length; i++) {
        tablero.casilla[i].classList.remove('tablero__casilla--clicked', 'fade-in', 'hide', 'jugador--x', 'jugador--o');
        tablero.casilla[i].innerHTML = "";
    }
}