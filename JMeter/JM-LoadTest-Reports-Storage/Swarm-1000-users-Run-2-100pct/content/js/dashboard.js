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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 13000, 0, 0.0, 35832.51646153869, 185, 54561, 39987.0, 42248.9, 42848.95, 44219.86, 29.091885601754463, 3180.1568929411615, 8.724069059660744], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["PP-LOAD-ReportBuilder-Request-Main-Page", 1000, 0, 0.0, 41838.44299999995, 40108, 54561, 41628.0, 43050.9, 44133.4, 47713.060000000005, 10.23719582731898, 6533.971094637756, 2.30936741807684], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-1", 1000, 0, 0.0, 39816.18999999997, 39576, 40073, 39805.0, 39898.0, 39926.95, 39993.95, 10.716850103417604, 251.64136303932546, 2.208257199044057], "isController": false}, {"data": ["PP-LOAD-Form-Indicators-0", 1000, 0, 0.0, 197.5919999999999, 185, 534, 195.0, 205.0, 213.0, 261.9200000000001, 18.67553131886602, 8.608252717289806, 3.0092408863407165], "isController": false}, {"data": ["PP-LOAD-Form-Categories", 1000, 0, 0.0, 26674.19600000003, 6660, 48383, 26632.0, 43621.1, 45636.399999999994, 47530.86, 20.613456464379947, 485.19100299925793, 3.321504215451847], "isController": false}, {"data": ["PP-LOAD-Set-Request-Initiator", 1000, 0, 0.0, 40008.84699999998, 39808, 40215, 40008.0, 40015.0, 40025.0, 40089.98, 10.247686584753492, 4.953715683059549, 4.583437945133886], "isController": false}, {"data": ["PP-LOAD-CreateRequest", 1000, 0, 0.0, 37315.38800000003, 36495, 39993, 37199.0, 37651.9, 39241.75, 39774.94, 10.66791836908864, 5.052676180671865, 5.719421078739905], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Workflow-Steps", 1000, 0, 0.0, 38461.149000000005, 36683, 42617, 38397.0, 39785.0, 40085.7, 40711.26, 10.311085447965107, 441.51775875024487, 2.114578070383469], "isController": false}, {"data": ["PP-LOAD-Form-All-Form-Metadata", 1000, 0, 0.0, 42768.88900000001, 40531, 44338, 42731.5, 43369.9, 43527.95, 43938.94, 10.417317749025981, 6649.022843387347, 2.3500003906494156], "isController": false}, {"data": ["PP-LOAD-Form-All-Forms", 1000, 0, 0.0, 39691.00399999998, 27057, 40611, 40000.0, 40058.8, 40093.95, 40111.98, 12.435954832612047, 292.0067487400823, 2.56248678679799], "isController": false}, {"data": ["PP-LOAD-Set-Request-Title", 1000, 0, 0.0, 39801.125, 36515, 40320, 39996.0, 40000.0, 40001.0, 40071.68, 10.607716052656704, 5.86324930254267, 5.635349152973873], "isController": false}, {"data": ["PP-LOAD-ReportBuilder-Dependencies", 1000, 0, 0.0, 39234.46600000004, 35490, 40813, 39771.0, 39820.0, 39826.0, 39919.87, 10.92812571715825, 53.071908945490506, 2.315823516233731], "isController": false}, {"data": ["PP-LOAD-Form-Indicators", 1000, 0, 0.0, 40013.919000000016, 39765, 40280, 40000.0, 40093.0, 40123.85, 40205.98, 10.694043417816276, 256.035127008475, 3.926719067479414], "isController": false}, {"data": ["PP-LOAD-Set-Request-Service", 1000, 0, 0.0, 40001.50600000001, 39840, 40193, 40001.0, 40005.0, 40014.0, 40079.92, 10.249682259849944, 4.8445763806322, 4.244009060719118], "isController": false}]}, function(index, item){
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
