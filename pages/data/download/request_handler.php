<?php
  
  //#########################################################################################################
	// GET INPUTS
	//#########################################################################################################	

  // get the data requested
	$dataCode = $_POST['data'];	

	// get the email address
	$email = $_POST['email'];


 
	//#########################################################################################################
	// UPLOAD THE VECTOR FILE
	//#########################################################################################################	
	
	// get the number of uploaded files
	$num_files = count($_FILES['geoFiles']['tmp_name']);
  //print_r($_FILES['geoFiles']['name']);

	// get the file extensions
	$exts = array();
	for($i=0; $i < $num_files;$i++){
    $thisExt = strtolower(pathinfo($_FILES["geoFiles"]["name"][$i],PATHINFO_EXTENSION));
		array_push($exts, $thisExt);
	}


	// is there a .shp file, if so, make sure that .prj, .shx, and .dbf are included
	$errors = '';
  $upLoadOK = 1;
	if(in_array('shp', $exts)){
		$prj = in_array('prj', $exts);
		$shx = in_array('shx', $exts);
    $dbf = in_array('dbf', $exts);
		if($prj == 0){
  			$errors = $errors . "Error: you've supplied a .shp file, but no .prj file<br>";
  			$upLoadOK = 0;
		}
		if($shx == 0){
			  $errors = $errors . "Error: you've supplied a .shp file, but no .shx file<br>";
			  $upLoadOK = 0;
		}
		if($dbf == 0){
  			$errors = $errors . "Error: you've supplied a .shp file, but no .dbf file<br>";
  			$upLoadOK = 0;
		}
		if($upLoadOK == 1){
			$upLoadThese = array(array_search('shp', $exts), array_search('prj', $exts), array_search('shx', $exts), array_search('dbf', $exts));
			$globSearch = '.shp';
		}
	} elseif(in_array('geojson', $exts)){ // if not a .shp, then .geojson
		$upLoadThese = array(array_search('geojson', $exts));
		$globSearch = '.geojson';
	} else{
		$errors = $errors . "Error: you've not supplied a .shp file or a .geojson file<br>";
		$upLoadOK = 0;
	}

  
  
  if($upLoadOK == 0){
    die($errors);
  }

	// if there are file(s) to upload then do it
	if($upLoadOK == 1){
    // make a dir to hold everything for this request
    $outDirBase = '/var/www/emapr/pages/data/download/request/'; # had to set this dir tp permission 777
		
    // what is the the last id in the db - need to know what to call the request dir
    $lastID = array();
    exec('sqlite3 data_requests.db "SELECT id FROM requests ORDER BY id DESC LIMIT 1;"', $lastID);
    $newID = $lastID[0]+1;
    $name = str_pad($newID,6,"0",STR_PAD_LEFT);
    
    // make the request outdir path and create mk it
    $outDirName = 'emapr_data_' . $name . '/';
    $outDir = $outDirBase . $outDirName;
		$oldmask = umask(0);
    mkdir($outDir, 0777); // PERMISSIONS FOR THE BASE DIR NEED TO BE WRITTABLE BY APACHE
    umask($oldmask);

		// loop through the uploaded files and move them to the vector dir
		$uploadedVectors = array();
		for($i=0; $i < count($upLoadThese); $i++){
			$target_file = $outDir . basename($_FILES["geoFiles"]["name"][$upLoadThese[$i]]);
			array_push($uploadedVectors, $target_file);
			move_uploaded_file($_FILES['geoFiles']['tmp_name'][$upLoadThese[$i]], $target_file);
		}
  

		//#########################################################################################################
		// MAKE A GEOJSON FILE IN EPSG:5070
		//#########################################################################################################

		$inVector = glob($outDir . "*" . $globSearch);
		$outVector = $outDir . "aoi.geojson";
		// need to add full path to programs since the path is not in webserver environment...
    // ...webserver process won't necessarily be set up with the same configuration as your own account
    // to find path of a program use: whereis <program>  whereis ogr2ogr 
    // to write out errors append this to the end of the cmd: '> aLogFilePath.txt 2>&1'
    $cmd = '/usr/lib/anaconda/bin/ogr2ogr --config GDAL_DATA /usr/lib/anaconda/share/gdal -f GeoJSON -t_srs EPSG:5070 ' . $outVector . ' ' . $inVector[0]; // . ' > ' . $outDir.'log.txt 2>&1';
    exec($cmd);
    
  

		//#########################################################################################################
		// GET IMAGE DATA PATHS
		//#########################################################################################################

		// make data id/path table
		$dataKey = array(
      "YODv1234",
      "MAGv1234",
      "DURv1234",
      "PREVALv1234"
    );
    $dataPaths = array(
      "/data/catalog/emapr_20170417_greatest_disturbance_mmu11_tight_masked_yod.tif",
      "/data/catalog/emapr_20170417_greatest_disturbance_mmu11_tight_masked_mag.tif",
      "/data/catalog/emapr_20170417_greatest_disturbance_mmu11_tight_masked_dur.tif",
      "/data/catalog/emapr_20170417_greatest_disturbance_mmu11_tight_masked_preval.tif"
    );
		
		// get the data 
		$clipThese = array();
		for($i=0; $i < count($dataCode);$i++){
      $index = array_search($dataCode[$i], $dataKey);
      array_push($clipThese, $dataPaths[$index]);
		}
   
    // make a data string for the database
    $dataString = implode("|", $clipThese);


		//#########################################################################################################
		// CLIP THE DATA
		//#########################################################################################################
		

		// loop through the files
		foreach($clipThese as $inFile){
			$outFile = $outDir . basename($inFile, pathinfo($inFile)['extension']) . 'tif';
			$cmd = "/usr/lib/anaconda/bin/python clip_raster.py " . $inFile . ' ' . $outFile . ' ' . $outVector . ' true -9999'; // . ' >> ' . $outDir.'log.txt 2>&1';
			exec($cmd);
		}

		
		//#########################################################################################################
		// ZIP THE DIR
		//#########################################################################################################

    $cmd = 'cd ' . $outDirBase . ' && zip -r ' . rtrim($outDirName, '/') . '.zip ' . $outDirName . '*tif';
    exec($cmd);
		
    
    
    
		//#########################################################################################################
		// EMAIL THE DATA LINK
		//#########################################################################################################
   
    $dataLink = 'http://emapr.ceoas.oregonstate.edu/pages/data/download/request/' . rtrim($outDirName, '/') . '.zip';
    $cmd = "echo 'Your eMapR data request is ready: " . $dataLink . "\n\n The data will be available for two weeks. Please Contact Justin Braaten at jstnbraaten@gmail.com for assistance with questions or problems.\n\nBest regards, \n\neMapR Lab Group' | mail -s 'eMapR Data Request is Ready' -r 'apache@coas.oregonstate.edu (OSU eMapR Lab)' " . $email;
    exec($cmd);
    
 		// let user know the data are ready
    echo "<b><p>Your data are ready at this <a href='" . $dataLink . "'>URL</a></p></b>";

    
 		//#########################################################################################################
		// RECORD REQUEST IN DB
		//#########################################################################################################

    $cmd = '/usr/lib/anaconda/bin/python update_db.py "'.$newID.'" "'.$name.'" "'.$outVector.'" "'.$dataString.'" "'.$email.'"'; //. ' >> ' . $outDir.'log.txt 2>&1';
    exec($cmd);
   
	}
?>