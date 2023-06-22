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

    var data = {"OkPercent": 99.7963201846697, "KoPercent": 0.20367981533030077};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.06802905832032045, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [0.9990029910269193, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 14729, 30, 0.20367981533030077, 35110.80473895033, 183, 49203, 39926.0, 40704.0, 43374.5, 44954.4, 12.418469279696742, 1230.4219546099637, 3.544517369963981], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 0, 0.0, 40649.45499999992, 40191, 43596, 40646.0, 40745.9, 40826.8, 41709.44, 7.753620940979438, 4945.534704843881, 1.7491078489904783], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1003, 0, 0.0, 39832.39182452643, 38794, 40178, 39813.0, 39926.8, 39969.0, 40044.88, 1.1813884789299425, 27.632976645124682, 0.2434306338420096], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1003, 0, 0.0, 196.913260219342, 183, 742, 194.0, 202.0, 206.0, 277.7600000000002, 1.2394391259915203, 0.5713039721367165, 0.19971431229355555], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 2000, 29, 1.45, 26434.048000000064, 5310, 49203, 26189.0, 43070.8, 45214.45, 47834.96, 2.535047025122316, 58.680202778015435, 0.40255630775154], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 0, 0.0, 40000.188, 39685, 40369, 40007.0, 40015.0, 40068.8, 40165.92, 7.765783955890347, 3.7539678302399624, 3.473368214646268], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1000, 0, 0.0, 37058.228000000025, 35411, 40067, 36917.0, 38775.799999999996, 39780.15, 39919.97, 8.10313672422595, 3.8379114367671723, 4.3443574820312945], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 0, 0.0, 39540.61000000001, 38793, 40351, 39509.0, 39932.6, 40104.7, 40215.91, 7.848431098623385, 333.39995046904187, 1.609541533897374], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1000, 0, 0.0, 43253.2399999999, 40247, 45772, 43462.0, 44519.9, 44843.65, 45232.99, 8.062760527949559, 5142.772702088053, 1.8188453925354964], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1720, 1, 0.05813953488372093, 38473.52034883723, 2412, 40175, 39963.0, 40009.0, 40056.0, 40103.0, 2.091869559770916, 48.90573159337218, 0.42925916842408035], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1000, 0, 0.0, 39633.13799999996, 35516, 40240, 39997.0, 40001.0, 40036.0, 40152.97, 8.075978808631605, 4.463871099302236, 4.290363742085541], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 0, 0.0, 37737.34499999991, 33699, 39882, 37807.0, 39024.9, 39323.85, 39730.99, 8.256342935460168, 40.09667145534557, 1.7496351728465394], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1003, 0, 0.0, 40029.454636091694, 39003, 40661, 40006.0, 40123.0, 40163.0, 40251.84, 1.181097726121925, 28.170588096215894, 0.43368432131039436], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 0, 0.0, 39933.3520000001, 35392, 40201, 40001.0, 40005.0, 40025.8, 40160.86, 8.05185393936954, 3.8057590885301344, 3.3339707717702], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 30, 100.0, 0.20367981533030077], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 14729, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 30, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 2000, 29, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 29, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1720, 1, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
