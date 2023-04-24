//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const { stringify } = require("csv-stringify");

const filename = "report.csv";
const writableStream = fs.createWriteStream(filename);


//joining path of directory 
const directoryPath = path.join(__dirname, './newman');

const finalContent = [];

var finalRow =  {   
    file: 'Final',
    responseAverage: 0,
    responseMin: 0,
    responseMax: 0,
    responseSd: 0,
    dnsAverage: 0,
    dnsMin: 0,
    dnsMax: 0,
    dnsSd: 0,
    firstByteAverage: 0,
    firstByteMin: 0,
    firstByteMax: 0,
    firstByteSd: 0,
    started: 0,
    completed: 0,
    testsTotal: 0,
    testsFailed: 0
};

const stringifier = stringify({ header: true, columns: Object.keys(finalRow) });


let totalCount = 0;

//passsing directoryPath and callback function
fs.readdir(directoryPath, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    else{
        //listing all files using forEach
        files.forEach(function (file) {
            // Do whatever you want to do with the file

            var regex = new RegExp('newman-run-report-(.*).json');
        
            if(regex.test(file) === true){
                totalCount++;
                
                console.log(path.join(directoryPath,file)); 

                let data = JSON.parse(fs.readFileSync(path.join(directoryPath,file),'utf-8'));
                let temp = {};
                temp.file = file;
                temp.responseAverage = data.run.timings.responseAverage;
                temp.responseMin = data.run.timings.responseMin;
                temp.responseMax = data.run.timings.responseMax;
                temp.responseSd = data.run.timings.responseSd;
                temp.dnsAverage = data.run.timings.dnsAverage;
                temp.dnsMin = data.run.timings.dnsMin;
                temp.dnsMax = data.run.timings.dnsMax;
                temp.dnsSd = data.run.timings.dnsSd;
                temp.firstByteAverage = data.run.timings.firstByteAverage;
                temp.firstByteMin = data.run.timings.firstByteMin;
                temp.firstByteMax = data.run.timings.firstByteMax;
                temp.firstByteSd = data.run.timings.firstByteSd;
                temp.started = timeConverter(data.run.timings.started);
                temp.completed = timeConverter(data.run.timings.completed);
                temp.testsTotal = data.run.stats.tests.total;
                temp.testsFailed = data.run.stats.tests.failed;
                stringifier.write(temp);

                finalRow.responseAverage += parseFloat(data.run.timings.responseAverage);
                finalRow.dnsAverage += parseFloat(data.run.timings.dnsAverage);
                finalRow.firstByteAverage += parseFloat(data.run.timings.firstByteAverage);
                finalRow.testsTotal += parseInt(data.run.stats.tests.total);
                finalRow.testsFailed += parseInt(data.run.stats.tests.failed);

                if ( data.run.timings.responseMin < finalRow.responseMin || finalRow.responseMin == 0){
                    finalRow.responseMin = data.run.timings.responseMin
                }

                if ( data.run.timings.responseMax > finalRow.responseMax ){
                    finalRow.responseMax = data.run.timings.responseMax
                }

                if ( data.run.timings.dnsMin < finalRow.dnsMin || finalRow.dnsMin == 0 ){
                    finalRow.dnsMin = data.run.timings.dnsMin
                }

                if ( data.run.timings.dnsMax > finalRow.dnsMax ){
                    finalRow.dnsMax = data.run.timings.dnsMax
                }
                
                if ( data.run.timings.firstByteMin < finalRow.firstByteMin || finalRow.firstByteMin == 0 ){
                    finalRow.firstByteMin = data.run.timings.firstByteMin
                }

                if ( data.run.timings.firstByteMax > finalRow.firstByteMax ){
                    finalRow.firstByteMax = data.run.timings.firstByteMax
                }
                
                if ( data.run.timings.started < finalRow.started || finalRow.started == 0){
                    finalRow.started = data.run.timings.started
                }

                if ( data.run.timings.completed > finalRow.completed ){
                    finalRow.completed = data.run.timings.completed
                }

                //return console.log(data.run);

            }


        });
    }

    // dont want to divide by nothing, you wouldnt be able to feed everyone.
    if(totalCount > 0){
        finalRow.responseAverage  /= totalCount;
        finalRow.dnsAverage  /= totalCount;
        finalRow.firstByteAverage  /= totalCount;
    }
    
    finalRow.started = timeConverter(finalRow.started);
    finalRow.completed = timeConverter(finalRow.completed);
    finalContent.push(finalRow);
    //console.log(finalRow,totalCount);
    console.log(finalContent);
    //console.log(totalCount);
    stringifier.write(finalRow);

    
    stringifier.pipe(writableStream);

});

/**
 * 
 * @param {int} UNIX_timestamp 
 * @returns 
 */
function timeConverter(UNIX_timestamp){
    var a = new Date(UNIX_timestamp);
    var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec ;
    return time;
}