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

    var data = {"OkPercent": 99.3923076923077, "KoPercent": 0.6076923076923076};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07688461538461538, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [0.9995, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13000, 79, 0.6076923076923076, 34590.9144615386, 205, 95857, 39783.0, 42455.6, 55019.7, 80573.00999999998, 28.81269531682883, 3098.967534983876, 8.60239250994592], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 35, 3.5, 39872.98599999995, 21014, 45422, 40774.0, 42662.8, 43154.09999999999, 43615.81, 4.899415009847824, 3018.1372037538094, 1.0665557587111598], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1000, 0, 0.0, 39446.04800000005, 18358, 40453, 39796.0, 39944.8, 39989.9, 40076.81, 8.104318791483982, 190.29690013605125, 1.6699328759796095], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1000, 0, 0.0, 219.18699999999998, 205, 673, 215.0, 229.89999999999998, 244.0, 297.98, 11.939158050574274, 5.50320566393658, 1.92379011557105], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1000, 0, 0.0, 32764.81799999999, 8725, 56368, 32226.0, 51341.5, 53708.84999999999, 55660.7, 17.613075947583486, 414.56837712567807, 2.8380444642102294], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 0, 0.0, 38651.79000000004, 18828, 40659, 39722.0, 40101.2, 40167.0, 40224.87, 5.511281593421734, 2.6641449108825768, 2.465006806432768], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1000, 0, 0.0, 31374.306999999986, 17169, 41590, 31635.5, 39822.9, 40229.95, 40497.97, 5.75612451648554, 2.7262894438432492, 3.086047226123595], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 14, 1.4, 33390.599, 21050, 40402, 35067.0, 40018.9, 40118.8, 40264.94, 5.134550906504962, 216.98585054156678, 1.0382422956063648], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1000, 0, 0.0, 62316.62500000002, 40108, 95857, 64595.5, 82457.0, 85518.65, 88806.73000000001, 5.748249657979145, 3668.896761121785, 1.2967242880792798], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1000, 0, 0.0, 36949.348999999966, 2898, 40198, 39969.5, 40061.9, 40098.95, 40113.98, 11.568316694237822, 271.6333622661754, 2.3837058813322076], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1000, 0, 0.0, 32049.176000000018, 15697, 41123, 39873.0, 39998.0, 40008.85, 40491.0, 5.7532433909616545, 3.180015389926071, 3.056410551448379], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 30, 3.0, 27725.592999999964, 16680, 40051, 22945.0, 38664.399999999994, 39582.9, 39857.93, 5.692329585883023, 27.297711060907925, 1.1700961470044116], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1000, 0, 0.0, 39665.39899999996, 18579, 40666, 40013.5, 40162.0, 40203.0, 40295.98, 8.089829466394848, 193.68558315282903, 2.9704842571918584], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 0, 0.0, 35256.01100000004, 15674, 40242, 39921.0, 40041.0, 40047.0, 40103.96, 5.759970508950994, 2.7224860608713684, 2.3849877888625213], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 79, 100.0, 0.6076923076923076], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13000, 79, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 79, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 35, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 35, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 14, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 14, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 30, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
