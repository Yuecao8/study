<?php
    if(!empty($_FILES)){
        echo "来了";
        moveFile($_FILES["pic"]);
    }
        //将文件移动到指定的目录下相对目录
        function moveFile($upload){
            if(!is_dir("images")){     // is_dir(file)函数判断指定的文件夹是否存在 file 是一个相对路径
                mkdir("images");         // mkdir()函数创建文件夹
             }
              if(is_uploaded_file($upload['tmp_name'])){   // 判断上传是不是通过HTTP POST上传的
                $str=stristr($upload['name'],'.');         // 获取文件后缀名称
                $path="images/".$upload["name"];   // 定义上传文件的存储位置
                if(move_uploaded_file($upload['tmp_name'],$path)){   // 执行文件上传操作
                      return $path;  // 返回文件路径
                }else{
                    return false; //上传不成功返回false
                } 
             }
        }
?>