let dropdown_btn = document.getElementById('icon_dropdown');
let bandeau = document.getElementById('bandeau');
let bandeauIcon = document.getElementById('icon_status');
let textStatus = document.getElementById('text_status');
let upZone = document.getElementById('upZone');

let upTextsContainer = document.getElementById('upTextsContainer')


let imgGame = document.getElementById('imgGame')
let imgBackup = document.getElementById('imgBackup')
let imgBot = document.getElementById('imgBot')
let imgDNS = document.getElementById('imgDNS')
let imgConnect = document.getElementById('imgConnect')
let imgAPI = document.getElementById('imgAPI')
let imgMulti = document.getElementById('imgMulti')

let gameStateText = document.getElementById('gameStateText')
let backupStateText = document.getElementById('backupStateText')
let botStateText = document.getElementById('botStateText')
let DNSStateText = document.getElementById('DNSStateText')
let connectStateText = document.getElementById('connectStateText')
let APIStateText = document.getElementById('APIStateText')
let multiStateText = document.getElementById('multiStateText')


//CLICK DU DROPDOWN
let isDropClicked = false

bandeau.addEventListener("click", e => {
    if (!isDropClicked && (upZone.innerHTML.length > 0)) {
        isDropClicked = true
        bandeau.classList.toggle('bandeauClique', true)
        dropdown_btn.classList.toggle('icon_dropdownClicked', true)
        upTextsContainer.style.visibility = 'visible'
    } else {
        isDropClicked = false
        bandeau.classList.toggle('bandeauClique', false)
        dropdown_btn.classList.toggle('icon_dropdownClicked', false)
        upTextsContainer.style.visibility = 'hidden'
    }
})

//CHANGER ETAT D'UN ELEMENT

function setState(elem, textElem, state, divId) {
    elem = document.getElementById(elem)
    textElem = document.getElementById(textElem)
    divId = document.getElementById(divId)

    switch (state) {
        case 'online':
            elem.src = './src/online.png'
            textElem.innerHTML = 'Normal'
            divId.className = 'btnDiv'

            break;
        case 'offline':
            elem.src = './src/offline.png'
            textElem.innerHTML = 'Hors service'
            divId.className = 'btnDiv btnDivHS'
            break;
        case 'warn':
            elem.src = './src/warning.png'
            textElem.innerHTML = 'ProblÃ¨mes'
            divId.className = 'btnDiv btnDivWarn'
            break;
        case 'unknown':
            elem.src = './src/unknown.png'
            textElem.innerHTML = 'Inconnu'
            divId.className = 'btnDiv'
            break;
        case 'maintenance':
            elem.src = './src/editing.png'
            textElem.innerHTML = 'En maintenance'
            divId.className = 'btnDiv btnDivMaintenance'
            break;
    }
}

function setElemState(elem, state) {

    switch (elem) {
        case 'game':
            setState('imgGame', 'gameStateText', state, 'gameBtnDiv')
            break;
        case 'backup':
            setState('imgBackup', 'backupStateText', state, 'backupBtnDiv')
            break;
        case 'bot':
            setState('imgBot', 'botStateText', state, 'botBtnDiv')
            break;
        case 'DNS':
            setState('imgDNS', 'DNSStateText', state, 'DNSBtnDiv')
            break;
        case 'connect':
            setState('imgConnect', 'connectStateText', state, 'connectBtnDiv')
            break;
        case 'API':
            setState('imgAPI', 'APIStateText', state, 'APIBtnDiv')
            break;
        case 'multi':
            setState('imgMulti', 'multiStateText', state, 'multiBtnDiv')
            break;
    }
    //console.log('ElÃ©ment '+elem+' dÃ©finis sur '+state);
}

function setBandeau(state) {
    switch (state) {
        case 'normal':
            bandeau.className = 'bandeau' + (bandeau.className.includes("bandeauClique") ? " bandeauClique" : "");
            bandeauIcon.style.background = 'url("./src/tick.png") no-repeat center'
            textStatus.innerHTML = 'Tous les services sont opÃ©rationnels.'
            break;
        case 'warn':
            bandeau.className = 'bandeau bandeauYellow' + (bandeau.className.includes("bandeauClique") ? " bandeauClique" : "")
            bandeauIcon.style.background = 'url("./src/warn.png") no-repeat center'
            textStatus.innerHTML = 'Des problÃ¨mes sont observÃ©s.'
            break;
        case 'partial-outage':
            bandeau.className = 'bandeau bandeauOrange' + (bandeau.className.includes("bandeauClique") ? " bandeauClique" : "")
            bandeauIcon.style.background = 'url("./src/cross.png") no-repeat center'
            textStatus.innerHTML = 'Certains services tiers sont hors service.'
            break;
        case 'outage':
            bandeau.className = 'bandeau bandeauRed' + (bandeau.className.includes("bandeauClique") ? " bandeauClique" : "")
            bandeauIcon.style.background = 'url("./src/cross.png") no-repeat center'
            textStatus.innerHTML = 'Une panne est en cours.'
            break;
        case 'maintenance':
            bandeau.className = 'bandeau bandeauBlue' + (bandeau.className.includes("bandeauClique") ? " bandeauClique" : "")
            bandeauIcon.style.background = 'url("./src/maint.png") no-repeat center'
            textStatus.innerHTML = 'Une maintenance est en cours.'
    }
    //console.log('Bandeau dÃ©finis sur '+state);
}


function resetAll() {
    setElemState('game', 'online')
    setElemState('backup', 'online')
    setElemState('bot', 'online')
    setElemState('DNS', 'online')
    setElemState('connect', 'online')
    setElemState('API', 'online')
    setElemState('multi', 'online')

    setBandeau('normal')
}



function ongoingTrouble() {
    for (let panne in downData.down) {
        if (downData.down[panne].end_date === -1) return downData.down[panne];
    }
    return false;
}

(async () => {
    downData = await (await fetch('./bot/down.json')).json()
    await console.log('Base de donnée globale chargée.')


    async function renew() {
        downData = await (await fetch('./bot/down.json?time=' + Date.now())).json();
        setBandeau(downData.status.bandeau);
        setElemState('game', downData.status.server);
        setElemState('backup', downData.status.backup);
        setElemState('bot', downData.status.bot);
        setElemState('DNS', downData.status.DNS);
        setElemState('connect', downData.status.connection);
        setElemState('API', downData.status.API);
        setElemState('multi', downData.status.multi);

        upZone.innerHTML = "";

        let ot = ongoingTrouble();
        for (let update in ot.updates) {
            let updateContent = ot.updates[update].status
            let updateTime = ot.updates[update].time
            let updateParsedTime = new Date(updateTime)
            let updateConstructedTime = updateParsedTime.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
            });

            let constructedUpdate = updateConstructedTime + ' â€” ' + updateContent;
            let upZoneActualContent = upZone.innerHTML;
            upZone.innerHTML = upZoneActualContent + '<h5>' + constructedUpdate + '</h5>';
        }


        if (upZone.innerHTML.length > 0) {
            document.querySelector("#icon_dropdown").style.visibility = "visible";
            bandeau.style.cursor = "pointer";
        } else {
            document.querySelector("#icon_dropdown").style.visibility = "hidden";
            bandeau.style.cursor = "default";
        }
    }
    await renew();
    setInterval(renew, 20000);

    /*setBandeau(downData.status.bandeau);
    setElemState('game', downData.status.server);
    setElemState('backup', downData.status.backup);
    setElemState('bot', downData.status.bot);
    setElemState('DNS', downData.status.DNS);
    setElemState('connect', downData.status.connection);
    setElemState('API', downData.status.API);
    setElemState('multi', downData.status.multi);
    setInterval( async function(){
        downData=await(await fetch('./bot/down.json?time='+Date.now() )).json();
        setBandeau(downData.status.bandeau);
        setElemState('game', downData.status.server);
        setElemState('backup', downData.status.backup);
        setElemState('bot', downData.status.bot);
        setElemState('DNS', downData.status.DNS);
        setElemState('connect', downData.status.connection);
        setElemState('API', downData.status.API);
        setElemState('multi', downData.status.multi);
    }, 20000);*/
})();

downData = {}

function a(b) {
    if (b < 10) return '0' + b;
    else return '' + b;
}