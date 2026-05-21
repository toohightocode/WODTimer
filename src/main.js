let prepCountdown = 10;

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
    
    // Header con icona impostazioni e titolo
    const header = document.createElement('div');
    header.className = 'w-full flex justify-between items-center mb-2 px-2';

    // Titolo a destra
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'Timer WOD';
    header.appendChild(title);
    
    // Icona impostazioni (SVG)
    const settingsBtn = document.createElement('button');
    settingsBtn.type = 'button';
    settingsBtn.className = 'p-2 text-neutral-400 active:text-white transition-colors';
    settingsBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`;
    settingsBtn.addEventListener('click', () => {
        vibrate();
        fadeTo(drawSettings);
    });
    header.appendChild(settingsBtn);
    
    
    body.appendChild(header);

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

// ==================== IMPOSTAZIONI ====================

function drawSettings() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-black');
    
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'Impostazioni';
    body.appendChild(title);
    
    // Prep countdown
    const prepWrap = document.createElement('div');
    prepWrap.className = 'w-full flex flex-col gap-2';
    const prepLabel = document.createElement('label');
    prepLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    prepLabel.innerText = 'Secondi preparazione';
    const prepInput = document.createElement('input');
    prepInput.type = 'number';
    prepInput.value = prepCountdown;
    prepInput.min = 0;
    prepInput.max = 60;
    prepInput.className = 'w-full p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    prepWrap.append(prepLabel, prepInput);
    body.appendChild(prepWrap);
    
    // Salva
    const btnSalva = document.createElement('button');
    btnSalva.type = 'button';
    btnSalva.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-green-400 active:bg-green-600 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnSalva.innerText = 'Salva';
    btnSalva.addEventListener('click', () => {
        prepCountdown = parseInt(prepInput.value) || 12;
        vibrate();
        fadeTo(drawMenu);
    });
    body.appendChild(btnSalva);
    
    // Torna
    const btnTorna = document.createElement('button');
    btnTorna.type = 'button';
    btnTorna.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-gray-600 active:bg-gray-700 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnTorna.innerText = 'Torna';
    btnTorna.addEventListener('click', () => {
        vibrate();
        fadeTo(drawMenu);
    });
    body.appendChild(btnTorna);
}


// ==================== AMRAP ====================

function drawAMRAP() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-black');
    
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'AMRAP';
    body.appendChild(title);

    const description = document.createElement('p');
    description.className = 'rubik text-neutral-300 -mt-6';
    description.innerText = 'As Many Reps As Possible';
    body.appendChild(description);
    
    // Lavoro
    const workMin = document.createElement('input');
    workMin.type = 'number'; workMin.placeholder = 'min'; workMin.min = 0;
    workMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-l-full text-2xl font-bold border-none outline-none';
    const workSec = document.createElement('input');
    workSec.type = 'number'; workSec.placeholder = 'sec'; workSec.min = 0;
    workSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-r-full text-2xl font-bold border-none outline-none';
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
    
    // Avvia
    const btnAvvia = document.createElement('button');
    btnAvvia.type = 'button';
    btnAvvia.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-orange-400 active:bg-orange-600 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnAvvia.innerText = 'Avvia';
    btnAvvia.addEventListener('click', () => {
        const work = (parseInt(workMin.value) || 0) * 60 + (parseInt(workSec.value) || 0);
        startAMRAP(work);
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

function startAMRAP(work) {
    clearScreen('flex flex-col items-center justify-center gap-4 w-screen h-screen bg-black');
    
    // Interrupt
    const interrupt = document.createElement('button');
    interrupt.innerText = 'interrompi';
    interrupt.className = 'absolute bottom-8 inset-x-10 py-4 font-bold uppercase text-white text-lg rounded-full bg-red-400 active:bg-red-500 transform active:scale-95 transition-transform duration-150 select-none touch-manipulation';
    interrupt.addEventListener('click', () => {
        clearInterval(parseInt(getWrapper().dataset.interval));
        drawAMRAP();
    });
    getWrapper().appendChild(interrupt);
    
    doPrep(() => {
        doWork(work, '', () => {
            showEndScreen(drawAMRAP);
        }, drawAMRAP);
    }, drawAMRAP);
}


// ==================== TABATA ====================

function drawTabata() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-black');
    
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
    workMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-l-full text-2xl font-bold border-none outline-none';
    const workSec = document.createElement('input');
    workSec.type = 'number'; workSec.placeholder = 'sec';
    workSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-r-full text-2xl font-bold border-none outline-none';
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
    restMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-l-full text-2xl font-bold border-none outline-none';
    const restSec = document.createElement('input');
    restSec.type = 'number'; restSec.placeholder = 'sec';
    restSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-r-full text-2xl font-bold border-none outline-none';
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
    const body = clearScreen('flex flex-col items-center justify-evenly pt-20 pb-6 px-6 w-screen h-screen bg-black');
    
    const content = document.createElement('div');
    content.className = 'flex flex-col items-center gap-4 -translate-y-1/3';
    
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
    btn.className = 'absolute bottom-8 inset-x-10 py-4 font-bold uppercase text-white text-lg rounded-full bg-gray-400 active:bg-gray-500 transform active:scale-95 transition-transform duration-150 select-none touch-manipulation';
    btn.innerText = 'TORNA';
    btn.addEventListener('click', returnCallback);
    body.appendChild(btn);
}


// ==================== FOR TIME ====================

function drawForTime() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-black');
    
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'FOR TIME';
    body.appendChild(title);

    const description = document.createElement('p');
    description.className = 'rubik text-neutral-300 -mt-6';
    description.innerText = 'il più veloce possibile per';
    body.appendChild(description);
    
    // Durata target (opzionale, per time cap)
    const timeMin = document.createElement('input');
    timeMin.type = 'number'; timeMin.placeholder = 'min'; timeMin.min = 0;
    timeMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-l-full text-2xl font-bold border-none outline-none';
    const timeSec = document.createElement('input');
    timeSec.type = 'number'; timeSec.placeholder = 'sec'; timeSec.min = 0;
    timeSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-r-full text-2xl font-bold border-none outline-none';
    const timeRow = document.createElement('div');
    timeRow.className = 'flex gap-3';
    timeRow.append(timeMin, timeSec);
    const timeLabel = document.createElement('label');
    timeLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    timeLabel.innerText = 'Time Cap (opzionale)';
    const timeWrap = document.createElement('div');
    timeWrap.className = 'w-full flex flex-col gap-2';
    timeWrap.append(timeLabel, timeRow);
    body.appendChild(timeWrap);
    
    // Avvia
    const btnAvvia = document.createElement('button');
    btnAvvia.type = 'button';
    btnAvvia.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-blue-400 active:bg-blue-600 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnAvvia.innerText = 'Avvia';
    btnAvvia.addEventListener('click', () => {
        const timeCap = (parseInt(timeMin.value) || 0) * 60 + (parseInt(timeSec.value) || 0);
        startForTime(timeCap);
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

function startForTime(timeCap) {
    clearScreen('flex flex-col items-center justify-center gap-4 w-screen h-screen bg-black');
    
    // Interrupt
    const interrupt = document.createElement('button');
    interrupt.innerText = 'interrompi';
    interrupt.className = 'absolute bottom-8 inset-x-10 py-4 font-bold uppercase text-white text-lg rounded-full bg-red-400 active:bg-red-500 transform active:scale-95 transition-transform duration-150 select-none touch-manipulation';
    interrupt.addEventListener('click', () => {
        clearInterval(parseInt(getWrapper().dataset.interval));
        drawForTime();
    });
    getWrapper().appendChild(interrupt);
    
    // Se c'è time cap, usa countdown classico
    if (timeCap > 0) {
        doPrep(() => {
            doWork(timeCap, 'Time Cap attivo', () => {
                showEndScreen(drawForTime);
            }, drawForTime);
        }, drawForTime);
    } else {
        // Senza time cap: cronometro che sale
        // ✅ doPrep come funzione separata, poi avvia cronometro nel callback
        doPrep(() => {
            startStopwatch(drawForTime);
        }, drawForTime);
    }
}

function startStopwatch(onInterrupt) {
    const body = getWrapper();
    const timer = body.querySelector('.timer-digit') || document.createElement('p');
    const status = body.querySelector('.status') || document.createElement('p');
    const info = body.querySelector('.info') || document.createElement('p');
    
    if (!body.contains(timer)) {
        timer.className = 'timer-digit text-8xl font-bold rubik';
        status.className = 'status text-2xl uppercase font-bold';
        info.className = 'info text-xl text-neutral-500';
        body.append(timer, status, info);
    }
    
    const startTime = Date.now();
    
    timer.className = 'timer-digit text-8xl font-bold text-blue-400 rubik';
    status.innerText = 'FOR TIME';
    status.className = 'status text-2xl text-blue-400 uppercase font-bold';
    info.innerText = 'Cronometro attivo';
    
    const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const m = Math.floor(elapsed / 60);
        const s = elapsed % 60;
        timer.innerText = `${m}:${s.toString().padStart(2, '0')}`;
    }, 1000);
    
    body.dataset.interval = interval;
}


// ==================== EMOM ====================

function drawEMOM() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-black');
    
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'EMOM';
    body.appendChild(title);

    const description = document.createElement('p');
    description.className = 'rubik text-neutral-300 -mt-6';
    description.innerText = 'ogni minuto al minuto per';
    body.appendChild(description);
    
    // Ogni (intervallo)
    const intervalMin = document.createElement('input');
    intervalMin.type = 'number'; intervalMin.placeholder = 'min'; intervalMin.min = 0;
    intervalMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-l-full text-2xl font-bold border-none outline-none';
    const intervalSec = document.createElement('input');
    intervalSec.type = 'number'; intervalSec.placeholder = 'sec'; intervalSec.min = 0;
    intervalSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-r-full text-2xl font-bold border-none outline-none';
    const intervalRow = document.createElement('div');
    intervalRow.className = 'flex gap-3';
    intervalRow.append(intervalMin, intervalSec);
    const intervalLabel = document.createElement('label');
    intervalLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    intervalLabel.innerText = 'Ogni';
    const intervalWrap = document.createElement('div');
    intervalWrap.className = 'w-full flex flex-col gap-2';
    intervalWrap.append(intervalLabel, intervalRow);
    body.appendChild(intervalWrap);
    
    // Per (durata totale)
    const durationMin = document.createElement('input');
    durationMin.type = 'number'; durationMin.placeholder = 'min'; durationMin.min = 0;
    durationMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-l-full text-2xl font-bold border-none outline-none';
    const durationSec = document.createElement('input');
    durationSec.type = 'number'; durationSec.placeholder = 'sec'; durationSec.min = 0;
    durationSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-r-full text-2xl font-bold border-none outline-none';
    const durationRow = document.createElement('div');
    durationRow.className = 'flex gap-3';
    durationRow.append(durationMin, durationSec);
    const durationLabel = document.createElement('label');
    durationLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    durationLabel.innerText = 'Per';
    const durationWrap = document.createElement('div');
    durationWrap.className = 'w-full flex flex-col gap-2';
    durationWrap.append(durationLabel, durationRow);
    body.appendChild(durationWrap);
    
    // Avvia
    const btnAvvia = document.createElement('button');
    btnAvvia.type = 'button';
    btnAvvia.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-fuchsia-500 active:bg-fuchsia-700 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnAvvia.innerText = 'Avvia';
    btnAvvia.addEventListener('click', () => {
        const interval = (parseInt(intervalMin.value) || 0) * 60 + (parseInt(intervalSec.value) || 0) || 60;
        const duration = (parseInt(durationMin.value) || 0) * 60 + (parseInt(durationSec.value) || 0);
        startEMOM(interval, duration);
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

function startEMOM(interval, duration) {
    clearScreen('flex flex-col items-center justify-center gap-4 w-screen h-screen bg-black');
    
    // Interrupt
    const interrupt = document.createElement('button');
    interrupt.innerText = 'interrompi';
    interrupt.className = 'absolute bottom-8 inset-x-10 py-4 font-bold uppercase text-white text-lg rounded-full bg-red-400 active:bg-red-500 transform active:scale-95 transition-transform duration-150 select-none touch-manipulation';
    interrupt.addEventListener('click', () => {
        clearInterval(parseInt(getWrapper().dataset.interval));
        drawEMOM();
    });
    getWrapper().appendChild(interrupt);
    
    let currentRound = 1;
    const totalRounds = duration > 0 ? Math.ceil(duration / interval) : 999;
    
    function nextWork() {
        const info = `Round ${currentRound} / ${totalRounds}`;
        doWork(interval, info, () => {
            if (currentRound >= totalRounds) {
                showEndScreen(drawEMOM);
                return;
            }
            currentRound++;
            nextRest();
        }, drawEMOM);
    }
    
    function nextRest() {
        // EMOM: riposo implicito fino al prossimo minuto, quindi breve countdown 0s o skip
        // In realtà EMOM è work per tutto l'intervallo, poi si resetta
        // Qui simuliamo un "rest" di 0 secondi come transizione
        nextWork();
    }
    
    doPrep(nextWork, drawEMOM);
}

// ==================== ALTRE MODALITÀ (placeholder) ====================

function drawMix() {
    const body = clearScreen('flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900');
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'MIX';
    body.appendChild(title);
}

// init
drawMenu();