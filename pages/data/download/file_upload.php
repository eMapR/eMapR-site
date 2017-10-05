<?php
	//#########################################################################################################
	// GET INPUTS
	//#########################################################################################################	
	
    // get the data selection array
	$dataCode = $_POST['data'];	
	
	// get the email address
	$email = $_POST['email'];



	//#########################################################################################################
	// UPLOAD THE VECTOR FILE
	//#########################################################################################################	

	// define the vector file outdir
	$uploads_dir  = 'uploads/';
	
	// get the number of uploaded files
	$num_files = count($_FILES['geoFiles']['tmp_name']);
	
	// get the file extensions
	$exts = array();
	for($i=0; $i < $num_files;$i++){
		$thisExt = strtolower(pathinfo($_FILES["geoFiles"]["name"][$i],PATHINFO_EXTENSION));
		array_push($exts, $thisExt);
	}
	
	// is there a .shp file, if so, make sure that .prj and .shx are included
	$upLoadOK = 1;
	if(in_array('shp', $exts)){
		$prj = array_search('prj', $exts);
		$shx = array_search('shx', $exts);
		if(empty($prj)){
			echo("<p>Error: you've supplied a .shp file, but no .prj file</p>");
			$upLoadOK = 0;
		}
		if(empty($shx)){
			echo("<p>Error: you've supplied a .shp file, but no .shx file</p>");
			$upLoadOK = 0;
		}
		if($upLoadOK == 1){
			$upLoadThese = array(array_search('shp', $exts), $prj, $shx);
			$globSearch = '.shp';
		}
	} elseif(in_array('geojson', $exts)){ // if not a .shp, then .geojson
		$upLoadThese = array(array_search('geojson', $exts));
		$globSearch = '.geojson';
	} else{
		echo("<p>Error: you've not supplied a .shp file or a .geojson file</p>");
		$upLoadOK = 0;
	}

	// if there are file(s) to upload then do it
	if($upLoadOK == 1){
		// loop through the uploaded files and move them to the vector dir
		for($i=0; $i < count($upLoadThese);$i++){
			$target_file = $uploads_dir . basename($_FILES["geoFiles"]["name"][$upLoadThese[$i]]);
			move_uploaded_file($_FILES['geoFiles']['tmp_name'][$upLoadThese[$i]], $target_file);
		}
	}	
	
	$inVector = glob($uploads_dir . "*" . $globSearch);
	$outVector = $uploads_dir . "final" . $globSearch;
	$cmd = "'D:/Program Files/QGIS 2.18/OSGeo4W.bat' ogr2ogr -f GeoJSON -t_srs EPSG:5070 " . $outVector . ' ' . $inVector[0];
	//echo $cmd;
	//exec($cmd);



	//#########################################################################################################
	// GET IMAGE DATA PATHS
	//#########################################################################################################

	// make data id/path table
	$dataKey = array(
		array("YODv1234","C:/xampp/htdocs/emapr_data/data/yod.tif"),
		array("MAGv1234","C:/xampp/htdocs/emapr_data/data/mag.tif"),
		array("DURv1234","C:/xampp/htdocs/emapr_data/data/dur.tif"),
	);
	
	// get the data 
	$dataPaths = array();
	for($i=0; $i < count($dataCode);$i++){
		$index = array_search($dataCode[$i], array_column($dataKey, 0));
		array_push($dataPaths, $dataKey[$index][1]);
	}
	
	

	//#########################################################################################################
	// CLIP THE DATA
	//#########################################################################################################
	
	// make an out dir
	$outDir = 'C:/xampp/htdocs/emapr_data/prep/emapr_data_' . rand(10000, 99999) . '/';
	mkdir($outDir);
	
	// loop through the files
	foreach($dataPaths as $inFile){
		$outFile = $outDir . basename($inFile, pathinfo($inFile)['extension']) . 'tif';
		$cmd = "python clip_raster.py " . $inFile . ' ' . $outFile . ' ' . $outVector . ' true 0';
		exec($cmd);
	}

	
	//#########################################################################################################
	// ZIP THE DIR
	//#########################################################################################################

	//


	
?>