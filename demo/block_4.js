(function(){

  var __options = {
    canvas : "#mycanvas",
    width  : 240,
    height : 400,
    wall   : { w : 240 , h : 400 , color_stroke : "transparent" , color_fill : "#382B8C" , size : 20 },
    ball   : { x :  50 , y :  50 , r : 10 , color_stroke : "transparent" , color_fill : "#F2B5A7" , moveX : 4 , moveY : 4},
    bar    : { w :  60 , h :  10 , color_stroke : "transparent" , color_fill : "#958ABF" , moveX : 12 },

    dialog : {
      color_fill   : "white",
      color_stroke : "#382B8C",
      width_stroke : 2,
      text_color   : "#382B8C",
      text_size    : 16,
      text_width   : 0.9,
      text_font    : "sans-serif",
      radius       : 4,
      w            : 0.7,
      h            : 0.3
    },

    $:0
  };

  var MAIN = function(){

    if(!this.check()){
      alert("htmlに指定のcanvasがありません。");
      return;
    }

    this.flg_gamestart = false;

    this.init();
    this.draw(true);
    this.animation_set();
    this.event_set();

    this.dialog();
    this.start_text();
  };

  MAIN.prototype.dialog = function(){
    var w = __options.wall.w * __options.dialog.w,
        h = __options.wall.h * __options.dialog.h,
        x = __options.wall.w / 2 * (1 - __options.dialog.w),
        y = __options.wall.w / 2 * (1 - __options.dialog.h),
        r = __options.dialog.radius;
    h = h > 180 ? h : 180;
    this.ctx.fillStyle   = __options.dialog.color_fill;
    this.ctx.strokeStyle = __options.dialog.color_stroke;
    this.ctx.lineWidth   = __options.dialog.width_stroke * 2;
    this.ctx.beginPath();
    this.ctx.moveTo(x,y + r);
    this.ctx.arc(x+r , y+h-r , r , Math.PI , Math.PI*0.5 , true);
    this.ctx.arc(x+w-r , y+h-r , r , Math.PI*0.5,0 , 1);
    this.ctx.arc(x+w-r , y+r , r , 0 , Math.PI*1.5 , 1);
    this.ctx.arc(x+r , y+r , r , Math.PI*1.5 , Math.PI , 1);   
    this.ctx.closePath();
    this.ctx.stroke();
    this.ctx.fill();
  }
  MAIN.prototype.start_text = function(){
    var w = (__options.wall.w * __options.dialog.w) * __options.dialog.text_width;
    // var w = 300;
    this.ctx.fillStyle = __options.dialog.text_color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    var x = __options.wall.w / 2;
    var y = __options.wall.w / 2 * (1 - __options.dialog.h) + 30;

    this.ctx.font      = w +" " +"30px "+ __options.dialog.text_font;
    this.ctx.fillText("壁打ちブロック" , x, y , w);

    this.ctx.font      = w +" "+ __options.dialog.text_size +"px "+ __options.dialog.text_font;
    this.ctx.fillText("画面をクリックすると" , x, y + 60 , w);
    this.ctx.fillText("ゲームが開始します"   , x, y + 60 + __options.dialog.text_size + 4 , w);
  };

  MAIN.prototype.game_start = function(){
    if(this.flg_gamestart !== true){return;}

  };

  MAIN.prototype.game_over = function(){
    this.flg_gamestart = false;
    this.dialog();
    this.data_reset();

    var w = (__options.wall.w * __options.dialog.w) * __options.dialog.text_width;
    // var w = 300;
    this.ctx.fillStyle = __options.dialog.text_color;
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "top";
    var x = __options.wall.w / 2;
    var y = __options.wall.w / 2 * (1 - __options.dialog.h) + 30;

    this.ctx.font      = w +" " +"30px "+ __options.dialog.text_font;
    this.ctx.fillText("Game over" , x, y , w);

    this.ctx.font      = w +" "+ __options.dialog.text_size +"px "+ __options.dialog.text_font;
    this.ctx.fillText("画面をクリックすると" , x, y + 60 , w);
    this.ctx.fillText("ゲームが再開します"   , x, y + 60 + __options.dialog.text_size + 4 , w);
  };

  MAIN.prototype.data_reset = function(){
    __options = JSON.parse(JSON.stringify(this.default));
  };


  MAIN.prototype.getCanvas = function(){
    if(typeof this.canvas === "undefined"){
      this.canvas = document.querySelector(__options.canvas);
    }
    return this.canvas;
  };

  MAIN.prototype.getContext = function(){
    if(typeof this.ctx === "undefined"){
      var canvas = this.getCanvas();
      if(!canvas){return null;}
      this.ctx = canvas.getContext("2d");
    }
    return this.ctx;
  };

  MAIN.prototype.check = function(){
    var ctx = this.getContext();
    if(ctx){
      return true;
    }
    else{
      return false;
    }
  };

  MAIN.prototype.init = function(){

    __options.wall.w = window.innerWidth  < __options.wall.w ? window.innerWidth  : __options.wall.w;
    __options.wall.h = window.innerHeight < __options.wall.h ? window.innerHeight : __options.wall.h;

    // 画面サイズ調整
    var canvas = this.canvas;
    canvas.setAttribute("width"  , __options.wall.w);
    canvas.setAttribute("height" , __options.wall.h);

    // デフォルト値の保持
    this.default = JSON.parse(JSON.stringify(__options));
  };

  MAIN.prototype.ctx_clear = function(){
    this.ctx.clearRect(0, 0,  this.canvas.width,  this.canvas.height);
  };

  MAIN.prototype.draw = function(flg){
    if(!flg && this.flg_gamestart !== true){return;}
    this.ctx_clear();
    this.draw_wall();
    this.draw_bar();
    this.draw_ball();
  };

  MAIN.prototype.draw_wall = function(){
    var ctx = this.ctx;
    ctx.strokeStyle = __options.wall.color_stroke;
    ctx.strokeWidth = __options.wall.color_stroke === "transparent" ? 0 : 1;
    ctx.fillStyle   = __options.wall.color_fill;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(__options.wall.w , 0);
    ctx.lineTo(__options.wall.w , __options.wall.h);
    ctx.lineTo(__options.wall.w - __options.wall.size , __options.wall.h);
    ctx.lineTo(__options.wall.w - __options.wall.size , __options.wall.size);
    ctx.lineTo(__options.wall.size , __options.wall.size);
    ctx.lineTo(__options.wall.size , __options.wall.h);
    ctx.lineTo(0 , __options.wall.h);
    ctx.lineTo(0 , 0);
    ctx.stroke();
    ctx.fill();
  };

  MAIN.prototype.draw_bar = function(){
    var ctx = this.ctx;
    ctx.strokeStyle = __options.bar.color_stroke;
    ctx.strokeWidth = __options.bar.color_stroke === "transparent" ? 0 : 1;
    ctx.fillStyle   = __options.bar.color_fill;
    __options.bar.x = __options.bar.x ? __options.bar.x : (__options.wall.w - __options.bar.w) / 2;
    __options.bar.y = __options.wall.h - __options.bar.h - 50;
    ctx.fillRect(__options.bar.x , __options.bar.y , __options.bar.w , __options.bar.h);
  };

  MAIN.prototype.draw_ball = function(){
    var ctx = this.ctx;
    ctx.strokeStyle = __options.ball.color_stroke;
    ctx.strokeWidth = __options.ball.color_stroke === "transparent" ? 0 : 1;
    ctx.fillStyle   = __options.ball.color_fill;
    ctx.beginPath();
    __options.ball.x = __options.ball.x || __options.wall.w / 2;
    __options.ball.y = __options.ball.y || __options.wall.h / 2;
    ctx.arc( __options.ball.x , __options.ball.y , __options.ball.r, 0, Math.PI * 2 );
    ctx.fill();
  };

  MAIN.prototype.animation_set = function(){
    if(this.flg_gamestart !== true){return;}

    new LIB().anim((function(e){this.animation(e)}).bind(this));
  };

  MAIN.prototype.animation = function(timestamp){
    if(this.flg_gamestart !== true){return;}
    if (!this.time_start){this.time_start = timestamp;}

    // debug用（play上限秒数）
    // if(timestamp - this.time_start > 30000){return;}

    // keydown-bar-move
    if(this.flg_gamestart === true){
      switch(this.keydown_flg){
        case "right":
          __options.bar.x += __options.bar.moveX;
          this.bar_limit();
          break;
        case "left":
          __options.bar.x -= __options.bar.moveX;
          this.bar_limit();
          break;
      }
    }

    this.ball_move();
    this.draw();
    this.animation_set();
  };

  MAIN.prototype.ball_move = function(){
    if(this.flg_gamestart !== true){return;}
    
    __options.ball.x += __options.ball.moveX;
    __options.ball.y += __options.ball.moveY;
    this.collision();
  };

  // 当たり判定（壁、ラケット）
  MAIN.prototype.collision = function(){

    // 壁判定 --

    // <- : left
    if(__options.ball.x - __options.ball.r < __options.wall.size){//console.log("left");
      __options.ball.x = __options.wall.size + __options.ball.r;
      __options.ball.moveX = __options.ball.moveX * -1;
    }
    // ^ : top
    if(__options.ball.y - __options.ball.r < __options.wall.size){//console.log("top");
      __options.ball.y = __options.wall.size + __options.ball.r;
      __options.ball.moveY = __options.ball.moveY * -1;
    }
    // -> : right
    if(__options.ball.x + __options.ball.r > __options.wall.w - __options.wall.size){//console.log("right");
      __options.ball.x = __options.wall.w - __options.wall.size - __options.ball.r;
      __options.ball.moveX = __options.ball.moveX * -1;
    }

    // v : bottom (game-over)
    if(__options.ball.y + __options.ball.r > __options.wall.h){//console.log("bottom");
      // __options.ball.y = __options.wall.h - __options.ball.r;
      // __options.ball.moveY = __options.ball.moveY * -1;
      this.game_over();
    }


    // ラケット判定 --

    // ball-direct-under
    if(__options.ball.moveY > 0
    && __options.ball.y + __options.ball.r > __options.bar.y
    && __options.ball.y + __options.ball.r < __options.bar.y + __options.bar.h
    && __options.bar.x < __options.ball.x
    && __options.bar.x + __options.bar.w > __options.ball.x){//console.log("racket-top");
      __options.ball.moveY = __options.ball.moveY * -1;
    }

    // ball-direct-over
    else if(__options.ball.moveY < 0
         && __options.ball.y - __options.ball.r < __options.bar.y + __options.bar.h
         && __options.ball.y - __options.ball.r > __options.bar.y
         && __options.bar.x < __options.ball.x
         && __options.bar.x + __options.bar.w > __options.ball.x){//console.log("racket-bottom");
      __options.ball.moveY = __options.ball.moveY * -1;
    }

  };


  MAIN.prototype.event_set = function(){
    new LIB().event(window , "click"      , (function(e){this.click(e)}).bind(this));
    new LIB().event(window , "keydown"    , (function(e){this.keydown(e)}).bind(this));
    new LIB().event(window , "keyup"      , (function(e){this.keyup(e)}).bind(this));
    new LIB().event(window , "mousemove"  , (function(e){this.mousemove(e)}).bind(this));
    new LIB().event(window , "touchmove"  , (function(e){this.touchmove(e)}).bind(this));
    new LIB().event(window , "touchend"   , (function(e){this.touchend(e)}).bind(this));
  };

  MAIN.prototype.click = function(e){
    if(this.flg_gamestart === false){
      this.flg_gamestart = true;
      this.animation_set();
    }
  };

  MAIN.prototype.bar_limit = function(){
    if(__options.bar.x < __options.wall.size){
      __options.bar.x = __options.wall.size;
    }
    if(__options.bar.x + __options.bar.w > __options.wall.w - __options.wall.size){
      __options.bar.x = __options.wall.w - __options.wall.size - __options.bar.w;
    }
  };

  MAIN.prototype.keydown = function(e){
    switch(e.keyCode){
      case 37:  // <-
      case 'ArrowLeft':
      this.keydown_flg = "left";
      break;

      case 39:  // ->
      case 'ArrowRight':
      this.keydown_flg = "right";
      break;
    }
  };
  MAIN.prototype.keyup = function(e){
    this.keydown_flg = false;
  };


  MAIN.prototype.mousemove = function(e){
    if(this.flg_gamestart !== true){return;}

    this.mousePos = this.mousePos || e.clientX;
    __options.bar.x += e.clientX - this.mousePos;
    this.mousePos = e.clientX;
    this.bar_limit();
    this.draw();
  };

  MAIN.prototype.touchmove = function(e){
    if(this.flg_gamestart !== true){return;}

    if(!e || !e.touches || e.touches.length > 1){
      this.mousePos = null;
      return;
    }
    this.mousePos = typeof this.mousePos === "number" ? this.mousePos : e.touches[0].clientX;
    __options.bar.x += e.touches[0].clientX - this.mousePos;
    this.mousePos = e.touches[0].clientX;
    this.bar_limit();
    this.draw();
  };
  MAIN.prototype.touchend = function(e){
    this.mousePos = null;
  };





  var LIB  = function(){};

  LIB.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
    if (target.addEventListener){target.addEventListener(mode, func, flg)}
    else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
  };

  LIB.prototype.anim = function(func , time){
    if(window.requestAnimationFrame
    ||  window.webkitRequestAnimationFrame
    ||  window.mozRequestAnimationFrame
    ||  window.oRequestAnimationFrame
    ||  window.msRequestAnimationFrame){
      window.requestAnimationFrame(func);
    }
    else{
      time = time || 0;
      anim_flg = setTimeout(func , time);
    }
  };


  LIB.prototype.construct = function(){
    switch(document.readyState){
      case "complete"    : new MAIN();break;
      case "interactive" : this.event(window , "DOMContentLoaded" , (function(){new MAIN()}).bind(this));break;
      default            : this.event(window , "load"             , (function(){new MAIN()}).bind(this));break;
    }
  };

  new LIB().construct();
})();
