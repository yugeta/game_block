(function(){

  var __options = {
    canvas : "#mycanvas",
    width  : 240,
    height : 400,
    wall   : {
      w : 240 , h : 400 , 
      color_stroke : "transparent" , 
      color_fill : "#382B8C" , 
      size : 20
    },
    ball   : {
      x :  50 , y :  50 , r : 6,
      color_stroke : "transparent",
      color_fill : "#F2B5A7" , 
      moveX : 4 , 
      moveY : 4
    },
    bar    : { 
      w :  60 , h :  10 , 
      color_stroke : "transparent" , 
      color_fill : "#958ABF" , 
      moveX : 12 
    },
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
    block : {
      w : 50 , h : 15 ,
      color_stroke : "transform",
      color_fill   : "#958ABF",
      row : 6,
      col : 6,
      gap_x        : 5,
      gap_y        : 10,
      margin_top   : 59,
      margin_left  : 15,
      area_y       : 0.4,
      collision_col : "red"
    }
  };

  var MAIN = function(){

    if(!this.check()){
      alert("htmlに指定のcanvasがありません。");
      return;
    }

    this.init();
    this.draw(true);
    this.animation_set();
    this.event_set();

    this.game_start();
  };

  MAIN.prototype.init = function(){

    this.data_reset();

    // 画面サイズ調整
    var canvas = this.canvas;
    canvas.setAttribute("width"  , this.options.wall.w);
    canvas.setAttribute("height" , this.options.wall.h);

  };

  MAIN.prototype.dialog_window = function(o){
    var w = o.wall.w * o.dialog.w,
        h = o.wall.h * o.dialog.h,
        x = o.wall.w / 2 * (1 - o.dialog.w),
        y = o.wall.w / 2 * (1 - o.dialog.h),
        r = o.dialog.radius;
    h = h > 180 ? h : 180;
    this.ctx.fillStyle   = o.dialog.color_fill;
    this.ctx.strokeStyle = o.dialog.color_stroke;
    this.ctx.lineWidth   = o.dialog.width_stroke * 2;
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
  MAIN.prototype.dialog_text = function(o , texts){
    var w = (o.wall.w * o.dialog.w) * o.dialog.text_width;
    
    
    var x = o.wall.w / 2;
    var y = o.wall.w / 2 * (1 - o.dialog.h) + 30;
    var text_y = y;

    for(var i=0; i<texts.length; i++){
      this.ctx.fillStyle    = texts[i].color    || o.dialog.text_color;
      this.ctx.textAlign    = texts[i].align    || "center";
      this.ctx.textBaseline = texts[i].baseline || "top";
      var font_size         = texts[i].size || o.dialog.text_size;
      var font_weight       = texts[i].weight || "";
      this.ctx.font         = font_weight +" "+ font_size+"px '"+ o.dialog.text_font +"' ";
      this.ctx.fillText(texts[i].text , x, text_y , w);
      text_y += font_size + (texts[i].margin || 10);
    }
  };

  MAIN.prototype.game_start = function(){
    this.dialog_window(this.options);
    this.dialog_text(this.options , [
      {text:"壁打ちブロック" , size:30 , margin:30 , weight:"bold"},
      {text:"画面をクリックすると"},
      {text:"ゲームが開始します"}
    ]);
  };

  MAIN.prototype.game_over = function(){
    this.flg_gamestart = false;
    this.data_reset();
    this.dialog_window(this.options);
    this.dialog_text(this.options , [
      {text:"Game over", size:30 , margin:30 , color:"red" , weight:"bold"},
      {text:"画面をクリックすると"},
      {text:"ゲームが開始します"}
    ]);
  };

  MAIN.prototype.data_reset = function(){
    this.options = JSON.parse(JSON.stringify(__options));
    // 画面サイズ調整
    this.options.wall.w = window.innerWidth  < this.options.wall.w ? window.innerWidth  : this.options.wall.w;
    this.options.wall.h = window.innerHeight < this.options.wall.h ? window.innerHeight : this.options.wall.h;
    
    // blockサイズ調整
    var w = this.options.wall.w - (this.options.wall.size*2) - this.options.block.margin_left;
    this.options.block.col = Math.round(w / (this.options.block.w + (this.options.block.gap_x * 2)));
    this.options.block.margin_left = (w - (this.options.block.col * this.options.block.w) - this.options.block.gap_x) * 0.5;

    this.options.wall.margin_top = (this.options.wall.h - this.options.wall.size) * 0.1;
    var h = (this.options.wall.h - this.options.wall.size - this.options.wall.margin_top) * this.options.block.area_y;
    this.options.block.row = Math.round(h / (this.options.block.h + this.options.block.gap_y));

    // ボール初期値（画面の中心地）
    this.options.ball.x = this.options.wall.w * 0.5;
    this.options.ball.y = this.options.wall.h * 0.5;
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

  MAIN.prototype.ctx_clear = function(){
    this.ctx.clearRect(0, 0,  this.canvas.width,  this.canvas.height);
  };

  MAIN.prototype.draw = function(flg){
    if(!flg && this.flg_gamestart !== true){return;}
    this.ctx_clear();
    this.draw_wall(this.options.wall);
    this.draw_bar( this.options.wall , this.options.bar);
    this.draw_ball(this.options.wall , this.options.ball);
    this.draw_block(this.options.wall , this.options.block);
  };

  MAIN.prototype.draw_wall = function(ow){
    var ctx = this.ctx;
    ctx.strokeStyle = ow.color_stroke;
    ctx.strokeWidth = ow.color_stroke === "transparent" ? 0 : 1;
    ctx.fillStyle   = ow.color_fill;
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(ow.w , 0);
    ctx.lineTo(ow.w , ow.h);
    ctx.lineTo(ow.w - ow.size , ow.h);
    ctx.lineTo(ow.w - ow.size , ow.size);
    ctx.lineTo(ow.size , ow.size);
    ctx.lineTo(ow.size , ow.h);
    ctx.lineTo(0 , ow.h);
    ctx.lineTo(0 , 0);
    ctx.stroke();
    ctx.fill();
  };

  MAIN.prototype.draw_bar = function(ow,ob){
    this.ctx.strokeStyle = ob.color_stroke;
    this.ctx.strokeWidth = ob.color_stroke === "transparent" ? 0 : 1;
    this.ctx.fillStyle   = ob.color_fill;
    ob.x = ob.x ? ob.x : (ow.w - ob.w) / 2;
    ob.y = ow.h - ob.h - 50;
    this.ctx.fillRect(ob.x , ob.y , ob.w , ob.h);
  };

  MAIN.prototype.draw_ball = function(ow,ob){
    this.ctx.strokeStyle = ob.color_stroke;
    this.ctx.strokeWidth = ob.color_stroke === "transparent" ? 0 : 1;
    this.ctx.fillStyle   = ob.color_fill;
    this.ctx.beginPath();
    ob.x = ob.x || ow.w / 2;
    ob.y = ob.y || ow.h / 2;
    this.ctx.arc( ob.x , ob.y , ob.r, 0, Math.PI * 2 );
    this.ctx.fill();
  };

  MAIN.prototype.draw_block = function(wall , block){
    this.ctx.strokeStyle = block.color_stroke;
    this.ctx.strokeWidth = block.color_stroke === "transparent" ? 0 : 1;
    this.ctx.fillStyle   = block.color_fill;
    var buffer = [];
    for(var i=0; i<block.row; i++){
      if(typeof buffer[i] === "undefined"){buffer[i] = [];}
      for(var j=0; j<block.col; j++){

        var x = block.margin_left + wall.size + (block.w * j) + (block.gap_x * j);
        var y = block.margin_top  + wall.size + (block.h * i) + (block.gap_y * i);

        if(typeof block.buffer === "undefined"){
          buffer[i][j] = {x : x , y : y};
          this.ctx.fillRect(x , y , block.w , block.h);
        }
        else if(block.buffer[i][j].collision === true){
          continue;
          // this.ctx.fillStyle   = block.collision_col;
          // this.ctx.fillRect(x , y , block.w , block.h);
          // this.ctx.fillStyle   = block.color_fill;
        }
        else{
          this.ctx.fillRect(x , y , block.w , block.h);
        }
        
        
        
        
        // if(typeof block.buffer === "undefined"){
        //   buffer[i][j] = {x : x , y : y};
        //   this.ctx.fillRect(x , y , block.w , block.h);
        // }
        // else if(typeof block.buffer !== "undefined"
        // && typeof block.buffer[j] !== "undefined"
        // && block.buffer[j][i]){
        //   this.ctx.fillRect(x , y , block.w , block.h);
        // }
      }
    }
    if(typeof block.buffer === "undefined"){
      block.buffer = buffer;
    }
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
    switch(this.keydown_flg){
      case "right":
        this.bar_move(this.options.bar.x + this.options.bar.moveX);
        break;
      case "left":
        this.bar_move(this.options.bar.x - this.options.bar.moveX);
        break;
    }

    this.ball_move();
    this.draw();
    this.animation_set();
  };

  MAIN.prototype.ball_move = function(){
    if(this.flg_gamestart !== true){return;}
    
    this.options.ball.x += this.options.ball.moveX;
    this.options.ball.y += this.options.ball.moveY;
    this.collision_wall(this.options.wall , this.options.ball);
    this.collision_bar(this.options.bar , this.options.ball);
    this.collision_block(this.options.block , this.options.ball);
  };

  // 当たり判定（壁）
  MAIN.prototype.collision_wall = function(ow , ob){
    // <- : left
    if(ob.x - ob.r < ow.size){
      ob.x     = ow.size + ob.r;
      ob.moveX = ob.moveX * -1;
    }
    // ^ : top
    if(ob.y - ob.r < ow.size){
      ob.y     = ow.size + ob.r;
      ob.moveY = ob.moveY * -1;
    }
    // -> : right
    if(ob.x + ob.r > ow.w - ow.size){
      ob.x     = ow.w - ow.size - ob.r;
      ob.moveX = ob.moveX * -1;
    }

    // v : bottom (game-over)
    if(ob.y + ob.r > ow.h){
      this.game_over();
    }
  }

  // 当たり判定（ラケット）
  MAIN.prototype.collision_bar = function(bar , ball){

    // ボールが上移動の場合は処理対象外
    if(ball.moveY < 0){return;}

    // ball-direct-under (正反射)
    if(ball.y + ball.r > bar.y
    && ball.y + ball.r < bar.y + bar.h
    && ball.x > bar.x
    && ball.x < bar.x + bar.w){
      ball.moveY = ball.moveY * -1;
    }

    // 左角判定（ボールと角との距離がボール半径以下の判定）
    else if(Math.sqrt(Math.pow(bar.x - ball.x, 2) + Math.pow(bar.y - ball.y, 2)) <= ball.r){
      if(ball.moveX > 0){
        this.calc_angle(bar , ball);
      }
      else{
        ball.moveY = ball.moveY * -1;
      }
    }

    // 右角判定（ボールと角との距離がボール半径以下の判定）
    else if(Math.sqrt(Math.pow((bar.x + bar.w) - ball.x, 2) + Math.pow(bar.y - ball.y, 2)) <= ball.r){
      if(ball.moveX < 0){
        this.calc_angle(bar , ball);
      }
      else{
        ball.moveY = ball.moveY * -1;
      }
    }
  };
  // 当たり判定（ブロック）
  MAIN.prototype.collision_block = function(block , ball){
    if(typeof block.buffer === "undefined"){return;}
    for(var i=0; i<block.row; i++){
      if(typeof block.buffer[i] === "undefined"){continue;}
      for(var j=0; j<block.col; j++){

        if(!block.buffer
        || typeof block.buffer[i][j] === "undefined"
        || !block.buffer[i][j]
        || block.buffer[i][j].collision === true){continue;}

        // 左右正反射
        if(ball.x + ball.r > block.buffer[i][j].x
        && ball.x - ball.r < block.buffer[i][j].x + block.h
        && ball.y > block.buffer[i][j].y
        && ball.y < block.buffer[i][j].y + block.h){
          block.buffer[i][j].collision = true;
          // ボール座標を調整
          if(ball.moveX < 0){
            ball.x = block.buffer[i][j].x + block.w + ball.r;
          }
          else{
            ball.x = block.buffer[i][j].x - ball.r;
          }
          // 方向転換
          ball.moveX = ball.moveX * -1;
          return;
        }

        // 上下正反射
        if(ball.y + ball.r > block.buffer[i][j].y
        && ball.y - ball.r < block.buffer[i][j].y + block.h
        && ball.x > block.buffer[i][j].x
        && ball.x < block.buffer[i][j].x + block.w){
          block.buffer[i][j].collision = true;
          // ボール座標を調整
          if(ball.moveY < 0){
            ball.y = block.buffer[i][j].y + block.h + ball.r;
          }
          else{
            ball.y = block.buffer[i][j].y - ball.r;
          }
          // 方向転換
          ball.moveY = ball.moveY * -1;
          return;
        }

        // 左上角判定
        else if(Math.pow(block.buffer[i][j].x - ball.x, 2) + Math.pow(block.buffer[i][j].y - ball.y, 2) <= ball.r){
          block.buffer[i][j].collision = true;
          if(ball.moveX > 0 && ball.moveY > 0){
            ball.moveX = ball.moveX * -1;
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX < 0 && ball.moveY > 0){
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX > 0 && ball.moveY < 0){
            ball.moveX = ball.moveX * -1;
          }
          return;
        }
        // 右上角判定
        else if(Math.sqrt(ball.x - block.buffer[i][j].x - block.w, 2) + Math.pow(block.buffer[i][j].y - ball.y, 2) <= ball.r){
          block.buffer[i][j].collision = true;
          if(ball.moveX < 0 && ball.moveY > 0){
            ball.moveX = ball.moveX * -1;
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX > 0 && ball.moveY > 0){
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX < 0 && ball.moveY < 0){
            ball.moveX = ball.moveX * -1;
          }
          return;
        }
        // 左下角判定
        else if(Math.sqrt(block.buffer[i][j].x - ball.x, 2) + Math.pow(ball.y - block.buffer[i][j].y + block.h , 2) <= ball.r){
          block.buffer[i][j].collision = true;
          if(ball.moveX > 0 && ball.moveY < 0){
            ball.moveX = ball.moveX * -1;
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX < 0 && ball.moveY < 0){
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX > 0 && ball.moveY > 0){
            ball.moveX = ball.moveX * -1;
          }
          return;
        }
        // 右下角判定
        else if(Math.sqrt(ball.x - block.buffer[i][j].x - block.w, 2) + Math.pow(ball.y - block.buffer[i][j].y + block.h , 2) <= ball.r){
          block.buffer[i][j].collision = true;
          if(ball.moveX < 0 && ball.moveY < 0){
            ball.moveX = ball.moveX * -1;
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX > 0 && ball.moveY < 0){
            ball.moveY = ball.moveY * -1;
          }
          else if(ball.moveX < 0 && ball.moveY > 0){
            ball.moveX = ball.moveX * -1;
          }
          return;
        }

      }
    }
  }

  MAIN.prototype.calc_angle = function(bar,ball){
    // 反転
    ball.moveX = -ball.moveX;
    ball.moveY = -ball.moveY;
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
    if(this.flg_gamestart === true){return}
    this.flg_gamestart = true;
    this.animation_set();
  };

  MAIN.prototype.bar_move = function(bar_x){
    if(bar_x < this.options.wall.size){
      bar_x = this.options.wall.size;
    }
    if(bar_x + this.options.bar.w > this.options.wall.w - this.options.wall.size){
      bar_x = this.options.wall.w - this.options.wall.size - this.options.bar.w;
    }
    this.options.bar.x = bar_x;
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
    this.bar_move(this.options.bar.x + (e.clientX - this.mousePos));
    this.mousePos = e.clientX;

    this.draw();
  };

  MAIN.prototype.touchmove = function(e){
    if(this.flg_gamestart !== true){return;}

    if(!e || !e.touches || e.touches.length > 1){
      this.mousePos = null;
      return;
    }
    this.mousePos = typeof this.mousePos === "number" ? this.mousePos : e.touches[0].clientX;
    this.bar_move(this.options.bar.x + (e.touches[0].clientX - this.mousePos));
    this.mousePos = e.touches[0].clientX;

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
