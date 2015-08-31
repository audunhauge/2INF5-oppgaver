    var brett = { width:450, height:300 };
    var b;   // ballen
    var bat; // den som sl�r ballen
    var mou = {x:0, y:0};  // mouse position
    // ikke bra � definere variable utenfor functions

    document.onmousemove = function(e) {
      /*
        f�r tak i mouse position og lagrer i m
        dersom bat finnes da plasseres den
        etter m.x 
      */
      mou.x = e.pageX;
      mou.y = e.pageY;
      if (bat.xpos != undefined) {
        bat.xpos = Math.max(0,Math.min(400,mou.x-34));
        bat.style.left = bat.xpos + "px";
      }
    }


    function startSpill() {
      /*
        Plasserer ballen i start-posisjon 
      */
      var brett = document.getElementById("brett");
      b = document.createElement('div');
      b.className = "ball";
      b.id = "ball";
      brett.appendChild(b); 
      b.xfart = 3;
      b.yfart = 5;
      b.xpos = 120;
      b.ypos = 100;
      b.style.top = b.ypos + "px";
      b.style.left = b.xpos +"px";
      bat = document.createElement('div');
      bat.className = "batty";
      bat.id = "bat";
      brett.appendChild(bat); 
      bat.xpos = 250;
      bat.ypos = 280;
      bat.style.top = bat.ypos + "px";
      bat.style.left = bat.xpos +"px";
    
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
