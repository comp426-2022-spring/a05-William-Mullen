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
const multinav = document.getElementById("multinav")
//event listner for multinav
multinav.addEventListener("submit", flipCoins)
//create the submit handler
function flipCoins(event){
	document.getElementById("multi").setAttribute("classs", "active")
	event.preventDefault();
	
	const endpoint = "app/flip/coin/"
	const url = document.baseURI+endpoint

	const formEvent = event.currentTarget

	try{
		const formData = new FormData(formEvent); 
		const flips = await sendFlips({url, formData});

		console.log(flips);
	} catch (error) {
		console.log(error);
	}
}
//create a data sender
function sendFlips({url, formData}){
	const response = await fetch()
	return response.json()
}
// Guess a flip by clicking either heads or tails button
