// Focus div based on nav button click

// Flip one coin and show coin image to match result when button clicked
const singlenav = document.getElementById("singlenav")
// Add event listener for coin button
singlenav.addEventListener("click", flipCoin)

	function flipCoin() {
		document.getElementById("single").setAttribute("class", "active")
		fetch('http://localhost:5000/app/flip/', {mode: 'cors'})
		.then(function(response) {
    		return response.json();
  				})
				.then(function(result) {
					console.log(result);
					document.getElementById("result").innerHTML = result.flip;
					document.getElementById("quarter").setAttribute("src", "./assets/img/"+result.flip+".png");
					//coin.disabled = true
				})
			//	let flip = "FLIPPED"
			//	document.getElementById("coin").innerHTML = flip;
			//	console.log("Coin has been flipped. Result: "+ flip)
}

// Flip multiple coins and show coin images in table as well as summary results
// Enter number and press button to activate coin flip series
const numCoins = document.getElementById("numCoins")

//event listner for multinav
numCoins.addEventListener("submit", flipCoins)

//create the submit handler
async function flipCoins(event){
	event.preventDefault();

	document.getElementById("multi").setAttribute("classs", "active")
	
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
// Guess a flip by clicking either heads or tails button
