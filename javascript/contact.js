function captchaCode() {
  var Numb1, Numb2, Numb3, Numb4, Code;     
  Numb1 = (Math.ceil(Math.random() * 10)-1).toString();
  Numb2 = (Math.ceil(Math.random() * 10)-1).toString();
  Numb3 = (Math.ceil(Math.random() * 10)-1).toString();
  Numb4 = (Math.ceil(Math.random() * 10)-1).toString();
  
  Code = Numb1 + Numb2 + Numb3 + Numb4;
  $("#captcha span").remove();
  $("#captcha input").remove();
  $("#captcha").append("<span id='code'>" + Code + "</span><input type='button' onclick='captchaCode();'>");
}

$(function() {
  captchaCode();
  
  $('#contactForm').submit(function(){
    var captchaVal = $("#code").text();
    var captchaCode = $(".captcha").val();
    if (captchaVal == captchaCode) {
      $(".captcha").css({
        "color" : "#609D29"
      });
    }
    else {
      $(".captcha").css({
        "color" : "#CE3B46"
      });
    }
    
    var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,10})+$/;   
    var emailText = $(".email").val();
    if (emailFilter.test(emailText)) {
      $(".email").css({
        "color" : "#609D29"
      });
    }
    else {
      $(".email").css({
        "color" : "#CE3B46"
      });
    }
    
    var nameFilter = /^([a-zA-Z \t]{3,15})+$/;
    var nameText = $(".name").val();
    if (nameFilter.test(nameText)) {
      $(".name").css({
        "color" : "#609D29"
      });
    }
    else {
      $(".name").css({
        "color" : "#CE3B46"
      });
    }
    
    var messageText = $(".message").val().length;
    if (messageText > 10) {
      $(".message").css({
        "color" : "#609D29"
      });
    }
    else {
      $(".message").css({
        "color" : "#CE3B46"
      });
    }
    
    if ((captchaVal !== captchaCode) || (!emailFilter.test(emailText)) || (!nameFilter.test(nameText)) || (messageText < 50)) {
      return false;
    }
    if ((captchaVal == captchaCode) && (emailFilter.test(emailText)) && (nameFilter.test(nameText)) && (messageText > 50)) {
      $("#form").css("display", "none");
      $("#gform").append("<h2><em>Thanks</em> for contacting me</h2>!")
      return false;
    }
  });       
});




function validEmail(email) { // see:
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validateHuman(honeypot) {
  if (honeypot) {  //if hidden form filled up
    console.log("Robot Detected!");
    return true;
  } else {
    console.log("Welcome Human!");
  }
}

// get all data in form and return object
function getFormData() {
  var form = document.getElementById("gform");
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).filter(function(k) {
        // the filtering logic is simple, only keep fields that are not the honeypot
        return (elements[k].name !== "honeypot");
  }).map(function(k) {
    if(elements[k].name !== undefined) {
      return elements[k].name;
    // special case for Edge's html collection
    }else if(elements[k].length > 0){
      return elements[k].item(0).name;
    }
  }).filter(function(item, pos, self) {
    return self.indexOf(item) == pos && item;
  });
  var data = {};
  fields.forEach(function(k){
    data[k] = elements[k].value;
    var str = ""; // declare empty string outside of loop to allow
                  // it to be appended to for each item in the loop
    if(elements[k].type === "checkbox"){ // special case for Edge's html collection
      str = str + elements[k].checked + ", "; // take the string and append 
                                              // the current checked value to 
                                              // the end of it, along with 
                                              // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space 
                                  // from the  string to make the output 
                                  // prettier in the spreadsheet
    }else if(elements[k].length){
      for(var i = 0; i < elements[k].length; i++){
        if(elements[k].item(i).checked){
          str = str + elements[k].item(i).value + ", "; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });

  // add form-specific values into the data
  data.formDataNameOrder = JSON.stringify(fields);
  data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
  data.formGoogleSendEmail = form.dataset.email || ""; // no email by default

  console.log(data);
  return data;
}

function handleFormSubmit(event) {  // handles form submit withtout any jquery
  event.preventDefault();           // we are submitting via xhr below
  var data = getFormData();         // get the values submitted in the form

  /* OPTION: Remove this comment to enable SPAM prevention, see README.md
  if (validateHuman(data.honeypot)) {  //if form is filled, form will not be submitted
    return false;
  }
  */

  if( !validEmail(data.email) ) {   // if email is not valid show error
    document.getElementById("email-invalid").style.display = "block";
    return false;
  } else {
    var url = event.target.action;  //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function() {
        console.log( xhr.status, xhr.statusText )
        console.log(xhr.responseText);
        document.getElementById("gform").style.display = "none"; // hide form
        document.getElementById("thankyou_message").style.display = "block";
        return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function(k) {
        return encodeURIComponent(k) + "=" + encodeURIComponent(data[k])
    }).join('&')
    xhr.send(encoded);
  }
}
function loaded() {
  console.log("Contact form submission handler loaded successfully.");
  // bind to the submit event of our form
  var form = document.getElementById("gform");
  form.addEventListener("submit", handleFormSubmit, false);
};
document.addEventListener("DOMContentLoaded", loaded, false);

// Menu button actions

$(document).on('click','.icon',function() {
  $('.overlay').css('height', '100%');
  $('.icon').css('display', 'none');
})

$(document).on('click','.close',function() {
  
  $('.overlay').css('height', '0%');
  $('.icon').fadeIn(800).css('display', 'block');

})