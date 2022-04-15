import MonsterLabABI from "./monsterLab_abi.js"
import SlabsABI from "./slabs_abi.js"

	const getWeb3 = async() => {
		
		return new Promise(async (resolve, reject) => {
			const web3 = new Web3(window.ethereum)
		
			try {
				await window.ethereum.request({ method: "eth_requestAccounts" })
				resolve(web3)
			} catch (error) {
				reject(error)		
			}
		})
	
	}

document.addEventListener("DOMContentLoaded", () => {	
	var contract=null;
	var addresses=null;
	document.getElementById("mint_button").addEventListener("click", async () => {
		if(addresses !== null) {
		contract = new web3Wallet.eth.Contract(SlabsABI, "0xa5441a35bA50505d3a241856e943AFEC0AF03548") 	
		var slabsAllowance = await contract.methods.allowance(addresses[0], "0xD619De49412220B67Ca69751C07c333704f6FAFF").call()
		if(slabsAllowance < 15000000000) {
			var slabsAllowance = await contract.methods.approve("0xD619De49412220B67Ca69751C07c333704f6FAFF", 15000000000).send({
				from:addresses[0]			
			})
			contract = new web3Wallet.eth.Contract(MonsterLabABI, "0xD619De49412220B67Ca69751C07c333704f6FAFF") 			
			await contract.methods.requestNewRandomCharacter(2423).send({
 				from: addresses[0]
 			});
		}
		else {
			contract = new web3Wallet.eth.Contract(MonsterLabABI, "0xD619De49412220B67Ca69751C07c333704f6FAFF") 			
			await contract.methods.requestNewRandomCharacter(2423).send({
 				from: addresses[0]
 			});
		}
	}		
  	})	
	
  document.getElementById("connect_button").addEventListener("click", async() => {
  	 const web3 = await getWeb3()
  	 addresses = await web3.eth.requestAccounts()
  	 console.log(addresses[0])
  })
  const web3Wallet = new Web3(window.ethereum)
	
  document.getElementById("load_button").addEventListener("click", async () => {


   document.getElementById("nfts").innerHTML = ""
		
    for(let i = 0; i < 101; i++) {
    		contract = new web3Wallet.eth.Contract(MonsterLabABI, "0xD619De49412220B67Ca69751C07c333704f6FAFF") 	
      var tokenId = await contract.methods.tokenByIndex(i).call()
		console.log(tokenId)
		if(isNaN(tokenId))      
      break
      else {
      	let tokenMetadataURI = await contract.methods.tokenURI(tokenId).call()
      	console.log(tokenMetadataURI)
      	const tokenMetadata = await fetch(tokenMetadataURI).then((response) => response.json())
			console.log(tokenMetadata)			
			let tokenPowerLevel = await contract.methods.tokenIdToPowerLevel(tokenId).call()
			console.log(tokenPowerLevel) 	
      	const monsterElement = document.getElementById("nft_template").content.cloneNode(true)
      	monsterElement.querySelector("h1").innerText = tokenMetadata["name"]
      	monsterElement.querySelector("img").src = tokenMetadata["image"]
      	monsterElement.querySelector("img").alt = tokenMetadata["description"]
      	monsterElement.querySelector("p").innerText = "Power level: " + tokenPowerLevel
			document.getElementById("nfts").append(monsterElement) 
      }
    }

  })
})