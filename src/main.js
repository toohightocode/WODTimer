function drawMenu() {
    const body = document.getElementById('wrapper');
    body.innerHTML = ''; // pulizia totale
    body.className = 'flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900';
    
    // titolo
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold mb-4';
    title.innerText = 'Timer WOD';
    body.appendChild(title);

    // Configurazione bottoni
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
        btn.dataset.type = type;
        
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            handleTimerSelection(type, body);
        }, { passive: false });
        
        
        btn.addEventListener('click', (e) => {
            handleTimerSelection(type, body);
        });
        
        body.appendChild(btn);
    });
}

function handleTimerSelection(type, container) {
    if (navigator.vibrate) navigator.vibrate(50);
    
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = '';
        container.className = '';
        container.style.opacity = '1';
        
        switch(type) {
            case 'amrap':
                startAMRAP();
                break;
            case 'fortime':
                startForTime();
                break;
            case 'emom':
                startEMOM();
                break;
            case 'tabata':
                drawTabata();
                break;
            case 'mix':
                startMix();
                break;
        }
    }, 150);
}


// TABATA
function drawTabata() {
    const body = document.getElementById('wrapper');
    body.innerHTML = '';
    body.className = 'flex flex-col items-center justify-center gap-6 px-6 min-h-screen bg-neutral-900';
    
    // Titolo
    const title = document.createElement('h1');
    title.className = 'text-neutral-300 rubik text-3xl font-bold';
    title.innerText = 'TABATA';
    body.appendChild(title);
    
    // Serie
    const roundsWrap = document.createElement('div');
    roundsWrap.className = 'w-full flex flex-col gap-2';
    const roundsLabel = document.createElement('label');
    roundsLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    roundsLabel.innerText = 'Serie';
    const roundsInput = document.createElement('input');
    roundsInput.type = 'number';
    roundsInput.value = '4';
    roundsInput.className = 'w-full p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    roundsWrap.append(roundsLabel, roundsInput);
    body.appendChild(roundsWrap);
    
    // Lavoro (min:sec)
    const workWrap = document.createElement('div');
    workWrap.className = 'w-full flex flex-col gap-2';
    const workLabel = document.createElement('label');
    workLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    workLabel.innerText = 'Lavoro';
    const workRow = document.createElement('div');
    workRow.className = 'flex gap-3';
    const workMin = document.createElement('input');
    workMin.type = 'number'; workMin.placeholder = 'min';
    workMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    const workSec = document.createElement('input');
    workSec.type = 'number'; workSec.placeholder = 'sec';
    workSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    workRow.append(workMin, workSec);
    workWrap.append(workLabel, workRow);
    body.appendChild(workWrap);
    
    // Riposo (min:sec)
    const restWrap = document.createElement('div');
    restWrap.className = 'w-full flex flex-col gap-2';
    const restLabel = document.createElement('label');
    restLabel.className = 'text-neutral-400 text-sm uppercase font-bold';
    restLabel.innerText = 'Riposo';
    const restRow = document.createElement('div');
    restRow.className = 'flex gap-3';
    const restMin = document.createElement('input');
    restMin.type = 'number'; restMin.placeholder = 'min';
    restMin.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    const restSec = document.createElement('input');
    restSec.type = 'number'; restSec.placeholder = 'sec';
    restSec.className = 'w-1/2 p-4 text-center text-white bg-neutral-800 rounded-full text-2xl font-bold border-none outline-none';
    restRow.append(restMin, restSec);
    restWrap.append(restLabel, restRow);
    body.appendChild(restWrap);
    
    // Bottone avvia
    const btnAvvia = document.createElement('button');
    btnAvvia.type = 'button';
    btnAvvia.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-green-400 active:bg-green-600 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnAvvia.innerText = 'Avvia';
    btnAvvia.addEventListener('click', () => {
        const rounds = parseInt(roundsInput.value) || 8;
        const work = (parseInt(workMin.value) || 0) * 60 + (parseInt(workSec.value) || 0);
        const rest = (parseInt(restMin.value) || 0) * 60 + (parseInt(restSec.value) || 0);
        runTabata(rounds, work, rest);
    });
    body.appendChild(btnAvvia);

    // Bottone torna
    const btnReturn = document.createElement('button');
    btnReturn.type = 'button';
    btnReturn.className = 'w-full p-5 font-bold uppercase text-white text-lg rounded-full bg-gray-600 active:bg-gray-700 shadow-lg transform active:scale-95 transition-transform duration-150 select-none touch-manipulation mt-4';
    btnReturn.innerText = 'Torna';
    btnReturn.addEventListener('click', () => { drawMenu(); });
    body.appendChild(btnReturn);
}

function runTabata(rounds, work, rest) {
    const body = document.getElementById('wrapper');
    body.innerHTML = '';
    body.className = 'flex flex-col items-center justify-center gap-4 w-screen h-screen bg-black';
    
    const timer = document.createElement('p');
    timer.className = 'text-8xl font-bold text-white rubik timer-digit';
    body.appendChild(timer);
    
    const status = document.createElement('p');
    status.className = 'text-2xl text-neutral-400 uppercase font-bold';
    body.appendChild(status);
    
    const roundInfo = document.createElement('p');
    roundInfo.className = 'text-xl text-neutral-500';
    body.appendChild(roundInfo);
    
    let currentRound = 1;
    
    function countdown(seconds, label, color, next) {
        timer.className = `text-8xl font-bold ${color} rubik timer-digit`;
        status.innerText = label;
        roundInfo.innerText = `Round ${currentRound} / ${rounds}`;
        
        let remaining = seconds;
        timer.innerText = remaining;
        
        const interval = setInterval(() => {
            remaining--;
            timer.innerText = remaining;
            if (remaining <= 0) {
                clearInterval(interval);
                if (next) next();
            }
        }, 1000);
    }
    
    function doPrep() {
        countdown(10, 'Preparati', 'text-yellow-400', doWork);
    }
    
    function doWork() {
        countdown(work, 'Lavoro', 'text-green-400', doRest);
    }
    
    function doRest() {
        if (currentRound >= rounds) {
            timer.className = 'text-8xl font-bold text-white rubik timer-digit';
            timer.innerText = 'FINE';
            status.innerText = 'Completato';
            status.className = 'text-2xl text-green-400 uppercase font-bold';
            roundInfo.innerText = '';
            return;
        }
        currentRound++;
        countdown(rest, 'Riposo', 'text-red-400', doWork);
    }
    
    doPrep();
}

// init
drawMenu();