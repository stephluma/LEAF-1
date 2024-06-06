<?php

require_once getenv('APP_LIBS_PATH') . '/globals.php';
require_once getenv('APP_LIBS_PATH') . '/../Leaf/Db.php';


$db = new App\Leaf\Db(DIRECTORY_HOST, DIRECTORY_USER, DIRECTORY_PASS, 'national_leaf_launchpad');


$log_file = fopen("update_metadata_log.txt", "w") or die("unable to open file");


//get records of each portal and assoc orgchart
$q = "SELECT `site_path`, `portal_database`, `orgchart_database` FROM `sites`
	WHERE `portal_database` IS NOT NULL AND `site_type`='portal'";

$portal_records = $db->query($q);

foreach($portal_records as $rec) {
	$portal_db = $rec['portal_database'];
    $orgchart_db = $rec['orgchart_database'];
	
	try {
        //************ PORTAL (first use) ************ */
		$db->query("USE `{$portal_db}`");
		
        //get unique empUID entries from orghcart_employee type fields
		try {
			$dataQ = "SELECT DISTINCT `data` as `empUID_Data` FROM `data`
                JOIN `indicators` on `data`.`indicatorID`=`indicators`.`indicatorID`
                WHERE `indicators`.`format`='orgchart_employee'";
		
			$resUniqueIDs = $db->query($dataQ) ?? [];
			$numEmpUIDs = count($resUniqueIDs);
			
			if($numEmpUIDs > 0) {
				fwrite(
					$log_file,
					"\r\nUnique data empUID count for " . $portal_db . ": " . $numEmpUIDs . "\r\n"
				);
				
                try {
                    //get all emp info for those IDs from local orgchart
                    //************ ORGCHART ************ */
                    $db->query("USE `{$orgchart_db}`");
                    
                    $inEmpsArr = array_map(
                        function($rec) {
                            return $rec['empUID_Data'];
                        }, $resUniqueIDs
                    );
                    $inEmpsSet = implode(',', $inEmpsArr);

                    $v = array(
                        ':empSet' => $inEmpsSet
                    );

                    $qEmployee = "SELECT employee.empUID, userName, lastName, firstName, middleName, deleted, `data` AS email FROM employee
                        JOIN employee_data ON employee.empUID=employee_data.empUID 
                        WHERE indicatorID=6 AND FIND_IN_SET(employee.empUID, :empSet)";

                    try {
                            
                        $resEmployeeInfo = $db->prepared_query($qEmployee, $v) ?? [];

                        //************ PORTAL ************ */
                        $db->query("USE `{$portal_db}`");

                        foreach ($resEmployeeInfo as $emp) {
                            /* test log
                            fwrite(
                                $log_file,
                                "local info empUID " . $emp['empUID'] . '): ' .
                                $emp['userName'] . ', ' . $emp['email'] . ', ' .
                                $emp['firstName'] . ', ' . $emp['lastName'] . ', ' . $emp['middleName'] . ', ' .
                                $emp['deleted'] . "\r\n"
                            );*/
                            $isDeleted = $emp['deleted'] !== 0;
                            $orgchart_info = 
                                array(
                                    'userName' => $isDeleted ? "" : $emp['userName'],
                                    'firstName' => $isDeleted ? "" : $emp['firstName'],
                                    'lastName' => $isDeleted ? "" : $emp['lastName'],
                                    'middleName' => $isDeleted ? "" : $emp['middleName'],
                                    'email' => $isDeleted ? "" : $emp['email']
                                );

                            $vMeta = array(
                                ':empUID' => $emp['empUID'],
                                ':metadata' => json_encode(array("orgchart_employee" => $orgchart_info)),
                            );
                            $qMetadata = "UPDATE `data` SET data.metadata=:metadata
                                WHERE data.data=:empUID AND indicatorID IN (
                                    SELECT indicatorID FROM indicators
                                    WHERE indicators.format='orgchart_employee'
                                )";

                            try {
                                $db->prepared_query($qMetadata, $vMeta);

                            } catch (Exception $e) { //catch portal post
                                fwrite(
                                    $log_file,
                                    "Caught Exception (metadata update): " . $e->getMessage() . "\r\n"
                                );
                            }
                        }

                    
                    } catch (Exception $e) {
                        fwrite(
                            $log_file,
                            "Caught Exceptioni (query employee): " . $e->getMessage() . "\r\n"
                        );
                    }

                } catch (Exception $e) {
                    fwrite(
                        $log_file,
                        "Caught Exception (orgchart connect): " . $e->getMessage() . "\r\n"
                    );
                }

			}
			
		} catch (Exception $e) {
			fwrite(
				$log_file,
				"Caught Exception (query unique emp data): " . $e->getMessage() . "\r\n"
			);
		}
		
	} catch (Exception $e) {
		fwrite(
			$log_file,
			"Caught Exception (portal connect): " . $e->getMessage() . "\r\n"
		);
	}
}

fclose($log_file);