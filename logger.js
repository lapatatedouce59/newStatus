/*export function client(state, ip){
    switch (state){
        case 'new':
            return console.log('\x1b[37m[\x1b[32m+\x1b[37m] '+ip);
    }
}*/

exports.client = function (state, ip) {
    switch (state){
        case true:
            return console.log('\x1b[37m[\x1b[32m+\x1b[37m] Client connecté -> '+ip);
        case false:
            return console.log('\x1b[37m[\x1b[31m-\x1b[37m] Client déconnecté');
  };
}

exports.message = function (type,data,uname,ip,instance){
    switch (type){
        case 'income':
            return console.log('\x1b[44m'+ip+'\x1b[0m\n\x1b[37m[\x1b[32mINCOMING MESSAGE\x1b[37m] \x1b[47m\x1b[30m{'+uname+'}->'+instance+'\x1b[0m\n'+data);
        case 'outcome':
            return console.log('\x1b[37m[\x1b[35mOUTCOMING MESSAGE\x1b[37m] '+data);
        case 'broadcast':
            return console.log('\x1b[37m[\x1b[35mBROADCAST\x1b[37m] '+data);
    }
}

exports.error = function (error){
    return console.log('\x1b[41m\x1b[37m[\x1b[30mERROR\x1b[37m]\x1b[0m '+error);
}

exports.confirm = function (text){
    return console.log('\x1b[42m\x1b[37m[\x1b[30mCONFIRM\x1b[37m]\x1b[0m '+text);
}

exports.identify = function (ip, uuid, from){
    return console.log('\x1b[37m[\x1b[32m+\x1b[37m] '+ip+' provenant de '+from+' attribue '+uuid);
}

exports.leave = function (ip, from){
    return console.log('\x1b[37m[\x1b[31m-\x1b[37m] '+ip+' viens de quitter l\'instance '+from);
}

exports.info = function (text){
    return console.log('\x1b[37m\x1b[44m[INFO]\x1b[0m '+text);
}