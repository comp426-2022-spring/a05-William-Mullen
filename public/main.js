
// Flip one coin and show coin image to match result when button clicked

// Add event listener for coin button
const singlenav = document.getElementById("singlenav")
singlenav.addEventListener("click", flipCoin)

	function flipCoin() {
		document.getElementById("guess").setAttribute("class", "hidden")
		document.getElementById("single").setAttribute("class", "active")
		document.getElementById("multi").setAttribute("class", "hidden")
		fetch('http://localhost:5000/app/flip/', {mode: 'cors'})
		.then(function(response) {
    		return response.json();
  				})
				.then(function(result) {
					console.log(result);
					document.getElementById("result").innerHTML = result.flip;
					document.getElementById("quarter").setAttribute("src", "./assets/img/"+result.flip+".png");
				})
}

//--------------------------------------------------------------------------------------------------------------------------

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series


//show multi hide rest
const multinav = document.getElementById("multinav")
multinav.addEventListener("click", showMany)
function showMany() {
	document.getElementById("guess").setAttribute("class", "hidden")
	document.getElementById("single").setAttribute("class", "hidden")
	document.getElementById("multi").setAttribute("class", "active")
}

//event listner for multinav
const numCoins = document.getElementById("numCoins")
numCoins.addEventListener("submit", flipCoins)

//create the submit handler
async function flipCoins(event){
	event.preventDefault();
	
	const endpoint = "app/flip/coins/"
	const url = document.baseURI+endpoint

	const formEvent = event.currentTarget

	try{
		const formData = new FormData(formEvent); 
		const flips = await sendFlips({url, formData});

		console.log(flips);
		document.getElementById("heads").innerHTML = "Heads:"+flips.summary.heads;
		document.getElementById("tails").innerHTML = "Tails:"+flips.summary.tails;

	} catch (error) {
		console.log(error);
	}
}

//create a data sender
async function sendFlips({url, formData}){

	const plainFormData = Object.fromEntries(formData.entries());
	const formDataJson = JSON.stringify(plainFormData);

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: formDataJson
	}

	const response = await fetch(url, options);
	return response.json()
}

//-----------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------

// Guess a flip by clicking either heads or tails button

//show guess hide rest
const guessnav = document.getElementById("guessnav")
guessnav.addEventListener("click", showGuess)
function showGuess() {		
	document.getElementById("guess").setAttribute("class", "active")
	document.getElementById("single").setAttribute("class", "hidden")
	document.getElementById("multi").setAttribute("class", "hidden")
}

// Add event listener for head button
const headz = document.getElementById("headz")
headz.addEventListener("click", guessHead)

function guessHead(){

	fetch('http://localhost:5000/app/flip/call/heads', {mode: 'cors'})
		.then(function(response) {
			return response.json();
		  })
		.then(function(result) {
			console.log(result);
			 document.getElementById("guesss").innerHTML = "heads";
			 document.getElementById("rezz").innerHTML = result.flip;

		})
}

// event listener for tail button
const tailz = document.getElementById("tailz")
tailz.addEventListener("click", guessTail)

function guessTail(){

	fetch('http://localhost:5000/app/flip/call/tails', {mode: 'cors'})
		.then(function(response) {
			return response.json();
		  })
		.then(function(result) {
			console.log(result);
			 document.getElementById("guesss").innerHTML = "tails";
			 document.getElementById("rezz").innerHTML = result.flip;

		})
}