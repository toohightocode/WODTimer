function drawMenu() {
    const body = document.getElementById('wrapper');
    body.classList.add('justify-center', 'gap-6', 'px-10')
    
    
    // titolo
    const title = document.createElement('p');
    title.className = 'flex justify-center mb-10 text-lg text-neutral-300 rubik';
    title.innerText = 'Timer WOD';
    body.appendChild(title);

    

    // AMRAP
    const btnAMRAP = document.createElement('button');
    btnAMRAP.className = 'w-full p-4 font-bold bg-orange-400 rounded-full';
    btnAMRAP.innerText = 'AMRAP';
    body.appendChild(btnAMRAP);

    // FOR TIME
    const btnFORTIME = document.createElement('button');
    btnFORTIME.className = 'w-full p-4 font-bold uppercase bg-blue-400 rounded-full';
    btnFORTIME.innerText = 'for time';
    body.appendChild(btnFORTIME);

    // EMOM
    const btnEMOM = document.createElement('button');
    btnEMOM.className = 'w-full p-4 font-bold uppercase rounded-full bg-fuchsia-500';
    btnEMOM.innerText = 'emom';
    body.appendChild(btnEMOM);

    // TABATA
    const btnTABATA = document.createElement('button');
    btnTABATA.className = 'w-full p-4 font-bold uppercase bg-green-400 rounded-full';
    btnTABATA.innerText = 'emom';
    body.appendChild(btnTABATA);

    // MIX
    const btnMIX = document.createElement('button');
    btnMIX.className = 'w-full p-4 font-bold uppercase rounded-full bg-neutral-500';
    btnMIX.innerText = 'mix';
    body.appendChild(btnMIX);
}

drawMenu();