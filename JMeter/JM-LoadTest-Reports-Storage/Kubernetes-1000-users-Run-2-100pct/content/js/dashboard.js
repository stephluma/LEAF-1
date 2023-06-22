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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07692307692307693, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13000, 0, 0.0, 35725.346769230455, 187, 47501, 39985.0, 40883.9, 42986.0, 43958.979999999996, 29.15850789186231, 3183.7706504968723, 8.744047739206305], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 0, 0.0, 40785.51400000004, 40121, 45119, 40781.0, 40959.7, 41055.0, 41439.61, 8.796080466544108, 5610.352790858893, 1.98427205837079], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1000, 0, 0.0, 39813.07900000003, 39662, 40097, 39804.0, 39895.0, 39925.0, 40022.91, 9.245049276112642, 216.18782126546236, 1.9049857395114917], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1000, 0, 0.0, 200.61799999999954, 187, 318, 198.0, 207.0, 214.94999999999993, 277.9000000000001, 14.623089858887182, 6.74033048183081, 2.3562595964027198], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1000, 0, 0.0, 25663.85600000001, 5356, 47501, 25742.0, 42442.6, 44685.899999999994, 46266.88, 20.848100738022765, 488.6874622128174, 3.359313107200934], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 0, 0.0, 40003.39900000001, 39800, 40302, 40001.0, 40014.0, 40037.0, 40085.98, 8.821375958221964, 4.281468604722964, 3.94549823131412], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1000, 0, 0.0, 36993.147000000004, 35988, 40035, 36776.0, 37580.9, 39365.35, 39870.94, 9.102411228734491, 4.41786951238383, 4.880101332593004], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 0, 0.0, 39460.01000000003, 38900, 40476, 39407.0, 39816.9, 39910.9, 40253.0, 8.848696144623089, 375.87882934238706, 1.814674014034032], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1000, 0, 0.0, 43096.939999999966, 40251, 44758, 43053.0, 43798.9, 44042.55, 44374.94, 9.052149432882837, 5773.767788534434, 2.042037616206968], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1000, 0, 0.0, 39497.520999999986, 13041, 40288, 40003.0, 40096.0, 40132.0, 40202.99, 12.310571087392743, 287.8722216579877, 2.5366508783592474], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1000, 0, 0.0, 39783.71299999998, 36036, 40205, 40000.0, 40005.0, 40009.0, 40080.99, 9.08950434932783, 4.4116051382968084, 4.828799185580411], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 0, 0.0, 39117.11999999999, 35169, 39904, 39156.0, 39804.0, 39809.0, 39825.97, 9.25574550402162, 44.950021866698755, 1.961422631223332], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1000, 0, 0.0, 40013.85499999994, 39872, 40299, 40002.0, 40094.0, 40124.0, 40230.97, 9.227731177735329, 220.03625921619653, 3.3883075418246915], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 0, 0.0, 40000.735999999946, 39801, 40201, 40001.5, 40007.0, 40020.9, 40084.96, 8.821220327620123, 4.281393069167189, 3.6525365419052074], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13000, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
