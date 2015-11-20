/**
 *  funksjon som henter ut og lagrer
 *  info fra skjema
 */
function lagreInfo() {
   var navn = document.querySelector("#navn").value;
   var alder = document.querySelector("#alder").value;
   var divPersonalia = document.querySelector("#personalia");
   divPersonalia.style.display = "none";
   var divHilsen = document.querySelector("#hilsen");
   divHilsen.innerHTML = lagEnHilsen(navn,+alder);
}

/**
 *  @param {string} navn
 *  @param {number} alder
 *  @return {string} hei $navn, du er xxx
 */
 function lagEnHilsen(navn,alder) {
 	var gruppe ="",hilsen="";
 	if (alder>68) {
       gruppe = "en pensjonist";
 	} else if (alder > 17) {
       gruppe = "voksen";
 	} else if (alder > 12) {
       gruppe = "en ungdom";
 	} else {
 		gruppe = "et barn";
 	}
 	hilsen = "Hei " + navn + ", du er " + gruppe;
 	return hilsen;
 }