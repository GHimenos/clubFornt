<?php


$myCurl = curl_init();
$headers = [
    'Content-Type:application/json',
    'Authorization: Basic '. base64_encode("artemwinery:12345")
];




curl_setopt_array($myCurl, array(
    CURLOPT_URL => "https://news.interfax.kyiv.ua/rss/5152760",
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_RETURNTRANSFER => true,
));



$response = curl_exec($myCurl);
curl_close($myCurl);
echo $response;


