<?php
include('dbconnect.php');

if (isset($_POST['submit'])) {
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
    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt=mysqli_prepare($conn,$query);

    if ($stmt) {
        mysqli_stmt_bind_param($stmt, 'sssssisisssss', $username, $date, $address, $state, $district, $pin, $email, $mob, $gender, $religion, $caste, $complaint, $pass);
        $result = mysqli_stmt_execute($stmt);

        if ($result) {
            header("Location: output.php");
        } else {
            echo '<script>
                window.location.href = "index.php";
                alert("Submission failed. Invalid name, email, or description.")
            </script>';
        }

         mysqli_stmt_close($stmt);
    }
}

// Close the database connection
mysqli_close($conn);
?>