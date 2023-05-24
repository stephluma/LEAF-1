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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7653846153846153, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.15, 500, 1500, "PP-LOAD-ReportBuilder-Request-Main-Page"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Form-Indicators-1"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Form-Indicators-0"], "isController": false}, {"data": [0.2, 500, 1500, "PP-LOAD-Form-Categories"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Set-Request-Initiator"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-CreateRequest"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-ReportBuilder-Workflow-Steps"], "isController": false}, {"data": [0.0, 500, 1500, "PP-LOAD-Form-All-Form-Metadata"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Form-All-Forms"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Set-Request-Title"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-ReportBuilder-Dependencies"], "isController": false}, {"data": [0.6, 500, 1500, "PP-LOAD-Form-Indicators"], "isController": false}, {"data": [1.0, 500, 1500, "PP-LOAD-Set-Request-Service"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 130, 0, 0.0, 618.6846153846151, 134, 2048, 361.5, 1726.5000000000002, 1967.6499999999999, 2046.1399999999999, 15.611865017413235, 1657.9608314819263, 4.6816830791401465], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 10, 0, 0.0, 1507.8, 928, 1777, 1625.0, 1772.2, 1777.0, 1777.0, 3.247807729782397, 2009.9245265305292, 0.7326597515427087], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 10, 0, 0.0, 276.8, 144, 401, 282.5, 397.90000000000003, 401.0, 401.0, 15.748031496062993, 364.91141732283467, 3.244955708661417], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 10, 0, 0.0, 244.89999999999998, 218, 370, 231.0, 357.20000000000005, 370.0, 370.0, 15.772870662460567, 7.193291600946372, 2.5415270110410093], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 10, 0, 0.0, 1482.6, 943, 1838, 1559.0, 1829.8, 1838.0, 1838.0, 5.104645227156713, 118.56136740684022, 0.8225258422664624], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 10, 0, 0.0, 359.8, 179, 408, 370.0, 407.8, 408.0, 408.0, 5.753739930955121, 2.781348892405063, 2.573450086306099], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 10, 0, 0.0, 222.0, 136, 391, 180.0, 383.5, 391.0, 391.0, 9.041591320072333, 4.273564647377938, 4.847493783905967], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 10, 0, 0.0, 219.90000000000003, 138, 400, 211.0, 387.1, 400.0, 400.0, 4.310344827586206, 183.10378502155174, 0.8839574353448276], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 10, 0, 0.0, 1942.4, 1612, 2048, 1992.5, 2047.4, 2048.0, 2048.0, 4.295532646048111, 2657.888091306916, 0.9690117590206186], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 10, 0, 0.0, 334.0, 200, 403, 343.5, 402.3, 403.0, 403.0, 16.207455429497568, 375.557131280389, 3.3396221636953], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 10, 0, 0.0, 329.7, 140, 401, 354.5, 400.7, 401.0, 401.0, 7.722007722007723, 4.268219111969112, 4.102316602316603], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 10, 0, 0.0, 255.0, 134, 358, 266.5, 351.1, 358.0, 358.0, 4.5662100456621, 22.17554937214612, 0.9676441210045662], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 10, 0, 0.0, 522.7, 435, 632, 515.0, 627.7, 632.0, 632.0, 9.950248756218905, 235.10377798507466, 3.65360696517413], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 10, 0, 0.0, 345.30000000000007, 185, 403, 358.5, 398.90000000000003, 403.0, 403.0, 6.591957811470007, 3.1157300593276207, 2.7294825313118], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 130, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
