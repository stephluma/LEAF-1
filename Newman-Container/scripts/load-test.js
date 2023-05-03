/**
*    To execute, from Windows terminal -> get inside the container:
*		-> docker exec -it newman_new bash      (Can be run from anywhere in the repo)
*    then -> node load-tests.js
*
* @fileOverview A script to execute parallel collection runs using async.
*/

var path = require('path'), 
    async = require('async'), // https://npmjs.org/package/async 
    newman = require('newman'), 
	
	/**
     * @type {Object}
     */		//				 
			// GitHub 'raw': https://raw.githubusercontent.com/department-of-veterans-affairs/LEAF-API-Testing/newman/Postman%20Collections/PreProd-LOAD-TESTS.json?token=GHSAT0AAAAAACBNLOOEGJN5FTM5ORDJLEOGZCRPVZA
			// Postman Collection Repo: https://va-leaf-api.postman.co/workspace/LEAF-API-Testing~3173db71-59fd-4765-a790-cfbd653c3705/collection/14390849-9143b730-2691-4136-b87f-953341db04f9?action=share&creator=14390849
    options = {
        collection: 'https://raw.githubusercontent.com/department-of-veterans-affairs/LEAF-API-Testing/newman/Postman%20Collections/PreProd-LOAD-TESTS.json?token=GHSAT0AAAAAACBNLOOEGJN5FTM5ORDJLEOGZCRPVZA',
		//collection: path.join(__dirname, 'PreProd-LOAD-TESTS.json'),
		//collection: path.join(__dirname, 'sample-collection.json'),
		reporters: ['cli','json'],   // From: https://github.com/ravivamsi/postmanframework/blob/master/parallel.js
		//reporters: 'cli',			//  cli  junit  json  progress  htmlextra   newman-reporter-csv
		insecure: true
		// ***** Other options as needed *****  (add comma after 'insecure: true'
		//iterationCount: 2,
		//environment: require(fileName),
		//timeout: 180000  // set time out,
		//delayRequest: 300
    },   
    
	/**
     * A collection runner function that runs a collection for a pre-determined options object.
     * @param {Function} done - A callback function that marks the end of the current collection run, when called.
     */
    parallelCollectionRun = function (done) {
        newman.run(options, done);
    };


// Runs the Postman sample collection the # of times in the ary, in parallel.
const runs = Array(200).fill(parallelCollectionRun);
async.parallel(runs,
    /**
    * @param {?Error} err - An Error instance / null that determines whether or not the parallel collection run
    * succeeded.
    * @param {Array} results - An array of collection run summary objects.
    */
    function (err, results) {
        err && console.error(err);     //may need ,results param
        results.forEach(function (result) {
			//console.info(result);
            var failures = result.run.failures;
            console.info(failures.length ? JSON.stringify(failures.failures, null, 2) :
                `${result.collection.name} ran successfully.`);
    });
});
