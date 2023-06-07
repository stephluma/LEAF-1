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

    var data = {"OkPercent": 99.9948717948718, "KoPercent": 0.005128205128205128};
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 19500, 1, 0.005128205128205128, 52267.33112820502, 184, 146835, 59799.0, 63849.9, 88992.60000000002, 120198.77000000003, 29.119906816298187, 3091.411348317019, 8.732135182167417], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1500, 0, 0.0, 62743.46666666668, 58982, 66922, 62614.5, 64722.0, 65321.75, 66062.79, 6.09758576254375, 3772.965290414036, 1.3755296007300843], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1500, 0, 0.0, 59808.273999999954, 59617, 60288, 59798.0, 59889.0, 59920.95, 60027.97, 10.720335046204644, 248.40015749958906, 2.208975287840996], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1500, 0, 0.0, 204.5840000000001, 184, 314, 203.0, 214.0, 220.0, 261.98, 18.753281824319256, 8.644090840897157, 3.0217690439576925], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1500, 0, 0.0, 39259.16533333331, 9818, 72449, 38621.5, 64972.40000000001, 68375.15000000001, 70762.95, 20.667989417989418, 480.06852299658294, 3.3302912636408735], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1500, 0, 0.0, 59449.18999999993, 58070, 60298, 59792.0, 60050.9, 60081.0, 60122.98, 6.080136195050769, 2.9391283364747367, 2.719435915364504], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1500, 0, 0.0, 42739.013999999974, 24600, 60923, 42557.5, 57507.5, 59362.35, 60606.88, 7.944284087598972, 3.754915525779202, 4.259191371183434], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1500, 0, 0.0, 53804.92199999996, 39591, 61390, 57642.5, 59655.9, 60121.9, 60353.0, 6.73624458855018, 286.1518152003921, 1.3814564097612676], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1500, 1, 0.06666666666666667, 96449.80999999988, 61696, 146835, 98758.0, 123177.0, 127705.40000000001, 137699.56, 7.872032243844071, 4867.713214403326, 1.7746358939086215], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1500, 0, 0.0, 59197.163333333316, 40085, 61160, 60002.0, 60092.9, 60104.0, 60131.99, 12.508756129290504, 289.83960647453216, 2.577487835234664], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1500, 0, 0.0, 45942.73066666662, 22693, 60099, 59881.0, 59999.0, 60000.0, 60017.99, 7.918325115871491, 4.376730483968031, 4.2066102178067295], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1500, 0, 0.0, 45072.12733333334, 29085, 60015, 39565.5, 59659.9, 59784.95, 59912.92, 7.806766905553734, 37.91313654425657, 1.6543636899464456], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1500, 0, 0.0, 60012.96333333332, 59841, 60480, 60002.0, 60094.0, 60124.95, 60238.99, 10.702360227175433, 252.9167833521219, 3.929772895915979], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1500, 0, 0.0, 54791.89400000003, 27368, 60479, 60048.5, 60110.9, 60165.0, 60206.99, 6.9357747260368985, 3.2782372728533775, 2.871844222499653], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,481)", 1, 100.0, 0.005128205128205128], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 19500, 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,481)", 1, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1500, 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,481)", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
