<?php
require('config.php');
$speechdb = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);
header('Content-type:application/json;charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

if($_GET['url'] == 'speech_time'){
    $json = json_decode(file_get_contents('php://input'), true);
    $speech = $json['speech'] ?? null;
    if(!$speech || strlen($speech) == 0){
        return 0;
    }
    $words = explode(" ", $speech);
    $word_occurences = array();
    $f = new NumberFormatter("en", NumberFormatter::SPELLOUT);
    $totalTime = 0;
    $variance = 0;
    
    $periods = substr_count($speech, ".");
    $commas = substr_count($speech, ",");
    
    $totalTime += $periods * .78968;
    $totalTime += $commas * .47229;
    
    for($i = 0; $i < count($words); $i++){
    	if(strlen($words[$i]) == 0){
    		continue;
    	}
    	$word = strtolower($words[$i]);
    	if(is_numeric($word)){
    		$number = $f->format($word);
    		$numbers = explode(" ", $number);
    		for($j = 0; $j < count($numbers); $j++){
    			if(strpos($numbers[$j], "-") !== false){
    				$split = explode("-", $numbers[$j]);
    				check_and_increment($word_occurences, $split[0]);
    				check_and_increment($word_occurences, $split[1]);
    			}else{
    			    check_and_increment($word_occurences, $numbers[$j]);
    			}
    		}
    	}else{
    		check_and_increment($word_occurences,$word);
    	}
    }
    $sql = "SELECT word, avg_length, variance FROM words WHERE ";
    foreach($word_occurences as $key=>$value){
        $sql .= "word = '$key' OR ";
    }
    $sql = substr($sql, 0, -4);

    $result = $speechdb->query($sql);
    while($row = $result->fetch_assoc()){
    	$totalTime += $row['avg_length'] * $word_occurences[$row['word']];
    	$variance += $row['variance'] * $word_occurences[$row['word']];
    }
    
    $response = ["timeInSeconds" => $totalTime, "varianceInSeconds" => $variance];
    header('Content-type:application/json;charset=utf-8');
    echo json_encode($response);


}

if($_GET['url'] == 'get_id'){
    $response = ["id" => null];
    $json = json_decode(file_get_contents('php://input'), true);
    $word = $json['word'] ?? null;
    $stmt = $speechdb->prepare("SELECT id FROM words WHERE word = ?");
    $stmt->bind_param("s", $word);
    if(!$stmt->execute()){
        echo json_encode($response);
    }else{
        $result = $stmt->get_result();
        $response['id'] = $result->fetch_assoc()['id'];
        echo json_encode($response);
    }
}

if($_GET['url'] == 'word_info'){
    $response = ["avg_time" => null, "total_occurences" => null, "variance" => null, "occurences_over_time" => [], "occurences_by_percentage" => []];
    $json = json_decode(file_get_contents('php://input'), true);
    $word_id = $json['id'] ?? null;
    $stmt = $speechdb->prepare("SELECT * FROM words WHERE id = ?");
    $stmt->bind_param("i", $word_id);
    if(!$stmt->execute()){
        echo json_encode($response);
    }else{
        $result = $stmt->get_result()->fetch_assoc();
        $response['avg_time'] = $result['avg_length'];
        $response['total_occurences'] = $result['num_occurences_tot'];
        $response['variance'] = $result['variance'];

        $word_date = $speechdb->query("SELECT * from word_date WHERE word_id = $response[id]");
        while($date = $word_date->fetch_assoc()){
            $temp = ["date" => $date['date'], "num_of_occurences"=> $date['num_of_occurences']];
            array_push($response['occurences_over_time'], $temp);
        }


        echo json_encode($response);
    }
}

function check_and_increment(&$word_array, $word){
    $word = preg_replace('/[^A-Za-z\-]/', '', $word);
    if(array_key_exists($word, $word_array)){
        $word_array[$word] += 1;
    }else{
        $word_array[$word] = 1;
    }
}