<?php
$name = intval($_GET['name']);
$count= intval($_GET['count']) ? intval($_GET['count']) : 50;
if(file_exists('./1.json'))
{
$json = file_get_contents('./1.json');
}
else
{
$json = file_get_contents('http://middle-api.plus.vinj.cn/api/gallery/common/search?search_text=%E9%9B%A8%E8%8A%B1&column_id=&order=desc&china=&location_id=&per_num='.$count.'&date_search=&start_time=&end_time=&author=&act_id=1');
file_put_contents('./1.json',$json);
}




$data = json_decode($json,1);
$data = $data['data']['data'];
$ret = array();
foreach($data as $k => $v)
{
$ret[]=$v['index_pic'];
}
echo json_encode($ret);exit;
//echo $ret[$name];exit;
?>