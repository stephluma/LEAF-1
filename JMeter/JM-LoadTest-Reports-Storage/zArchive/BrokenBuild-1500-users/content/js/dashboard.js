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

    var data = {"OkPercent": 97.02833093820571, "KoPercent": 2.9716690617942927};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07678094847053993, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [0.9973333333333333, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19484, 579, 2.9716690617942927, 50003.34407719157, 1, 237050, 58756.0, 63113.5, 99649.25, 137602.10000000015, 29.947188185892667, 3139.5936708557674, 8.791815316770979], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1498, 1, 0.06675567423230974, 62535.83244325769, 21421, 96918, 61675.5, 70644.40000000001, 73993.15, 79301.1, 4.3626027672531045, 2697.60151895224, 0.9834848646734018], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1500, 113, 7.533333333333333, 56262.41533333343, 21003, 73101, 59466.0, 59877.9, 59988.95, 72677.72, 8.781635843124857, 190.33167163743846, 1.6731817714462183], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1500, 0, 0.0, 210.00999999999993, 186, 1211, 204.0, 216.0, 233.0, 342.98, 13.047335734043108, 6.014006314910495, 2.1023539024581184], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1500, 0, 0.0, 40008.52333333334, 7492, 72805, 40097.5, 65733.9, 68645.95, 71166.83, 20.49712357032563, 476.08519458602643, 3.3027591690466105], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1498, 0, 0.0, 54431.077436582156, 18115, 60056, 58839.5, 59678.1, 59800.05, 59965.02, 4.455800422973845, 2.1626296974785166, 1.9929263610566614], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1498, 3, 0.20026702269692923, 42232.024699599475, 17154, 75229, 43261.5, 58976.20000000001, 60108.2, 60948.16, 4.867397534458445, 2.38520730913823, 2.6043454184970853], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1498, 130, 8.678237650200266, 43711.736982643546, 21004, 66499, 44472.5, 59852.2, 59976.0, 60148.05, 4.426570058301887, 172.80589872134033, 0.8290122809246744], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1498, 24, 1.6021361815754338, 105995.28104138852, 21030, 237050, 113995.0, 140124.30000000002, 146710.59999999998, 156815.63, 4.923032430229654, 2997.53411582087, 1.0927740922131957], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1500, 0, 0.0, 58068.67333333338, 8262, 65009, 59998.0, 60009.0, 60014.95, 60096.97, 12.191454603086877, 282.47581266204475, 2.5121063684095026], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1498, 0, 0.0, 46096.1108144192, 15556, 60319, 59519.0, 59798.0, 59810.05, 59849.0, 4.374156850607068, 2.123003862062219, 2.3237708268850046], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1498, 194, 12.950600801068092, 35267.35046728976, 1, 59887, 25888.0, 59166.1, 59502.05, 59684.02, 5.2497853475617235, 24.097946400410027, 0.9684274737598345], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1500, 113, 7.533333333333333, 56472.588666666685, 21214, 73301, 59675.5, 60084.0, 60193.95, 72878.66, 8.77167334288471, 194.1589392945382, 3.0846879934066256], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1498, 1, 0.06675567423230974, 48803.91054739646, 2, 60054, 59531.0, 59805.0, 59882.0, 60005.01, 4.442770414352106, 2.160939627035652, 1.8383565975733813], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 65,398)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 58,354)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 31,909)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 280,494; actual size: 253,090)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 2,417)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 289,393; actual size: 65,381)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 561, 96.89119170984456, 2.8792855676452476], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: nologin.leaf-preprod.va.gov:443 failed to respond", 7, 1.2089810017271156, 0.035926914391295424], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 289,401; actual size: 65,414)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 280,494; actual size: 56,482)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 24,446)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 24,568; actual size: 16,289)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 264,825; actual size: 188,278)", 1, 0.17271157167530224, 0.005132416341613631], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19484, 579, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 561, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: nologin.leaf-preprod.va.gov:443 failed to respond", 7, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 65,398)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 58,354)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 31,909)", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1498, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1500, 113, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 113, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1498, 3, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1498, 130, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 130, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1498, 24, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 13, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 289,393; actual size: 65,381)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 65,398)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 289,401; actual size: 65,414)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 280,494; actual size: 56,482)", 1], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1498, 194, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 188, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: nologin.leaf-preprod.va.gov:443 failed to respond", 6, "", "", "", "", "", ""], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1500, 113, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 113, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1498, 1, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: nologin.leaf-preprod.va.gov:443 failed to respond", 1, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
