var noe = {};
(function() {
  function makeSelect(id,etiketter,valgt) {
	var select = '<select id="' + id + '">';
	var i,etikett;
	var elementer = etiketter.split(",");
	for (i=0; i < elementer.length; i+=1) {
		etikett = elementer[i];
		if ( etikett === valgt) {
		  select += "<option selected>" + etikett + "</option>";
		} else {
		  select += "<option>" + etikett + "</option>";
		}
	}
	select += "</select>";
	return select;
  }
  
  function roll(lo,hi) {
	  var diff = hi - lo + 1;
	  return Math.floor(Math.random()*diff)+lo;
  }
  
  /**
 * removes class given by klass from all dom-objects matched by selector
 * @param {cssselect} selector
 * @param {string} klass
 */
  function removeClass(selector, klass) {
	  var items = document.querySelectorAll(selector);
	  var i;
	  if (items.length) {
		  for (i = 0; i < items.length; i++) {
			  items[i].classList.remove(klass);
		  }
	  }
  }


  /**
   * adds class given by klass to all dom-objects matched by selector
   * @param {cssselect} selector
   * @param {string} klass
   */
  function addClass(selector, klass) {
	  var items = document.querySelectorAll(selector);
	  var i;
	  if (items.length) {
		  for (i = 0; i < items.length; i++) {
			  items[i].classList.add(klass);
		  }
	  }
  }
  
  noe.addClass = addClass;
  noe.removeClass = removeClass;
  noe.roll = roll;
  noe.makeSelect = makeSelect;
}) ();