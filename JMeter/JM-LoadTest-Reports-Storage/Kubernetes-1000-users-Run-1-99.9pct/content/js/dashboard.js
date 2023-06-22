/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.85384615384615, "KoPercent": 0.14615384615384616};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07684615384615384, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [0.999, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13000, 19, 0.14615384615384616, 34782.87800000001, 201, 106395, 39779.0, 43781.1, 70470.49999999999, 89466.52999999998, 28.434132332451878, 3103.22552080941, 8.51847900768159], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 1, 0.1, 42643.20199999998, 33512, 50891, 42621.0, 44594.6, 46209.049999999996, 48428.950000000004, 5.070813916341712, 3231.093336609819, 1.1439043112059917], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1000, 0, 0.0, 39800.15500000004, 39568, 40680, 39792.0, 39891.0, 39911.0, 39993.99, 11.150633913537986, 260.74259040376444, 2.2976403864809716], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1000, 0, 0.0, 215.94499999999974, 201, 1264, 209.0, 227.89999999999998, 248.0, 306.9100000000001, 20.004801152276546, 9.220963031127472, 3.2234298731695605], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1000, 0, 0.0, 32576.76599999999, 13401, 54381, 32384.5, 48959.4, 51955.35, 53652.65, 18.37323387289397, 430.67175988020654, 2.9605308486596726], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 0, 0.0, 37552.20599999995, 19269, 40282, 39807.0, 40003.0, 40012.0, 40200.95, 5.77634011090573, 2.8035556983595193, 2.5835583699168208], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1000, 0, 0.0, 27374.29300000001, 11747, 40614, 28370.0, 37915.7, 39462.45, 39960.96, 8.070178270237989, 3.9168736331135556, 4.3266873733990785], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 0, 0.0, 30306.877000000062, 18303, 40515, 29567.5, 39764.9, 39897.75, 40244.94, 5.641717113020519, 239.65457837684977, 1.156992767318661], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1000, 0, 0.0, 72402.97600000004, 41755, 106395, 76765.0, 90631.2, 92928.75, 97762.09000000001, 7.898083135223081, 5037.692653067319, 1.7816964885122382], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1000, 0, 0.0, 39813.39199999999, 30723, 40804, 40000.0, 40046.0, 40097.0, 40116.98, 12.400178562571302, 289.96742240588264, 2.5551149186548283], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1000, 0, 0.0, 29523.44699999999, 11449, 40112, 39933.0, 40004.0, 40007.0, 40039.95, 8.064581165977145, 3.9141570698150794, 4.284308744425358], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 18, 1.8, 27395.465999999993, 14404, 40498, 22877.0, 39806.0, 39909.8, 40122.99, 6.3457413729646035, 30.585729776122243, 1.3205463009087102], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1000, 0, 0.0, 40016.24500000002, 39798, 41036, 40001.0, 40103.0, 40129.9, 40229.86, 11.122975618437444, 265.22283491279586, 4.084217609894999], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 0, 0.0, 32556.443999999992, 14054, 40211, 39441.0, 39969.8, 40002.0, 40019.97, 6.7702515148437765, 3.2859521512474186, 2.803307267865001], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["502/Bad Gateway", 1, 5.2631578947368425, 0.007692307692307693], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 18, 94.73684210526316, 0.13846153846153847], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13000, 19, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 18, "502/Bad Gateway", 1, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 1, "502/Bad Gateway", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 18, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
