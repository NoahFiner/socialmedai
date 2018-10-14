var changeTimeout, changeInterval, emailChangeTimeout, emailChangeTimeout2;
var currentSlide = 0;
var currentEmail = "order";

var scrollToOrder = false;


//AMAZING INSTAGRAM SCRAPER
(function ($){
  $.fn.igjs = function(options) {
    let t = this;
    let settings = $.extend({
      // These are the default settings
        user: 'instagram',
        posts: 12,
        perRow: 4,
        info: true,
        bootstrap: false
    }, options );

    // Scrapes the html from user page via cors proxy and parses it into meaningful json (currently hardcoded to append bootstrap formatted images)
    function getPosts(user, postCount, perRow, el) {
      let $this = {
        posts: []
      }
      columns = 12 / perRow;
      $.getJSON('https://allorigins.me/get?url=' + encodeURIComponent('https://instagram.com/' + user + '/'), function (data) { // get the html
      let posts = JSON.parse(data.contents.split('window._sharedData = ')[1].split('\;\<\/script>')[0]).entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges //parse the html into array of posts
        posts.forEach(function (e, i) { // cycle through posts and create presentation html for each one
          $this.posts.push(e)
          if (i < postCount) {
          var src = e.node.thumbnail_resources[0].src;
          var likes = e.node.edge_liked_by.count;
          var caption = e.node.edge_media_to_caption.edges[0];
          if(caption == undefined) {
            caption = "";
          } else {
            caption = caption.node.text;
          }
          caption = caption.replace(/(\r\n\t|\n|\r\t)/gm,"");
          caption = caption.replace(/'/g, "&apos;");
          caption = caption.replace(/"/g, "&quot;");
          var cutoffcaption = caption;
          var rank = Math.random()*20-10;

          var clarifai_ranks = ['have', 'passage', 'structure', 'apple', 'unlikely', 'patient', 'spray', 'comedy', 'grain', 'cousin'];
          var hashtag_ranks = ['#have', '#passage', '#structure', '#apple', '#unlikely', '#patient', '#spray', '#comedy', '#grain', '#cousin'];

          var success = "success";
          if(rank < 0) {
            success = "poor";
          }

          tempRank = rank;
          if(Math.abs(rank) < 3) {
            tempRank = 3;
            if(rank < 0) {
              tempRank*=-1;
            }
          }

          if(caption.length > 400) {
            cutoffcaption = caption.substr(0, 400) + "...";
          }
          var comments = e.node.edge_media_to_comment.count;
          // var date = e.node.taken_at_timestamp;
          el.append("<div class='col-md-3 ig-img-wrap ig-post-outer'\
                      onclick=\"showMoreInfo('"+e.node.thumbnail_resources[4].src+"', '"+comments+"', '"+cutoffcaption+"', '"+likes+"', '"+rank+"', '"+clarifai_ranks+"', '"+hashtag_ranks+"');\">\
                      <img alt='Instagram Photo " + (i + 1) + "' class='img-responsive ig-img ig-img-" + (i + 1) + "' src='" + e.node.thumbnail_src + "'>\
                      <h2>"+likes+" likes | "+comments+" comments</h2>\
                      <div class='ranking-outer'>\
                      <div class='bar-outer'>\
                        <div class='bar "+success+" inactive' style='transform: scaleX("+((tempRank)/10).toPrecision(2)+");'><p style='transform: scaleX("+1/(((tempRank)/10).toPrecision(2))+");'>"+rank.toPrecision(2)+"</p></div>\
                      </div>\
                      </div>\
                      <p>"+cutoffcaption+"</p>\
                      </div>");
          }
          $(".inactive").removeClass("inactive");
        })
      });
      return $this.posts
    }
    getPosts(settings.user, settings.posts, settings.perRow, t);
    return t;
  }
}(jQuery));

var startLoading = function() {
  $(".initial-stats, #instafeed").addClass("loading");
  $("#loading").removeClass("loading");
}
var finishLoading = function() {
  $(".initial-stats, #instafeed").removeClass("loading");
  $("#loading").addClass("loading");
}

$(document).ready(function() {
  for(var i = 0; i < 15; i++) {
    $(".cool-divs").append("<div class='cool-div'\
                            style='transform: rotate("+Math.random()*360+"deg) scaleX(1);\
                                  animation-delay: "+Math.random()*2+"s;\
                                  top: "+Math.random()*70+"%;\
                                  left: "+Math.random()*100+"%;\
                                  height: "+(Math.random()*150+100)+"px;\
                                  width: "+(Math.random()*500+100)+"px'></div>");
  }

  $(".inactive").removeClass("inactive");

  // $('#instafeed').igjs({
  //     user: 'noahfiner'
  // });

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
    startLoading();
    $("#instafeed").html("");
    username = $("input[name='account']").val();
    if(username[0] == "@") {
      username = username.substr(1);
    }
    $('#instafeed').igjs({
        user: username
    });
    setTimeout(function() {
      finishLoading();
    }, 2000);
  })

  function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
  }

  var updateData = function(data) {
    data = {
         'clarifai': ['ignorance', 'welfare', 'hear', 'negligence', 'art', 'factor', 'sister', 'conflict', 'ray', 'corpse', 'crowd', 'entertainment', 'litigation', 'pile', 'wound', 'session', 'witch', 'curriculum', 'disappear', 'invite', 'motorcycle', 'century', 'willpower', 'squash', 'consensus', 'deny', 'discover', 'earthwax', 'cow', 'kick', 'flat', 'pavement', 'bell', 'taste', 'rise', 'hardware', 'disposition', 'salesperson', 'make'],
         'tags': ['#fisherman', '#knock', '#emergency', '#systematic', '#comment', '#fear', '#steel', '#tract', '#soul', '#elaborate', '#margin', '#culture', '#continuation', '#turn', '#warrant', '#climate', '#agenda', '#stamp', '#shake', '#ring', '#freedom', '#tissue', '#suburb', '#dirty', '#habit', '#hypnothize', '#violation', '#twitch', '#noble', '#wheel', '#yard', '#basic', '#stride', '#sunshine', '#paint', '#respect', '#bland', '#linear', '#guard', '#unique']
      }

    for(var i = 0; i < 10; i++) {
      var weight = 10-i;
      $(".clarifai-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/10)+");\
                  color: "+shadeColor2("#59C3C3", -((weight-10)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+5+"%;'>\
                  "+data.clarifai[i]+"</p>");
    }
    var clarifaiSize = data.clarifai.length;
    for(var i = 0; i < 10; i++) {
      var weight = 10-i;
      $(".clarifai-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/10)+");\
                  color: "+shadeColor2("#F45B69", ((10-weight)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+55+"%;'>\
                  "+data.clarifai[clarifaiSize - i - 1]+"</p>");
    }


    for(var i = 0; i < 10; i++) {
      var weight = 10-i;
      $(".tags-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/10)+");\
                  color: "+shadeColor2("#59C3C3", -((weight-10)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+5+"%;'>\
                  "+data.tags[i]+"</p>");
    }
    var tagsSize = data.tags.length;
    for(var i = 0; i < 10; i++) {
      var weight = 10-i;
      $(".tags-canvas").append("<p class='data' style='\
                  transform: scale("+(1+Math.abs(weight)/10)+");\
                  color: "+shadeColor2("#F45B69", ((10-weight)/15))+";\
                  top: "+(90-Math.pow(weight, 1.2)*5.5)+"%;\
                  left: "+55+"%;'>\
                  "+data.tags[tagsSize - i - 1]+"</p>");
    }
  }

  var addData = function(text, weight, selector) {

  }

  updateData();

  $("#post-display-outer, #post-close").click(function() {
    $("#post-display-outer").addClass("invisible");
  });

  $('#post-outer:not(#post-close)').click(function(event){
    event.stopPropagation();
  });

  //client ID: 57f248212b774817a5fc69380cc19db2
  //client secret: 64f78eae0ca44734be6bb1f8d69e6f9f


  // var data = [
  //     {name: "Nine Inch Nails", color: 0xff2c55},
  //     {name: "Smashing Pumpkins", color: 0xff2c55},
  //     {name: "Weezer", color: 0xff2c55},
  //     {name: "Pearl Jam", color: 0xff2c55},
  //     {name: "American Analog Set", color: 0xff2c55},
  //     {name: "Sigur Ros", color: 0xff2c55},
  //     {name: "Radiohead", color: 0xff2c55},
  //     {name: "Do Make Say Think", color: 0xff2c55},
  //     {name: "Godspeed You Black Emperor!", color: 0xff2c55}
  // ]
  //
  // var zoom = 100;
  // var balls = [];
  //
  // var renderer = PIXI.autoDetectRenderer(window.innerWidth, window.innerHeight, {
  //     transparent: true, antialias: true
  // });
  // $(".clarifai-canvas")[0].appendChild(renderer.view);
  //
  //
  // var world = new p2.World({gravity: [0, 0]});
  // var stage = new PIXI.Container();
  // stage.position.x =  renderer.width/2; // center at origin
  // stage.position.y =  renderer.height/2;
  // stage.scale.x =  zoom;  // zoom in
  // stage.scale.y = -zoom; // Note: we flip the y axis to make "up" the physics "up"
  //
  //
  // //floor
  // planeShape = new p2.Plane();
  // planeBody = new p2.Body({ position:[0,-1] });
  // planeBody.addShape(planeShape);
  // world.addBody(planeBody);
  //

  // var Ball = function (t, c, r, x) {
  //
  //     this.init = function () {
  //         this.el = new PIXI.Container();
  //         this.baseRadius = this.radius = r;
  //
  //         this.circle = new PIXI.Graphics();
  //         this.circle.beginFill(c);
  //         this.circle.drawCircle(0, 0, 0.99);
  //         this.circle.endFill();
  //         this.circle.interactive = true;
  //         this.circle.hitArea = new PIXI.Circle(0, 0, 1);
  //         this.circle.scale.x = this.circle.scale.y = this.radius;
  //         this.el.addChild(this.circle);
  //
  //         stage.addChild(this.el);
  //
  //         let text = new PIXI.Text(t, {
  //             fontFamily : 'Arial',
  //             fontSize: 14,
  //             fill : 0xffffff,
  //             align : 'center',
  //             wordWrap: true
  //         });
  //         text.anchor.x = 0.5;
  //         text.anchor.y = 0.5;
  //         text.position.x = 0;
  //         text.scale.x = 0.01;
  //         text.scale.y = -0.01;
  //         this.el.addChild(text);
  //
  //         this.shape = new p2.Circle({radius: this.radius});
  //
  //         let startX = x % 2 === 0 ? 2 + r : -2 - r;
  //         let startY = r - Math.random() * (r * 2);
  //         this.body = new p2.Body({
  //             mass: 0.001,
  //             position: [startX, startY],
  //             angularVelocity: 0,
  //             fixedRotation: true
  //         });
  //         this.body.addShape(this.shape);
  //         world.addBody(this.body);
  //     }
  //
  //     this.update = function () {
  //         this.body.applyForce([-this.body.position[0] / 100, -this.body.position[1] / 100]);
  //
  //         this.el.position.x = this.body.position[0];
  //         this.el.position.y = this.body.position[1];
  //         this.el.rotation = this.body.angle;
  //     }
  //
  //     this.mouseover = function () {
  //
  //     }
  //
  //     this.mouseout = function () {
  //
  //     }
  //
  //     this.click = function () {
  //         this.radius = this.baseRadius + 0.2;
  //
  //         TweenMax.to(this.circle.scale, 0.2, {
  //             x: this.radius,
  //             y: this.radius,
  //             onUpdate: this.updateRadius.bind(this),
  //             onComplete: this.updateRadius.bind(this)
  //         });
  //     }
  //
  //     this.updateRadius = function () {
  //         this.shape.radius = this.circle.scale.x;
  //         this.body.updateBoundingRadius();
  //     }
  //
  //     this.init.call(this);
  //     this.circle.mouseover = this.mouseover.bind(this);
  //     this.circle.mouseout = this.mouseout.bind(this);
  //     this.circle.click = this.click.bind(this);
  // }
  //
  //
  // for (var i = 0; i < data.length; i ++) {
  //     var ball = new Ball(data[i].name, data[i].color, 0.5, i);
  //     this.balls.push(ball);
  // }
  //
  // function animate() {
  //
  //     world.step(1/60);
  //
  //     for (var i = 0; i < this.balls.length; i ++) {
  //         balls[i].update();
  //     }
  //
  //     renderer.render(stage);
  //
  //     requestAnimationFrame(animate);
  // }
  //
  // animate();
});

var showMoreInfo = function(src, comments, caption, likes, rank, clarifai_ranks, hashtag_ranks) {
  $("#post-img").attr("src", src);
  $("#post-comments").html(comments);
  $("#post-caption").html(caption.substr(0, 150)+"...");
  $("#post-likes").html(likes);

  var cutoff = 2;
  if(window.innerWidth < 991) {
    cutoff = 3.5;
  }

  tempRank = rank;
  if(Math.abs(rank) < cutoff) {
    tempRank = cutoff;
    if(rank < 0) {
      tempRank *= -1;
    }
  }

  $("#analysis-info > .ranking-outer > .bar-outer > .bar").css("transform", "scaleX("+((tempRank)/10).toPrecision(2)+")");
  $("#analysis-info > .ranking-outer > .bar-outer > .bar > p").css("transform", "scaleX("+1/((tempRank)/10).toPrecision(2)+")");
  $("#analysis-info > .ranking-outer > .bar-outer > .bar > p").html(parseFloat(rank).toPrecision(2));

  if(rank < 0) {
    $("#analysis-info > .ranking-outer > .bar-outer > .bar, #analysis-info > .ranking-outer > h5").removeClass("success").addClass("poor");
    $("#analysis-info").removeClass("success").addClass("poor");
    clarifai_ranks = clarifai_ranks.split(",").reverse().slice(0, 5);
    hashtag_ranks = hashtag_ranks.split(",").reverse().slice(0, 5);
    console.log(clarifai_ranks);
    $("#post-success").html(clarifai_ranks.join(", "));
    $("#hash-success").html(hashtag_ranks.join(", "));
  } else {
    $("#analysis-info > .ranking-outer > .bar-outer > .bar, #analysis-info > .ranking-outer > h5").addClass("success").removeClass("poor");
    $("#analysis-info").addClass("success").removeClass("poor");
    clarifai_ranks = clarifai_ranks.split(",").slice(0, 5);
    hashtag_ranks = hashtag_ranks.split(",").slice(0, 5);
    $("#post-success").html(clarifai_ranks.join(", "));
    $("#hash-success").html(hashtag_ranks.join(", "));
  }

  $("#post-display-outer").removeClass("invisible");
}
