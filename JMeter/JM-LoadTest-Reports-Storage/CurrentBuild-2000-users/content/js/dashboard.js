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

    var data = {"OkPercent": 95.48148718343468, "KoPercent": 4.518512816565314};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0784389192517897, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [5.005005005005005E-4, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [0.99975, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [0.0032532532532532532, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [0.006009013520280421, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [5.005005005005005E-4, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [0.007010515773660491, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [0.002002002002002002, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 25982, 1174, 4.518512816565314, 65208.053767993464, 124, 273582, 78854.0, 82490.40000000001, 149420.75000000003, 176694.00000000017, 20.223263836457914, 1905.7745312310276, 5.8600355390373124], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1998, 441, 22.07207207207207, 62692.504504504526, 1453, 83435, 74382.5, 81976.1, 82438.5, 82798.14, 2.256974253775179, 1089.6947751730856, 0.3967635403629007], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 2000, 0, 0.0, 79803.35950000015, 79552, 81059, 79796.0, 79874.0, 79926.9, 80065.99, 8.898063781321184, 206.16824208739678, 1.833487751815205], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 2000, 0, 0.0, 204.8480000000001, 186, 568, 203.0, 212.0, 217.0, 282.99, 13.794340182223234, 6.358328677743522, 2.222720830143392], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 2000, 0, 0.0, 50870.17999999997, 9285, 95533, 51645.0, 83833.90000000001, 90197.55, 93882.39, 20.83876009377442, 484.0182990362074, 3.357808022922636], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1998, 6, 0.3003003003003003, 74547.20820820819, 289, 80299, 79045.0, 79613.0, 79684.05, 79813.02, 2.183902517936857, 1.0710531912248218, 0.973851237763369], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1998, 0, 0.0, 56857.19019019016, 25100, 86514, 59202.5, 77890.5, 79737.1, 80546.27, 5.309692181358675, 2.5140528997682656, 2.846700202701087], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1997, 394, 19.72959439158738, 53074.74411617432, 124, 79842, 47795.0, 79353.4, 79475.1, 79631.0, 2.4451913481612086, 84.74006138806239, 0.4025201686961632], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1998, 36, 1.8018018018018018, 140093.79179179185, 81823, 273582, 149513.5, 176701.1, 184645.1, 197034.61, 5.25282161701725, 3191.8270914997884, 1.1636120099141092], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 2000, 0, 0.0, 77918.91099999985, 18614, 80435, 79999.0, 80061.9, 80099.0, 80132.95, 12.23997698884326, 283.6040918243074, 2.522104633443289], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1998, 14, 0.7007007007007007, 60963.53353353362, 650, 81407, 79299.0, 79649.0, 79682.0, 79707.01, 1.9810874563848426, 1.1265602891862172, 1.0450781676824945], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1997, 265, 13.26990485728593, 46579.71557336005, 124, 79502, 41154.0, 79028.0, 79198.3, 79291.08, 2.5639280867601424, 11.76048269003496, 0.47123272205196415], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 2000, 0, 0.0, 80008.34749999996, 79763, 81262, 80000.0, 80079.0, 80131.0, 80266.92, 8.890192783830518, 210.08369421959665, 3.264367662812768], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1998, 18, 0.9009009009009009, 64112.24074074072, 351, 79927, 78911.5, 79413.0, 79556.3, 79840.02, 2.124876367929043, 1.0493708224324412, 0.8719052100947581], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 282,331; actual size: 172,992)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 16,376; actual size: 15,582)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 275,553; actual size: 2,390)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 281,209; actual size: 40,814)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 18,793)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 23,741)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,457)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 16,297)", 2, 0.17035775127768313, 0.007697636825494573], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 18,785)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 7,357)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,497)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 267,353; actual size: 239,927)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,528; actual size: 40,881)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 8,105)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 8,113)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 24,568; actual size: 15,574)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 40,864)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 10,593)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 297,585; actual size: 188,270)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 10,583)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 322,161; actual size: 212,831)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 288,686; actual size: 113,804)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 49,056)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 25,587)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 264,817; actual size: 24,415)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 16,376; actual size: 7,374)", 2, 0.17035775127768313, 0.007697636825494573], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 65,536; actual size: 57,232)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 8,081)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 40,944; actual size: 16,289)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 308,313; actual size: 133,447)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,481)", 3, 0.2555366269165247, 0.01154645523824186], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 1138, 96.9335604770017, 4.379955353706412], "isController": false}, {"data": ["Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 280,494; actual size: 105,651)", 1, 0.08517887563884156, 0.0038488184127472864], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 25982, 1174, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 1138, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,481)", 3, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 16,297)", 2, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 16,376; actual size: 7,374)", 2, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 282,331; actual size: 172,992)", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1998, 441, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 441, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1998, 6, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1997, 394, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 394, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1998, 36, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 24,481)", 3, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 32,768; actual size: 16,297)", 2, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 16,376; actual size: 7,374)", 2, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 282,331; actual size: 172,992)", 1, "Non HTTP response code: org.apache.http.TruncatedChunkException/Non HTTP response message: Truncated chunk (expected size: 16,376; actual size: 15,582)", 1], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1998, 14, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1997, 265, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 265, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1998, 18, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 18, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
