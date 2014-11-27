$(document).ready(function() {
  var playing = false;
  var score = 0;
  var nextLevel = 5;
  var level = 1;
  var konami = false;
  var inHand = '';
  var swing = '';
  function spawn() {
    var alives = [];
    $('.alive').each(function() {
      alives.push($(this));
    });
    //spawn orc in random location if playing == true
    if (playing && alives.length < level)  {
      var randomCell = Math.floor(Math.random()*64);
      $('.cell').eq(randomCell).addClass('alive');
    }
  }//end spawn function
  function play() {
    //timer is for clearInterval/setTimeout function that checks if the mouse has stopped moving
    var timer; 
    //this moves the player-img to the play button in a mock snap to the cursor (should be changed to actually go to the cursor)
    $('.player-img').css('background-image', 'url(img/player.gif)').animate({
      'top': '35px',
      'left': '70%'},
      300, function() {
      playing = true;
      //spawn one, set interval to spawn more repeatedly
      var randomCell = Math.floor(Math.random()*64);
      $('.cell').eq(randomCell).addClass('alive');
      setInterval(spawn, 1000);
    });
    //hide the menu and the sword or whatever is in the players hand before the game starts
    $('.menu, .in-hand').hide();
    //show the score card (orc heads), the quit button, the level, the score, sets variable for cursor image
    $('.quit, .score-card').show();
    $('.level').text('Level ' + level).show();
    $('.score').text('Orcs Killed: 0 / ' + nextLevel).show();
    $('.player-img').show();
    if (konami) {
      inHand = 'url(img/leaf.png), auto';
      swing = 'url(img/smoke.png), auto';
      $('html').css('background-color', 'green');
    } else {
      inHand = 'url(img/sword.cur), auto';
      swing = 'url(img/sword-swing.cur), auto';
    }
    $('html').css('cursor', inHand);


    $(document).on('mousemove', function(event){
      if (playing) {
        //fix positioning issue while playing
        $('.board-wrap').css('position', 'static');
        //move .player-img to cursor, change background image to animated iamge
        $('.player-img').css({
          left:  event.pageX +17,
          top:   event.pageY +5,
          'background-image': 'url(img/player.gif)' 
        });
        //change .player-img background image to unanimated image when the cursor stops moving
        //not really sure how this works
        clearInterval(timer); 
        timer = setTimeout(function() {
          if (playing) {
            $('.player-img').css({
              'background-image': 'url(img/player.png)' 
            });
          }
         }, 75);
      }
    }); // end document.on 'mousemove' for player image movement

    $('html').on('click', function(event) {
      event.preventDefault();
      if (playing) {
        //change cursor to sword-swing.png, then change it back
        $('html').css('cursor', swing);
        setTimeout(function() { 
          $('html').css('cursor', inHand)}, 200);
      }
    });// end html.on 'click' for sword swing action

    $('.cell').on('click', function(event){
      var clicked = $(this);
      event.preventDefault();
      if (clicked.hasClass('alive')) {
        clicked.removeClass('alive');
        clicked.addClass('dead');  
        //for some reason this animation sequence looks better when each step is written out instead of being looped through. this is the dead orc bleeding
        var timeout = 200;
        var gradientSpread = 57;
        clicked.css('background-image', 'url(img/dead-orc.png), radial-gradient(circle farthest-corner at center, #C40707 0%, rgba(35, 55, 6, 0.0) ' + gradientSpread + '%)');
        setTimeout(function() { 
          clicked.css('background-image', 'url(img/dead-orc.png), radial-gradient(circle farthest-corner at center, #C40707 0%, rgba(35, 55, 6, 0.0) ' + (gradientSpread + 5) + '%)');
        }, timeout);
        setTimeout(function() { 
          clicked.css('background-image', 'url(img/dead-orc.png), radial-gradient(circle farthest-corner at center, #C40707 0%, rgba(35, 55, 6, 0.0) ' + (gradientSpread + 10) + '%)');
        }, timeout * 2);
        setTimeout(function() { 
          clicked.css('background-image', 'url(img/dead-orc.png), radial-gradient(circle farthest-corner at center, #C40707 0%, rgba(35, 55, 6, 0.0) ' + (gradientSpread + 15) + '%)');
        }, timeout * 3);
        setTimeout(function() { 
          clicked.css('background-image', 'url(img/dead-orc.png), radial-gradient(circle farthest-corner at center, #C40707 0%, rgba(35, 55, 6, 0.0) ' + (gradientSpread + 20) + '%)');
        }, timeout * 4);
        setTimeout(function() { 
          clicked.css('background-image', 'url(img/dead-orc.png), radial-gradient(circle farthest-corner at center, #C40707 0%, rgba(35, 55, 6, 0.0) ' + (gradientSpread + 25) + '%)');
        }, timeout * 5);

        setTimeout(function() { 
          clicked.fadeOut('400', function() {
            clicked.css('background-image', '');
            clicked.removeClass('dead');
            clicked.show();
          });
        }, 2000);
        //score should be it's own function
        score++;
        if (score == nextLevel) {
          level++
          nextLevel += level * 5;
          score = 0;
          $('.level').text('Level ' + level);
          $('.score').text('Orcs Killed: ' + score + ' / ' + nextLevel);
          $('.score-card').html('');
        } else {
          $('.score').text('Orcs Killed: ' + score + ' / ' + nextLevel);
          $('.score-card').append('<img src="img/orc-face.gif" class="orc-face">')
          //make room for more orc-faces
          if (score > 50 && score < 161) {
            $('.orc-face').css({
              'margin-top': '-10px',
              'margin-left': '-13px'
            });
            $('.score-card').css({
              'padding-top': '15px',
              'padding-left': '23px'
            });
          } else if (score > 160) {
            $('.orc-face').css({
              'margin-top': '-12px',
              'margin-left': '-20px'
            });
            $('.score-card').css({
              'padding-top': '20px',
              'padding-left': '24.4px'
            });
          } else {
            $('.score-card').css('padding', '0');
          } 
        }  
      }//end if (alive)
    });//end .cell.on 'click' for killing action
  }//end play function
  function quit() {
    playing = false;
    score = 0;
    nextLevel = 0;
    level = 1;
    $('.quit, .score-card, .score, .level').fadeOut(2000);
    $('.player-img').css('background-image', 'url(img/player.gif)').animate({
      'top': '26px',
      'left': '40%'
    }, 2000, function() {
      //fix starting position for player img
      $('.board-wrap').css('position', 'relative');
      $('.player-img').css({
        'top': '-49px'
        }).animate({'left': '34%'}, 1000, function() {
            $('.player-img').css('background-image', 'url(img/player.png)');
          });
    }); 
    setTimeout(function() { 
      $('.score, .level, .score-card').html('');
      $('.in-hand').fadeIn();
      //set cursor back to default
      inHand = 'default';
      $('html').css('cursor', inHand);
      $('.alive').removeClass('alive');
    }, 2000);
    setTimeout(function(){
      $('.menu').fadeIn();
    }, 2400);
  }//end quit function
  $('.start').on('click', function() {
    play();
  });
  $('.quit').on('click', function() {
    quit();
  });
  var easter_egg = new Konami(function() { 
    konami = true;
    quit();
    setTimeout(function() { 
      play();
    }, 3000);
    $('.konami').fadeIn('fast').animate({
                  left: '100%',
                }, 3000 )
                .fadeOut('fast');
  });
}); //end ready
