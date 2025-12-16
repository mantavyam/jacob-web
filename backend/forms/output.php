<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>Bootstrap 4 Bordered Table</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto|Varela+Round|Open+Sans">
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js"></script>
    <style type="text/css">
        .bs-example{
            margin: 20px;
        }
    </style>
    <script type="text/javascript">
        $(document).ready(function(){
            $('[data-toggle="tooltip"]').tooltip();   
        });
    </script>
</head>
<body>
    <div class="bs-example">
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <div class="page-header clearfix">
                        <h2 class="pull-left">Users List</h2>
                    </div>
                    <?php
                    include_once 'dbconnect.php';
                    $result = mysqli_query($conn,"SELECT * FROM register");
                    ?>
 
                    <?php
                    if (mysqli_num_rows($result) > 0) {
                    ?>
                      <table class='table table-bordered table-striped'>
                       
                      <tr>
                        <td>Username</td>
                        <td>Date</td>
                        <td>Address</td>
                        <td>District</td>
                        <td>Pin</td>
                        <td>Email</td>
                        <td>Mobile</td>
                        <td>Gender</td>
                        <td>Relgion</td>
                        <td>Caste</td>
                        <td>Complaint</td>

                      </tr>
                    <?php
                    $i=0;
                    while($row = mysqli_fetch_array($result)) {
                    ?>
                    <tr>
                        <td><?php echo $row["username"]; ?></td>
                        <td><?php echo $row["date"]; ?></td>
                        <td><?php echo $row["address"]; ?></td>
                        <td><?php echo $row["state"]; ?></td>
                        <td><?php echo $row["district"]; ?></td>
                        <td><?php echo $row["pin"]; ?></td>
                        <td><?php echo $row["email"]; ?></td>
                        <td><?php echo $row["mob"]; ?></td>
                        <td><?php echo $row["gender"]; ?></td>
                        <td><?php echo $row["religion"]; ?></td>
                        <td><?php echo $row["caste"]; ?></td>
                        <td><?php echo $row["complaint"]; ?></td>


                    </tr>
                    <?php
                    $i++;
                    }
                    ?>
                    </table>
                    <a href="register.html"><-Go Back to the Register Form</a>
                     <?php
                    }
                    else{
                        echo "No result found";
                    }
                    ?>
                </div>
            </div>        
        </div>
    </div>
</body>
</html>