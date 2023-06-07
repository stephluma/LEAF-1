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

    var data = {"OkPercent": 95.26153846153846, "KoPercent": 4.7384615384615385};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.07676923076923077, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [0.998, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13000, 616, 4.7384615384615385, 34113.445923077015, 187, 106209, 37822.0, 44364.8, 58343.549999999945, 78981.32999999999, 29.441872684283474, 3023.467662880083, 8.378254158522969], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 68, 6.8, 36128.02099999995, 21043, 45741, 37439.0, 40291.9, 40818.6, 41618.81, 5.4594390972271505, 3149.4161364470788, 1.1478257442580349], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1000, 0, 0.0, 39608.65299999994, 38826, 45119, 39208.0, 39718.9, 44145.0, 44371.81, 8.277734549608462, 191.79646758025265, 1.7056660058275253], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1000, 0, 0.0, 208.01900000000018, 187, 1376, 202.5, 213.0, 219.0, 283.99, 12.422360248447204, 5.725931677018633, 2.0016498447204967], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1000, 0, 0.0, 39785.96600000001, 17296, 64865, 40058.0, 56894.6, 58892.7, 62523.240000000005, 15.200109440787974, 353.04534192646184, 2.4492363845019685], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 126, 12.6, 34057.935999999965, 21045, 45124, 34158.5, 40046.0, 40088.95, 40162.99, 5.792668798368784, 4.5192772776773715, 2.2644130650748413], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1000, 0, 0.0, 31133.38000000001, 16374, 45159, 32474.5, 39373.8, 39811.399999999994, 44187.01, 6.515549358544166, 3.1623320617152832, 3.493199802578854], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 102, 10.2, 32314.56700000005, 20912, 41948, 33218.5, 36890.9, 37062.95, 38388.07, 6.132711885195634, 235.7099188948853, 1.1294011790138598], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1000, 0, 0.0, 61153.397000000026, 39549, 106209, 63052.5, 80809.9, 85296.24999999999, 90270.91, 6.533428285824421, 4042.616097999791, 1.47384954494672], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1000, 0, 0.0, 38544.76199999991, 6998, 44802, 39400.0, 44256.3, 44411.0, 44723.99, 11.455409817286213, 265.4310634916089, 2.360440890085343], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1000, 0, 0.0, 31460.093000000004, 15685, 44929, 39721.0, 39897.9, 39924.0, 40084.96, 6.30314337760241, 3.059240486980857, 3.3485449193512804], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 129, 12.9, 27719.95999999998, 7007, 41582, 27929.0, 36583.9, 36704.7, 36855.99, 7.107371054520644, 32.65420552029509, 1.3118582821306475], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1000, 0, 0.0, 39816.776000000034, 39029, 45557, 39410.5, 39984.5, 44354.25, 44624.48, 8.263165288095257, 195.2676981507036, 3.0341310042224774], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 191, 19.1, 31543.266999999996, 15734, 44937, 34337.0, 39916.8, 39961.0, 40087.76, 6.5772165219679035, 6.131687179360695, 2.2032133813470143], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 616, 100.0, 4.7384615384615385], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 13000, 616, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 616, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 68, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 68, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 126, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 126, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 102, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 102, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 129, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 129, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 191, "Non HTTP response code: org.apache.http.conn.HttpHostConnectException/Non HTTP response message: Connect to nologin.leaf-preprod.va.gov:443 [nologin.leaf-preprod.va.gov/10.247.111.140] failed: Connection timed out: connect", 191, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
