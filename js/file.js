
    
var fileTypes = [ 'jpg', 'jpeg', 'png'];  //acceptable file types
function test() {
        var file = document.getElementById('up').files[0];
        var reader  = new FileReader();
        reader.onload = function(e)  {
            var image = document.createElement("img");
            image.src = e.target.result;
            document.body.appendChild(image);
         }
         reader.readAsDataURL(file);
     }

 function myFunction() {

        var r_text = new Array ();
        r_text[0] = "Hello Dear Visitor! You are tested <b>covid-19 Positive </b>. please consult your doctor! We are requesting you not to get panic!";
        r_text[1] = "Hello Dear Visitor! You are a tested <b> covid-19 Negative</b>. Stay Home! Stay Safe!";
        var i = Math.floor( Math.random() * r_text.length);
        document.write("<br /><br /><br /><br /><br /><br /><br /><center><FONT SIZE=52><FONT COLOR='#FFFFFF'>" +
           r_text[i]  + "</FONT></center><br />");
        var bgcolorlist=new Array("#228B22", "#FFD700")
        document.body.style.background=bgcolorlist[Math.floor(Math.random()*bgcolorlist.length)];
        //document.getElementById("demo").innerHTML = "Hello Dear Visitor!</br> You've diagnosed <b> covid-19 positive </b> . please contact your personal doctor for treatments. This is curable disease. we are requesting you not to get panic! Good luck to you!";
      }


function readURL(input) {
    if (input.files && input.files[0]) {
        var extension = input.files[0].name.split('.').pop().toLowerCase(),  //file extension from input file
            isSuccess = fileTypes.indexOf(extension) > -1;  //is extension in acceptable types

        if (isSuccess) { //yes
            var reader = new FileReader();
            reader.onload = function (e) {
                if (extension == 'png'){
                 $(input).closest('.fileUpload').find(".icon").attr('src','https://image.flaticon.com/icons/svg/136/136523.svg'); 
                }
                else if (extension == 'jpg' || extension == 'jpeg'){
                  $(input).closest('.fileUpload').find(".icon").attr('src','https://image.flaticon.com/icons/svg/136/136524.svg');
                }
              else if (extension == 'txt'){
                  $(input).closest('.fileUpload').find(".icon").attr('src','https://image.flaticon.com/icons/svg/136/136538.svg');
                }
                else {
                  //console.log('here=>'+$(input).closest('.uploadDoc').length);
                  $(input).closest('.uploadDoc').find(".docErr").slideUp('slow');
                }
            }

            reader.readAsDataURL(input.files[0]);
        }
        else {
            //console.log('here=>'+$(input).closest('.uploadDoc').find(".docErr").length);
            $(input).closest('.uploadDoc').find(".docErr").fadeIn();
            setTimeout(function() {
            $('.docErr').fadeOut('slow');
          }, 9000);
        }
    }
}
$(document).ready(function(){
   
   $(document).on('change','.up', function(){
    var id = $(this).attr('id'); /* gets the filepath and filename from the input */
     var profilePicValue = $(this).val();
     var fileNameStart = profilePicValue.lastIndexOf('\\'); /* finds the end of the filepath */
     profilePicValue = profilePicValue.substr(fileNameStart + 1).substring(0,20); /* isolates the filename */
     //var profilePicLabelText = $(".upl"); /* finds the label text */
     if (profilePicValue != '') {
      //console.log($(this).closest('.fileUpload').find('.upl').length);
        $(this).closest('.fileUpload').find('.upl').html(profilePicValue); /* changes the label text */
     }
   });

   $(".btn-new").on('click',function(){
        $("#uploader").append('<div class="row uploadDoc"><div class="col-sm-3"><div class="docErr">Please upload valid file</div><!--error--><div class="fileUpload btn btn-orange"> <img src="https://image.flaticon.com/icons/svg/136/136549.svg" class="icon"><span class="upl" id="upload">Upload document</span><input type="file" class="upload up" id="up" onchange="readURL(this);" /></div></div><div class="col-sm-8"><input type="text" class="form-control" name="" placeholder="Note"></div><div class="col-sm-1"><a class="btn-check"><i class="fa fa-times"></i></a></div></div>');
   });
    
   $(document).on("click", "a.btn-check" , function() {
     if($(".uploadDoc").length>1){
        $(this).closest(".uploadDoc").remove();
      }else{
        alert("You have to upload at least one document.");
      } 
   });
});
  