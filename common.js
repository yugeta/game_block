(function(){

  var __options = {
    canvas : "#mycanvas",
    width  : 400,
    height : 600,
    wall   : { w : 400 , h : 600 , color_stroke : "transparent" , color_fill : "#382B8C" , size : 20 },
    ball   : { r : 10 , color_stroke : "transparent" , color_fill : "#F2B5A7" },
    bar    : { w: 50 , h: 10 , color_stroke : "transparent" , color_fill : "#958ABF" },

    $:0
  };

  var MAIN = function(){

    if(!this.check()){
      alert("htmlに指定のcanvasがありません。");
      return;
    }

    this.init();
    this.draw();
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
    // 画面サイズ調整
    var canvas = this.canvas;
    canvas.setAttribute("width"  , __options.wall.w);
    canvas.setAttribute("height" , __options.wall.h);
  };

  MAIN.prototype.draw = function(){
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
    ctx.fillRect(__options.wall.size + 10 , __options.wall.h - __options.bar.h - 30 , __options.bar.w , __options.bar.h);
  };

  MAIN.prototype.draw_ball = function(){
    var ctx = this.ctx;
    ctx.strokeStyle = __options.ball.color_stroke;
    ctx.strokeWidth = __options.ball.color_stroke === "transparent" ? 0 : 1;
    ctx.fillStyle   = __options.ball.color_fill;
    ctx.beginPath();
    ctx.arc(__options.wall.w / 2, __options.wall.h / 2, __options.ball.r, 0, Math.PI * 2);
    ctx.fill();
  };






  var LIB  = function(){};

  LIB.prototype.event = function(target, mode, func , flg){
    flg = (flg) ? flg : false;
    if (target.addEventListener){target.addEventListener(mode, func, flg)}
    else{target.attachEvent('on' + mode, function(){func.call(target , window.event)})}
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
