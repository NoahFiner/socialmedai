var changeTimeout, changeInterval, emailChangeTimeout, emailChangeTimeout2;
var currentSlide = 0;
var currentEmail = "order";

var scrollToOrder = false;

$(document).ready(function() {
  $(".inactive").removeClass("inactive");

  for(var i = 0; i < 10; i++) {
    $(".cool-divs").append("<div class='cool-div'\
                            style='transform: rotate("+Math.random()*360+"deg);\
                                  top: "+Math.random()*70+"%;\
                                  left: "+Math.random()*100+"%;\
                                  height: "+Math.random()*200+"px;\
                                  width: "+Math.random()*500+"px'></div>");
  }

  $("#hamburger-outer").click(function() {
    $("#hamburger-outer, #header-right").toggleClass("expanded");
  });

  $(window).scroll(function() {
    if(window.scrollX > 0) {
      window.scrollTo(0, $(window).scrollTop());
    }
    $("#hamburger-outer, #header-right").removeClass("expanded");
  });

  $(window).resize(function() {
    $("#hamburger-outer, #header-right").removeClass("expanded");
  });

  $("#email-submit").mouseover(function() {
    var email = {};
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    email.type = $("select[name='email-type']").find(":selected").text();
    email.name = "*NAME UNKNOWN*"
    email.email = "*EMAIL UNKNOWN*"
    if($("input[name='name']").val()) email.name = $("input[name='name']").val();
    if($("input[name='email']").val()) email.email = $("input[name='email']").val();
    if(email.type.toLowerCase() === "order") {
      email.amount = $("input[name='order-number']").val();
      email.flavor = $("select[name='order-flavor']").find(":selected").text();
      email.date = "N/A";
      if($("input[name='order-date']").val()) {
        email.date = $("input[name='order-date']").val();
      }
      email.comments = $("textarea[name='order-body']").val();
      $("#email-submit").attr("href", "mailto:tuitionhotsauce@gmail.com?Subject="+email.type+"%20by%20"+email.name+"%20at%20"+dateTime+"&Body="+email.type+"%20by%20"+email.name+"%20at%20"+dateTime+"%0A%0AReply%20to%3A%20"+email.email+"%0A%0AFlavor%3A%20"+email.flavor+"%0AAmount%3A%20"+email.amount+"%0AHot%20sauce%20needed%20by%3A%20"+email.date+"%0A%0AAdditional%20comments%3A%20"+email.comments+"");
    } else {
      email.subject = $("input[name='subject']").val();
      email.body = $("textarea[name='body']").val();
      $("#email-submit").attr("href", "mailto:tuitionhotsauce@gmail.com?Subject="+email.subject+"&Body="+email.type+"%20by%20"+email.name+"%20at%20"+dateTime+"%0AReply%20to%3A%20"+email.email+"%0A%0A"+email.body);
    }
  });

  // if on the order page, scroll down to the form
  if($("#contact-upper").length !== 0 && scrollToOrder) {
    $('html, body').animate({
      scrollTop: $("#contact-upper").offset().top - 140
    }, 500);
  }
});
