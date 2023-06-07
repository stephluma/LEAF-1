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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7833333333333333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [0.9833333333333333, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.26666666666666666, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.05, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 390, 0, 0.0, 624.6435897435897, 134, 2265, 370.0, 1835.7000000000007, 2014.5, 2220.9699999999993, 0.0817054910908542, 8.677083463180468, 0.02450182695573092], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 30, 0, 0.0, 1510.466666666667, 615, 2004, 1498.0, 1956.2, 1990.25, 2004.0, 0.006292001733236744, 3.89391300675782, 0.001419387109743836], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 30, 0, 0.0, 296.90000000000003, 137, 478, 294.5, 435.00000000000006, 457.09999999999997, 478.0, 0.0062960622537846156, 0.14588500913873437, 0.0012973331401841346], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 30, 0, 0.0, 267.23333333333335, 217, 548, 234.5, 369.8, 519.9499999999999, 548.0, 0.006296204962458878, 0.002871413786590133, 0.001014525213677456], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 30, 0, 0.0, 1520.0, 917, 2218, 1473.0, 2157.2000000000003, 2200.4, 2218.0, 0.00629451797840225, 0.14620083483142862, 0.0010142533851917688], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 30, 0, 0.0, 356.4666666666666, 146, 424, 373.5, 413.0, 418.5, 424.0, 0.0062942393233440955, 0.003042625454155593, 0.002815196884855074], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 30, 0, 0.0, 217.66666666666669, 136, 391, 188.0, 350.2000000000001, 391.0, 391.0, 0.006295070078818474, 0.0029754042169415442, 0.0033749936262415453], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 30, 0, 0.0, 239.36666666666667, 138, 400, 224.0, 377.80000000000007, 396.15, 400.0, 0.006292839818069806, 0.2673203270997161, 0.0012905237908150968], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 30, 0, 0.0, 1926.3, 863, 2265, 2009.0, 2247.0, 2264.45, 2265.0, 0.006293462917133344, 3.8941178751968546, 0.0014197167322830104], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 30, 0, 0.0, 326.4666666666666, 163, 471, 321.5, 417.3, 452.84999999999997, 471.0, 0.006296247247752922, 0.1458974938417455, 0.0012973712590584633], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 30, 0, 0.0, 302.8666666666667, 140, 420, 353.0, 397.9, 409.55, 420.0, 0.006294772883545233, 0.003479337355553322, 0.0033440980943834045], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 30, 0, 0.0, 249.26666666666674, 134, 418, 246.0, 383.20000000000005, 401.5, 418.0, 0.0062931289101307636, 0.030562236396562775, 0.0013336025131820072], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 30, 0, 0.0, 565.5, 372, 940, 538.5, 709.9, 896.55, 940.0, 0.006295573393479842, 0.14874480759468595, 0.00231165585541838], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 30, 0, 0.0, 341.86666666666673, 146, 411, 362.0, 403.9, 409.35, 411.0, 0.0062944255308613585, 0.002975099567321189, 0.002606285571372281], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 390, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
