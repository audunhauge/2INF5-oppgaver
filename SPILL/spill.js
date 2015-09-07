    /*
     *  Spillet er basert på breakout
     *
    */

    var brett = { width:450, height:300 };
       // dimensjonene på brettet
    var b;                 // ballen
    var bat;               // den som slår ballen
    var mou = {x:0, y:0};  // mouse position
    var soundeffect;       // lyder brukt i spillet
    var timer;             // slik at vi kan slå den av/på
    var playing = false;   // settes true når spillet er i gang
    
    /**
      * Fanger opp musbevegelser
      * får tak i mouse position og lagrer i m
      * dersom bat finnes da plasseres den
      * etter m.x
      * @param  {Object} e mouseevent
     */
    document.onmousemove = function(e) {
      mou.x = e.pageX;
      mou.y = e.pageY;
      if (bat != undefined) {
        var oldpos = bat.xpos;
        bat.xpos = Math.max(0,Math.min(400,mou.x-64));
        bat.xfart = (bat.xfart + bat.xpos - oldpos)/2;
        // dette er beregna xfart ut fra endring i posisjon
        // gjennomsnitt av siste endring og denne
        bat.style.left = bat.xpos + "px";
      }
    }

    /**
     *   lag intro animasjonen
     *   når den er ferdig da startes spillet
     */
    function startSpill() {
      var animasjon = new TimelineMax();

      soundeffect = new Howl({
          urls: ['sounds.mp3'],
          sprite: { bounce: [0, 500], miss: [500, 400], car:[1000,8000]
          }
      });

      animasjon.from("#bil", 9, 
        { left:400,
          width:30,
          height:30,
          rotation:5
        }   // start spillet når intro ferdig
      ).to("#box1",2,{rotation:45,x:180,y:150},"-=3")
       .to("#box2",3,{rotation:15},"-=4")
       .to("#box3",3,{rotation:10},"-=4")
       .to("#box2",1.5,{rotation:15,x:80,y:150},"-=2.5")
       .to("#box3",1,{x:30,y:150},"-=1.5")
       .from("#logo",5,{opacity:0,onComplete:startGame},"-=3"); 

      animasjon.play();

      soundeffect.play("car");

    }

    /**
     *  dytt introen utforbi skjermen
     *  <br>legg spillebrettet på riktig plass
     *  <br>lag en div for ball
     *  <br>lag en div for bat
     *  <br>plasser spill-objekter p? brett
     *  <br>start timeren
     *  <br>last inn fil med lyd-effekter
     */
    function startGame() {
      var brett = document.getElementById("brett");
      var intro = document.getElementById("intro");
      brett.style.left = "30px";
      intro.style.left = "-530px";
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

      timer = setInterval(animerBall,50);
      playing = true;


      Mousetrap.bind('p', function() {
           if (playing && timer) {
              clearInterval(timer);
              playing = false;
           } else {
              timer = setInterval(animerBall,50);
              playing = true;
           }
        }, 'keyup');
    }

    /**
      * For hver frame skal ballen flyttes
      * sjekk kollisjon mot kanter
      * sjekk om ball treffer bat
      */
    function animerBall() {
      var goodPos = true;  // anta at vi er ok

      // sjekk om vi treffer bunn eller bat
      if (b.ypos + b.height > bat.ypos) {
         if (collision(b,bat)) {
            // ballen traff bat - vi snur y-farten
            b.yfart = - Math.abs(b.yfart);
            soundeffect.play("bounce");
            if (b.belowbat) {
              // vi traff fra en av sidene
              b.xfart = -b.xfart;
              b.belowbat = false;
            }
            // juster ballfarten med 50% av bat sin fart
            b.xfart += bat.xfart * 0.5;
            b.ypos = bat.ypos-b.height;
            // plasserer ballen paa bat
            b.style.top = b.ypos + "px";
            goodPos = false;
         } else if (b.ypos + b.yfart + b.height > brett.height) {
            // ballen vil komme nedenfor bunn av brett
            soundeffect.play("miss");
            b.style.background = wildColor();
            b.xpos = 100 + Math.random()*30;
            b.ypos = 40;
            b.yfart = Math.random()*5+2;
            b.xfart = Math.random()*4+2;
            b.belowbat = false;
         } else {
            // naar vi kommer hit er bunn av ballen
            // under top av bat, men over bunn av brett
            // sjekk om vi kolliderer neste gang.
            // dersom vi gjør det - da har vi truffet
            // ballen med siden av bat
            b.belowbat = true;
         }
      }

      if (b.ypos + b.yfart < 0) {
          b.yfart = Math.abs(b.yfart);
          soundeffect.play("bounce");
          goodPos = false;
      }
      if (b.xpos + b.xfart > brett.width - 16 ) {
          b.xfart = -Math.abs(b.xfart);
          soundeffect.play("bounce");
          goodPos = false;
      }
      if (b.xpos + b.xfart < 0) {
          b.xfart = Math.abs(b.xfart);
          soundeffect.play("bounce");
          goodPos = false;
      }
      if (goodPos) {
        b.xpos = b.xpos + b.xfart;
        b.ypos = b.ypos + b.yfart;
        b.style.top = b.ypos + "px";
        b.style.left = b.xpos + "px";
      }

    }

    /**
     * Generer tilfeldig heltall 1..m
     * @param  {int} m maks verdi
     * @return {int} 1..m
     */
    function randint(m) {      
      return Math.round(Math.random()*m+1);
    }

    /**
     * Generer tilfeldig rgb(0..255,0..255,0..255)
     * @return {String} "rgb(..)"
     */
    function wildColor() {
      var tall = [1,1,1].map(function(e) { return randint(255);}).join(",");
      return "rgb("+tall+")";
    }

    /**
      * sjekker om to objekter a og b overlapper
      * Begge obj må ha egenskapene width,height,xpos,ypos
      * @param {obj} a 
      * @param {obj} b
      * @return {Bool} true if overlap
      */
    function collision(a,b) {
      return (    a.xpos >= b.xpos - a.width
               && a.xpos <= b.xpos + b.width
               && a.ypos >= b.ypos - a.height
               && a.ypos <= b.ypos + b.height);
    }
