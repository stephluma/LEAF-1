<?php

require_once getenv('APP_LIBS_PATH') . '/globals.php';
require_once getenv('APP_LIBS_PATH') . '/../Leaf/Db.php';

$log_file = fopen("update_metadata_log.txt", "w") or die("unable to open file");
$time_start = date_create();

$db = new App\Leaf\Db(DIRECTORY_HOST, DIRECTORY_USER, DIRECTORY_PASS, 'national_leaf_launchpad');

//get records of each portal and assoc orgchart
$q = "SELECT `portal_database`, `orgchart_database` FROM `sites`
    WHERE `portal_database` IS NOT NULL AND `site_type`='portal' ORDER BY `orgchart_database`";

$portal_records = $db->query($q);


//used to limit cases in update query
$case_limit = 500;
$json_empty = json_encode(
    array(
        "userName" => "",
        "firstName" => "",
        "lastName" => "",
        "middleName" => "",
        "email" => ""
    )
);

//pull empUIDs to process.  If more than 10k this will be done in batches
function getUniqueEmpIDBatch(&$db):array {
    $getLimit = 10000;
    $SQL = "SELECT `data` FROM `data_history` WHERE `metadata` IS NULL AND 
		`indicatorID` IN (
			SELECT `indicatorID` FROM `indicators`
			WHERE `indicators`.`format`='orgchart_employee'
		) LIMIT $getLimit";

    $records = $db->query($SQL) ?? [];

    //removing duplicates here since using DISTINCT complicates the query
    $mapAdded = array();
    foreach ($records as $rec) {
        $userID = strtoupper($rec['userID']);
        if(!isset($mapAdded[$userID])) {
            $mapAdded[$userID] = 1;
        }
    }
    return array_keys($mapAdded);
}

function getOrgchartBatch(&$db, $batch_count = 0) {
    $limit = 50000; //tested in adminer and handles this size ok
    $offset = $batch_count * $limit;

    $qEmployees = "SELECT `employee`.`empUID`, `userName`, `lastName`, `firstName`, `middleName`, `data` AS `email` FROM `employee`
        JOIN `employee_data` ON `employee`.`empUID`=`employee_data`.`empUID`
        WHERE `deleted`=0 AND `indicatorID`=6 ORDER BY `employee`.`empUID` LIMIT $limit OFFSET $offset";

    return $db->query($qEmployees) ?? [];
}

$empMap = array(); //will contain metadata based on local orgchart.  for this update keys are empUIDs.
$orgchart_db = null;
foreach($portal_records as $rec) {
	//get org info up front for each new orgchart db.  reset and update empmap if changed
    if(!isset($orgchart_db) || $orgchart_db !==  $rec['orgchart_database']) {
        $empMap = array();
        $orgchart_db = $rec['orgchart_database'];
        $orgchart_time_start = date_create();

        try {
            //************ LOCAL ORGCHART ************ */
            $db->query("USE `{$orgchart_db}`");
			
			$org_batch = 0;
			while(count($resEmployees = getOrgchartBatch($db, $org_batch)) > 0) {
				$org_batch += 1;
				foreach($resEmployees as $emp) {
					$mapkey = $emp['empUID'];
					$empMap[$mapkey] = json_encode(
						array(
							'userName' => $emp['userName'],
							'firstName' => $emp['firstName'],
							'lastName' => $emp['lastName'],
							'middleName' => $emp['middleName'],
							'email' => $emp['email']
						)
					)
				}
				unset($resEmployees);
			}

            $orgchart_time_end = date_create();
            $orgchart_time_diff = date_diff($orgchart_time_start, $orgchart_time_end);

            fwrite(
                $log_file,
                "Orgchart " . $orgchart_db . " map info took: " . $orgchart_time_diff->format('%i min, %S sec, %f mcr') . "\r\n"
            );

        } catch (Exception $e) {
            fwrite(
                $log_file,
                "Caught Exception (orgchart connect): " . $orgchart_db . " " . $e->getMessage() . "\r\n"
            );
            $error_count += 1;
        }
    }
	
    $portal_db = $rec['portal_database'];

    try {
        //************ PORTAL (first use) ************ */
        $db->query("USE `{$portal_db}`");
		
		$id_batch = 0;
		//simple array of empUIDs
		while(count($resUniqueIDsBatch = getUniqueEmpIDBatch($db)) > 0) {
			$id_batch += 1;
			$numEmpUIDs = count($resUniqueIDsBatch);
			$case_batch = 0;
			
			while(count($slice = array_slice($resUniqueIDsBatch, $case_batch * $case_limit, $case_limit))) {
				$case_batch += 1;
                $sqlUpdateMetadata = "UPDATE `data_history` SET `metadata` = CASE `data` ";
				$metaVars = array();

				foreach ($slice as $idx => $empID) {
					//use mapped info if present, otherwise use empty values.
					$userInfo = $empMap[$empID] ?? null;
					$metaVars[":user_" . $idx] = $empID;
					$metaVars[":meta_" . $idx] = isset($userInfo) ?
						$userInfo[$empID] : $json_empty;

					$sqlUpdateMetadata .= " WHEN :user_" . $idx . " THEN :meta_" . $idx;	
				}
				
				$sqlUpdateMetadata .= " END";
				$sqlUpdateMetadata .= " WHERE `metadata` IS NULL AND `indicatorID` IN (
					SELECT `indicatorID` FROM `indicators`
						WHERE `indicators`.`format`='orgchart_employee'
					) LIMIT 25000"; //deal with outlier portals where this could otherwise update large # of rows

				try {
					$db->prepared_query($sqlUpdateMetadata, $metaVars);
					fwrite(
						$log_file,
						$id_batch . "(" . $case_batch . "," . count($slice) . "), "
					);
					

				} catch (Exception $e) {
					fwrite(
						$log_file,
						"Caught Exception (update metadata case): " . $e->getMessage() . "\r\n"
					);
				}
				
			} // while limited slices remain
		} // while null value exist

    } catch (Exception $e) {
        fwrite(
            $log_file,
            "Caught Exception (portal connect): " . $e->getMessage() . "\r\n"
        );
    }
}

$time_end = date_create();
$time_diff = date_diff($time_start, $time_end);

fwrite(
    $log_file,
    "\r\n-----------------------\r\nProcess took: " . $time_diff->format('%H hr, %i min, %S sec, %f mcr') . "\r\n"
);

fclose($log_file);