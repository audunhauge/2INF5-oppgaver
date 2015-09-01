    var brett = { width:450, height:300 };
    var b;   // ballen
    var bat; // den som slår ballen
    var mou = {x:0, y:0};  // mouse position
    // ikke bra å definere variable utenfor functions

    document.onmousemove = function(e) {
      /*
        får tak i mouse position og lagrer i m
        dersom bat finnes da plasseres den
        etter m.x 
      */
      mou.x = e.pageX;
      mou.y = e.pageY;
      if (bat.xpos != undefined) {
        var oldpos = bat.xpos;
        bat.xpos = Math.max(0,Math.min(400,mou.x-34));
        bat.xfart = (bat.xfart + bat.xpos - oldpos)/2;
        // dette er beregna xfart ut fra endring i posisjon
        // gjennomsnitt av siste endring og denne
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
      b.width = 16;
      b.height = 16;
      b.belowbat = false;  
        // true dersom bunn av ball
        // kommer under top av bat
      b.style.top = b.ypos + "px";
      b.style.left = b.xpos +"px";

      bat = document.createElement('div');
      bat.className = "batty";
      bat.id = "bat";
      brett.appendChild(bat); 
      bat.xpos = 250;
      bat.ypos = 280;
      bat.width = 50;
      bat.height = 16;
      bat.xfart = 0;   // beregnes ut fra siste endring
      bat.style.top = bat.ypos + "px";
      bat.style.left = bat.xpos +"px";
    
      setInterval(animerBall,50);
    }
    
    
    function animerBall() {
      /*
       For hver frame skal ballen flyttes
      */

      var goodPos = true;  // anta at vi er ok

      // sjekk om vi treffer bunn eller bat
      if (b.ypos + b.height > bat.ypos) {
         if (collision(b,bat)) {
            // ballen traff bat - vi snur y-farten
            b.yfart = - Math.abs(b.yfart);
            if (b.belowbat) {
              // vi traff fra en av sidene
              b.xfart = -b.xfart;
              b.belowbat = false;
            }
            // juster ballfarten med 20% av bat sin fart
            b.xfart += bat.xfart * 0.5;
            b.ypos = bat.ypos-b.height;
            // plasserer ballen paa bat
            b.style.top = b.ypos + "px";
            goodPos = false;
         } else if (b.ypos + b.yfart + b.height > brett.height) {
            // ballen vil komme nedenfor bunn av brett
            b.style.background = wildColor();
            b.xpos = 100 + Math.random()*30;
            b.ypos = 40;
            b.yfart = Math.random()*5+2;
            b.belowbat = false;
         } else {
            b.belowbat = true;
         }
      }

      if (b.ypos + b.yfart < 0) {
          b.yfart = Math.abs(b.yfart);
          goodPos = false;
      }
      if (b.xpos + b.xfart > brett.width - 16 ) {
          b.xfart = -Math.abs(b.xfart);
          goodPos = false;
      }
      if (b.xpos + b.xfart < 0) {
          b.xfart = Math.abs(b.xfart);
          goodPos = false;
      }
      if (goodPos) {    
        b.xpos = b.xpos + b.xfart;
        b.ypos = b.ypos + b.yfart;  
        b.style.top = b.ypos + "px";
        b.style.left = b.xpos + "px";
      }
       
    }

    function randint(m) {
      return Math.round(Math.random()*m+1);
    }

    function wildColor() {
      return "rgb("+randint(255)+","+randint(255)+","+randint(255)+")";
    }

    function collision(a,b) {
      /*
        sjekker om to objekter a og b overlapper
        Begge obj må ha egenskapene width,height,xpos,ypos
        returns true if overlap
      */
      return (    a.xpos >= b.xpos - a.width 
               && a.xpos <= b.xpos + b.width
               && a.ypos >= b.ypos - a.height
               && a.ypos <= b.ypos + b.height);
    }
