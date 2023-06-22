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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13000, 0, 0.0, 35704.08538461518, 196, 48136, 39985.0, 40814.9, 43167.95, 44538.93, 29.14896240904963, 3186.39473493363, 8.74118524165611], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 0, 0.0, 40692.83800000001, 40171, 42988, 40705.0, 40845.0, 40926.85, 41091.96, 9.12933529309731, 5826.868067054397, 2.0594496608451935], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1000, 0, 0.0, 39826.677000000076, 39640, 40138, 39801.0, 39916.0, 39956.0, 40032.88, 9.634746750681659, 226.23183248065826, 1.9852847308533497], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1000, 0, 0.0, 204.5829999999997, 196, 352, 203.0, 208.0, 212.0, 246.98000000000002, 15.622314914624049, 7.200910780959523, 2.5172675399540707], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1000, 0, 0.0, 26268.075999999975, 5484, 48136, 25710.5, 43495.2, 45957.6, 47663.22, 20.60666007253544, 485.0278930462826, 3.32040909371909], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 0, 0.0, 40006.86599999999, 39767, 40206, 40007.0, 40013.0, 40020.0, 40086.0, 9.15315051440706, 4.424618656866694, 4.0938895855453445], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1000, 0, 0.0, 36997.09700000004, 35694, 39969, 36907.5, 38453.0, 39501.45, 39810.95, 9.545810343840088, 4.521209000744573, 5.117822147234579], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 0, 0.0, 39554.858, 38927, 40360, 39484.0, 39896.0, 40039.95, 40211.97, 9.1775956534907, 392.9831581081763, 1.882124108626022], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1000, 0, 0.0, 43295.471999999965, 40751, 45681, 43237.0, 44242.9, 44555.0, 45107.88, 9.33375646362635, 5957.419248057995, 2.105564202243835], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1000, 0, 0.0, 39096.44099999999, 17759, 40229, 40000.0, 40062.0, 40098.0, 40105.99, 12.25820686949913, 287.8342611902106, 2.5258609858049965], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1000, 0, 0.0, 39577.86299999996, 35787, 40222, 39997.0, 40000.0, 40002.0, 40078.99, 9.47939180222197, 5.239585703181284, 5.035926894930421], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 0, 0.0, 38599.04900000003, 33655, 40012, 39011.0, 39813.0, 39815.0, 39889.64, 9.762097679549381, 47.4092079155969, 2.0687257777951324], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1000, 0, 0.0, 40031.401000000034, 39844, 40337, 40005.0, 40122.0, 40159.95, 40238.85, 9.615014807122803, 230.2004309930387, 3.530513249490404], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 0, 0.0, 40001.889, 39879, 40200, 40001.0, 40004.0, 40007.0, 40118.85, 9.157257584498593, 4.328235030173164, 3.791676968581449], "isController": false}]}, function(index, item){
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
