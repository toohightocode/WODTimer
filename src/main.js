let prepCountdown = 3;

// ==================== FUNZIONI GLOBALI ====================

function getWrapper() {
    return document.getElementById('wrapper');
}

function clearScreen(classes) {
    const body = getWrapper();
    body.innerHTML = '';
    body.className = classes;
    return body;
}

function fadeTo(callback) {
    const body = getWrapper();
    body.style.opacity = '0';
    setTimeout(() => {
        body.innerHTML = '';
        body.className = '';
        body.style.opacity = '1';
        callback();
    }, 150);
}

function vibrate() {
    if (navigator.vibrate) navigator.vibrate(50);
}

// ==================== TIMER ENGINE ====================

function countdown(seconds, label, color, info, next, onInterrupt) {
    const body = getWrapper();
    const timer = body.querySelector('.timer-digit') || document.createElement('p');
    const status = body.querySelector('.status') || document.createElement('p');
    const infoEl = body.querySelector('.info') || document.createElement('p');
    
    if (!body.contains(timer)) {
        timer.className = 'timer-digit text-8xl font-bold rubik';
        status.className = 'status text-2xl uppercase font-bold';
        infoEl.className = 'info text-xl text-neutral-500';
        body.append(timer, status, infoEl);
    }
    
    timer.className = `timer-digit text-8xl font-bold ${color} rubik`;
    status.innerText = label;
    status.className = `status text-2xl ${color} uppercase font-bold`;
    infoEl.innerText = info || '';
    
    let remaining = seconds;
    
    function formatTime(sec) {
        if (sec >= 60) {
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            return `${m}:${s.toString().padStart(2, '0')}`;
        }
        return sec;
    }
    
    timer.innerText = formatTime(remaining);
    
    const interval = setInterval(() => {
        remaining--;
        timer.innerText = formatTime(remaining);
        if (remaining <= 0) {
            clearInterval(interval);
            if (next) next();
        }
    }, 1000);
    
    // Salva riferimento per interruzione
    body.dataset.interval = interval;
}

function doPrep(next, onInterrupt) {
    countdown(prepCountdown, 'Preparati', 'text-yellow-400', 'Preparazione...', next, onInterrupt);
}

function doWork(seconds, info, next, onInterrupt) {
    countdown(seconds, 'Lavoro', 'text-green-400', info, next, onInterrupt);
}

function doRest(seconds, info, next, onInterrupt) {
    countdown(seconds, 'Riposo', 'text-red-400', info, next, onInterrupt);
}

// ==================== MENU ====================

function drawMenu() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-black');
    
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold mb-4';
    title.innerText = 'Timer WOD';
    body.appendChild(title);

    const buttons = [
        { text: 'AMRAP', type: 'amrap', color: 'bg-orange-400', hover: 'active:bg-orange-600' },
        { text: 'FOR TIME', type: 'fortime', color: 'bg-blue-400', hover: 'active:bg-blue-600' },
        { text: 'EMOM', type: 'emom', color: 'bg-fuchsia-500', hover: 'active:bg-fuchsia-700' },
        { text: 'TABATA', type: 'tabata', color: 'bg-green-400', hover: 'active:bg-green-600' },
        { text: 'MIX', type: 'mix', color: 'bg-neutral-500', hover: 'active:bg-neutral-700' }
    ];

    buttons.forEach(({ text, type, color, hover }) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = `w-full p-5 font-bold uppercase text-white text-lg rounded-full ${color} ${hover} shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation`;
        btn.innerText = text;
        
        const go = () => {
            vibrate();
            fadeTo(() => {
                switch(type) {
                    case 'amrap': drawAMRAP(); break;
                    case 'fortime': drawForTime(); break;
                    case 'emom': drawEMOM(); break;
                    case 'tabata': drawTabata(); break;
                    case 'mix': drawMix(); break;
                }
            });
        };
        
        btn.addEventListener('touchstart', (e) => { e.preventDefault(); go(); }, { passive: false });
        btn.addEventListener('click', go);
        body.appendChild(btn);
    });
}

// ==================== TABATA ====================

function drawTabata() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900');
    
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'TABATA';
    body.appendChild(title);
    
    // Serie
    const roundsInput = document.createElement('input');
    roundsInput.type = 'number';
    roundsInput.value = '4';
    roundsInput.className = 'w-full p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    const roundsLabel = document.createElement('label');
    roundsLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    roundsLabel.innerText = 'Serie';
    const roundsWrap = document.createElement('div');
    roundsWrap.className = 'w-full flex flex-col gap-2';
    roundsWrap.append(roundsLabel, roundsInput);
    body.appendChild(roundsWrap);
    
    // Lavoro
    const workMin = document.createElement('input');
    workMin.type = 'number'; workMin.placeholder = 'min';
    workMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    const workSec = document.createElement('input');
    workSec.type = 'number'; workSec.placeholder = 'sec';
    workSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    const workRow = document.createElement('div');
    workRow.className = 'flex gap-3';
    workRow.append(workMin, workSec);
    const workLabel = document.createElement('label');
    workLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    workLabel.innerText = 'Lavoro';
    const workWrap = document.createElement('div');
    workWrap.className = 'w-full flex flex-col gap-2';
    workWrap.append(workLabel, workRow);
    body.appendChild(workWrap);
    
    // Riposo
    const restMin = document.createElement('input');
    restMin.type = 'number'; restMin.placeholder = 'min';
    restMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    const restSec = document.createElement('input');
    restSec.type = 'number'; restSec.placeholder = 'sec';
    restSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    const restRow = document.createElement('div');
    restRow.className = 'flex gap-3';
    restRow.append(restMin, restSec);
    const restLabel = document.createElement('label');
    restLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    restLabel.innerText = 'Riposo';
    const restWrap = document.createElement('div');
    restWrap.className = 'w-full flex flex-col gap-2';
    restWrap.append(restLabel, restRow);
    body.appendChild(restWrap);
    
    // Avvia
    const btnAvvia = document.createElement('button');
    btnAvvia.type = 'button';
    btnAvvia.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-green-400 active:bg-green-600 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnAvvia.innerText = 'Avvia';
    btnAvvia.addEventListener('click', () => {
        const rounds = parseInt(roundsInput.value) || 8;
        const work = (parseInt(workMin.value) || 0) * 60 + (parseInt(workSec.value) || 0);
        const rest = (parseInt(restMin.value) || 0) * 60 + (parseInt(restSec.value) || 0);
        startTabata(rounds, work, rest);
    });
    body.appendChild(btnAvvia);
    
    // Torna
    const btnTorna = document.createElement('button');
    btnTorna.type = 'button';
    btnTorna.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-gray-600 active:bg-gray-700 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnTorna.innerText = 'Torna';
    btnTorna.addEventListener('click', drawMenu);
    body.appendChild(btnTorna);
}

function startTabata(rounds, work, rest) {
    clearScreen('flex flex-col items-center justify-center gap-4 w-screen h-screen bg-black');
    
    // Interrupt
    const interrupt = document.createElement('button');
    interrupt.innerText = 'interrompi';
    interrupt.className = 'absolute bottom-8 inset-x-10 py-4 font-bold uppercase text-white text-lg rounded-full bg-red-400 active:bg-red-500 transform active:scale-95 transition-transform duration-150 select-none touch-manipulation';
    interrupt.addEventListener('click', () => {
        clearInterval(parseInt(getWrapper().dataset.interval));
        drawTabata();
    });
    getWrapper().appendChild(interrupt);
    
    let currentRound = 1;
    
    function nextWork() {
        doWork(work, `Round ${currentRound} / ${rounds}`, nextRest, drawTabata);
    }
    
    function nextRest() {
        if (currentRound >= rounds) {
            showEndScreen(drawTabata);
            return;
        }
        currentRound++;
        doRest(rest, `Round ${currentRound} / ${rounds}`, nextWork, drawTabata);
    }
    
    doPrep(nextWork, drawTabata);
}

// ==================== END SCREEN ====================

function showEndScreen(returnCallback) {
    const body = clearScreen('flex flex-col items-center justify-between pt-20 pb-6 px-6 w-screen h-screen bg-black');
    
    const content = document.createElement('div');
    content.className = 'flex flex-col items-center gap-6';
    
    const timer = document.createElement('p');
    timer.className = 'text-8xl font-bold text-white rubik';
    timer.innerText = 'FINE';
    content.appendChild(timer);
    
    const status = document.createElement('p');
    status.className = 'text-2xl text-green-400 uppercase font-bold';
    status.innerText = 'Completato';
    content.appendChild(status);
    
    body.appendChild(content);
    
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-gray-600 active:bg-gray-700 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation';
    btn.innerText = 'TORNA';
    btn.addEventListener('click', returnCallback);
    body.appendChild(btn);
}

// ==================== ALTRE MODALITÀ (placeholder) ====================

function drawAMRAP() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900');
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'AMRAP';
    body.appendChild(title);
    // TODO: input durata + avvia
}

function drawForTime() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900');
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'FOR TIME';
    body.appendChild(title);
}

function drawEMOM() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900');
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'EMOM';
    body.appendChild(title);
}

function drawMix() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900');
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'MIX';
    body.appendChild(title);
}

// init
drawMenu();