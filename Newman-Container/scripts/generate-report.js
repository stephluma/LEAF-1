//requiring path and fs modules
const path = require('path');
const fs = require('fs');
const { stringify } = require("csv-stringify");

const currentRun = new Date();

// what will be our final name for the file.
const filename = `../reports/report-${currentRun.toISOString().replaceAll(':','-')}.csv`;
// file stream to write our file
const writableStream = fs.createWriteStream(filename);

//joining path of directory 
const directoryPath = path.join(__dirname, './newman');

// create our backup directory at the start.
const backupDirectoryPath = path.join(__dirname,`../reports/backup/${currentRun.toISOString().replaceAll(':','-')}`);
if (!fs.existsSync(backupDirectoryPath)){
    fs.mkdirSync(backupDirectoryPath, { recursive: true });
}

// set up our final row so we do not have to do this in a specific order like we do for each row.
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
    testsFailed: 0,
    responseTime: 0,
    responseSize: 0,
};

// setup our file output for headers and such
const stringifier = stringify({ header: true, columns: Object.keys(finalRow) });

// number of files, was not able to get a proper number for something off length, I may have been being dumb there. This is used for averages
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

            // we only want the newman report files just incase we get another json file.
            var regex = new RegExp('newman-run-report-(.*).json');
        
            if(regex.test(file) === true){
                totalCount++;
                
                // output the file name so if we run into errors we have a starting point of what file we were working on.
                console.log(path.join(directoryPath,file)); 

                // grab our data, there is a bit here we should probably check, though if we have a filename here it should exist.
                let data = JSON.parse(fs.readFileSync(path.join(directoryPath,file),'utf-8'));

                // lets get our totals for response time and sizes, we may need to break this out with GETs and POSTs
                let responseTime = 0;
                let responseSize = 0;

                // sometimes responses do not exist.
                //console.log(data.run.executions[0].request);
                //console.log(Object.keys(data.run.executions[0]));

                data.run.executions?.forEach(function(element){
                    responseTime += parseInt(element.response?.responseTime);
                    responseSize += parseInt(element.response?.responseSize);
                });

                // get our data together
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
                temp.responseTime = responseTime;
                temp.responseSize = responseSize;

                // write the temp object to file
                stringifier.write(temp);

                // process our running totals and gather mins and maxs
                finalRow.responseAverage += parseFloat(data.run.timings.responseAverage);
                finalRow.dnsAverage += parseFloat(data.run.timings.dnsAverage);
                finalRow.firstByteAverage += parseFloat(data.run.timings.firstByteAverage);
                finalRow.testsTotal += parseInt(data.run.stats.tests.total);
                finalRow.testsFailed += parseInt(data.run.stats.tests.failed);
                finalRow.responseTime += parseInt(responseTime);
                finalRow.responseSize += parseInt(responseSize);

                // mins and maxs I have a feeling the way I am doing the mins may have an issue.
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

                console.log('moving files');

                try{
                    fs.copyFile(path.join(directoryPath,file), path.join(backupDirectoryPath,file), 0, function(){
                        fs.rm(path.join(directoryPath,file),function(){});
                    });
                }catch(e){
                    console.log(e);
                }
                

            }

        });
    }

    // dont want to divide by nothing, you wouldnt be able to feed everyone.
    if(totalCount > 0){
        finalRow.responseAverage  /= totalCount;
        finalRow.dnsAverage  /= totalCount;
        finalRow.firstByteAverage  /= totalCount;
    }
    
    // get the absolute start and finish
    finalRow.started = timeConverter(finalRow.started);
    finalRow.completed = timeConverter(finalRow.completed);
    
    // put the final data in the row
    stringifier.write(finalRow);

    // write to file
    stringifier.pipe(writableStream);

    return console.log(`Finished processing ${totalCount} files`);

});

/**
 * This will take our timestampswe are getting out of newman into a human readable entry in our export.
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