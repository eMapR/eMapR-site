<?php
    // soruce: https://github.com/HeikkiVesanto/Leaflet.Photo/blob/gh-pages/local_file_example/getphotos.php

    //The directory (relative to this file) that holds the images
    $dir = "photos";
	
	//The directory (relative to this file) that holds the thumbnails, they have to have the same name as the photos
	$thumb_dir = "photos_thumbnail";
    //This array will hold all the image addresses
    $result = array();
    //Get all the files in the specified directory
    $files = scandir($dir);
    foreach($files as $file) {
        switch(strtoupper(ltrim(strstr($file, '.'), '.'))) {
            //Only work on jpegs and TIFF since other images do not have exif
            case "JPG": case "JPEG": case "TIF": case "TIFF":
				$path = $dir . "/" . $file;
				$exif = exif_read_data($path);
					//Check photos are on the earth
					if($exif["GPSLatitude"][0]<90 AND $exif["GPSLongitude"][0]<180){
						//Check photos are not on NULL island, remove if they should be.
						if($exif["GPSLatitude"][0]!=0 OR $exif["GPSLatitude"][1]!=0 OR $exif["GPSLongitude"][0]!=0 OR $exif["GPSLongitude"][1]!=0){
							//Check if there is exif infor
							$LatM = 1; $LongM = 1;
							if($exif["GPSLatitudeRef"] == 'S'){
								$LatM = -1;
							}
							if($exif["GPSLongitudeRef"] == 'W'){
								$LongM = -1;
							}
							//get the GPS data
							$gps['LatDegree']=$exif["GPSLatitude"][0];
							$gps['LatMinute']=$exif["GPSLatitude"][1];
							$gps['LatgSeconds']=$exif["GPSLatitude"][2];
							$gps['LongDegree']=$exif["GPSLongitude"][0];
							$gps['LongMinute']=$exif["GPSLongitude"][1];
							$gps['LongSeconds']=$exif["GPSLongitude"][2];
							//convert strings to numbers
							foreach($gps as $key => $value){
								$pos = strpos($value, '/');
								if($pos !== false){
									$temp = explode('/',$value);
									$gps[$key] = $temp[0] / $temp[1];
								}
							}
							$file_object = new stdClass();
							//calculate the decimal degree
							$file_object->lat = $LatM * ($gps['LatDegree'] + ($gps['LatMinute'] / 60) + ($gps['LatgSeconds'] / 3600));
							$file_object->lng = $LongM * ($gps['LongDegree'] + ($gps['LongMinute'] / 60) + ($gps['LongSeconds'] / 3600));
							
							$file_object->thumbnail = $thumb_dir . "/" . $file;
							$file_object->filename = $dir . "/" . $file;
							
							$result[] = $file_object;
						}
					}
		}
	}
    //Convert the array into JSON
    $resultJson = json_encode($result);
    //Output the JSON object
    //This is what the AJAX request will see
    echo($resultJson);
?>