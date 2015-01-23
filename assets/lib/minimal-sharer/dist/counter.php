<?php

header('Content-type: text/plain');

$id = $_GET['id'];
$service = $_GET['service'];

if (!isset($id, $service) || empty($id) || empty($service))
	exit;

$id_e = urlencode($id);

if ('gplus' == $service) {
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_URL, 'https://clients6.google.com/rpc?key=AIzaSyCKSbrvQasunBoV16zDH9R33D88CeLr9gQ');
	curl_setopt($ch, CURLOPT_POST, 1);
	curl_setopt($ch, CURLOPT_POSTFIELDS, '[{"method":"pos.plusones.get","id":"p","params":{"nolog":true,"id":"' . $id . '","source":"widget","userId":"@viewer","groupId":"@self"},"jsonrpc":"2.0","key":"p","apiVersion":"v1"}]');
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-type: application/json'));

	$results = curl_exec($ch);
	curl_close($ch);

	$results = json_decode($results, true);

	echo $results[0]['result']['metadata']['globalCounts']['count'];

	exit;
}

if ('linkedin' == $service) {
	echo file_get_contents("http://www.linkedin.com/countserv/count/share?url=$id_e&format=json");
	exit;
}

if ('stumble' == $service) {
	echo file_get_contents("http://www.stumbleupon.com/services/1.01/badge.getinfo?url=$id_e");
	exit;
}

