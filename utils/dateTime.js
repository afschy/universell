function getMonthName(month){
    switch(month){
        case 0:
            return 'JAN';
        case 1:
            return 'FEB';
        case 2:
            return 'MAR';
        case 3:
            return 'APR';
        case 4:
            return 'MAY';
        case 5:
            return 'JUN';
        case 6:
            return 'JUL';
        case 7:
            return 'AUG';
        case 8:
            return 'SEP';
        case 9:
            return 'OCT';
        case 10:
            return 'NOV';
        case 11:
            return 'DEC';
    }
}

function getOracleDate(){
    var d = new Date();
    var month = '' + getMonthName(d.getMonth());
    var day = '' + d.getDate();
    var year = '' + d.getFullYear()%100;
    var result = [day, month, year].join('-');
    // console.log(result);
    return result;
}

module.exports = {
    getOracleDate
};