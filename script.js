var changeTimeout, changeInterval, emailChangeTimeout, emailChangeTimeout2;
var currentSlide = 0;
var currentEmail = "order";

var scrollToOrder = false;

$(document).ready(function() {

  for(var i = 0; i < 15; i++) {
    $(".cool-divs").append("<div class='cool-div'\
                            style='transform: rotate("+Math.random()*360+"deg) scaleX(1);\
                                  top: "+Math.random()*70+"%;\
                                  left: "+Math.random()*100+"%;\
                                  height: "+Math.random()*150+50+"px;\
                                  width: "+Math.random()*500+"px'></div>");
  }

  $(".inactive").removeClass("inactive");

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

  $("input[name='instagram-search']").click(function() {
    var clientID = "57f248212b774817a5fc69380cc19db2";
    var redirectURI = "";
    location.href = "https://api.instagram.com/oauth/authorize/?client_id="+clientID+"&redirect_uri=REDIRECT-URI&response_type=code";
  })

  //client ID: 57f248212b774817a5fc69380cc19db2
  //client secret: 64f78eae0ca44734be6bb1f8d69e6f9f
});
