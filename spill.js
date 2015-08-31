 var brett = { width:450, height:300 };
    var b;
    // ikke bra å definere variable utenfor functions
  
    function startSpill() {
      /*
        Plasserer ballen i start-posisjon 
      */
      var brett = document.getElementById("brett");
      b = document.createElement('div');
      b.className = "ball";
      b.id = "ball";
      brett.appendChild(b); 
      //b = document.getElementById("ball");
      b.xfart = 3;
      b.yfart = 5;
      b.xpos = 120;
      b.ypos = 100;
      b.style.top = b.ypos + "px";
      b.style.left = b.xpos +"px";
      setInterval(animerBall,50);
    }
    
    
    function animerBall() {
      /*
       For hver frame skal ballen flyttes
      */
      var goodPos = true;
      if (b.ypos + b.yfart > brett.height - 16 ) {
          b.yfart = -5;
          goodPos = false;
      }
      if (b.ypos + b.yfart < 0) {
          b.yfart = 5;
          goodPos = false;
      }
      if (b.xpos + b.xfart > brett.width - 16 ) {
          b.xfart = -3;
          goodPos = false;
      }
      if (b.xpos + b.xfart < 0) {
          b.xfart = 3;
          goodPos = false;
      }
      if (goodPos) {    
        b.xpos = b.xpos + b.xfart;
        b.ypos = b.ypos + b.yfart;  
        b.style.top = b.ypos + "px";
        b.style.left = b.xpos + "px";
      }
    }
