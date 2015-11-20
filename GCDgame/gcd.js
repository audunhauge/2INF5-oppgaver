 "use strict";
 const MAXTALL = 20;
 const MINTALL = 1;
 
 var mem = {};   // slik at vi slipper å hente ut verdiene gang på gang
 
 function setup() {
   var lagre = document.querySelector("#beregn");
   lagre.addEventListener("click", beregn);
   mem.lagre = lagre;
   make2numbers();
 }
 
 function make2numbers() {
	 var num1 = Math.floor(Math.random() * MAXTALL + MINTALL);
	 var num2 = Math.floor(Math.random() * MAXTALL + MINTALL);
	 document.querySelector("#num1").value = num1;
	 document.querySelector("#num2").value = num2;
	 mem.a = num1;
	 mem.b = num2;
	 mem.gcd = gcd(num1,num2);
 }
 
 
 /**
  * calculates gcd for numbers a,b
  * @param {number} a
  * @param {number} b
  * @returns {number} gcd(a,b)
  */
 function gcd(a,b) {
	 var r;
	 while(b !== 0) {
		 r = a % b;
		 a = b;
		 b = r;
	 }
	 return a;
 }

 function beregn() {
	  var msg;

	 function cleanup(e) {
		 e.target.classList.remove("showme");
		 e.target.removeEventListener("animationend", cleanup, false);
		 mem.busy = false;
		 mem.lagre.removeAttribute("disabled");
	 }
	 
	 var guess = +document.querySelector("#gcd").valueAsNumber;
	 if (mem.busy) return;
	 noe.removeClass(".message","showme");
	 if (!isNaN(guess)) {
		 // we have a good number
		 mem.busy = true;
		 mem.lagre.setAttribute("disabled","disabled");
		 if (guess === mem.gcd) {
			 msg = noe.$("#riktig");
			 msg.classList.add("showme");
			 msg.addEventListener("animationend", cleanup, false);
			 make2numbers();
		 } else {
			 msg = noe.$("#feil");
			 msg.classList.add("showme");
			 msg.addEventListener("animationend", cleanup, false);			 
		 }
		 
	 }
 }