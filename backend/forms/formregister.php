<?php
include('dbconnect.php');
if ($_SERVER["REQUEST_METHOD"]== "POST") {
    $username = $_POST["username"];
    $date = $_POST["date"];
    $address = $_POST["address"];
    $state = $_POST["state"];
    $district = $_POST["district"];
    $pin = $_POST["pin"];
    $email = $_POST["email"];
    $mob = $_POST["mob"];
    $gender = $_POST["gender"];
    $religion = $_POST["religion"];
    $caste = $_POST["caste"];
    $complaint = $_POST["complaint"];
    $pass = $_POST["pass"];

        $query = "INSERT INTO `register` (`username`, `date`, `address`, `state`, `district`, `pin`, `email`, `mob`, `gender`, `religion`, `caste`, `complaint`, `pass`) VALUES
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";

    
       
        header("Location: ../index.html");
     
}
mysql_close($conn);
?>