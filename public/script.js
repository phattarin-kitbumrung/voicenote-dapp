const speechRecognition = window.webkitSpeechRecognition
const recognition = new speechRecognition()
let speech = new SpeechSynthesisUtterance()
speech.lang = "th-TH"
const textbox = $("#textbox")
let content = "--- Waiting for message ---"
recognition.continuous = true
recognition.lang = "th-TH"
textbox.val(content)

recognition.onresult = function(event) {
  const current = event.resultIndex
  const transcript = event.results[current][0].transcript
  content += transcript
  textbox.val(content)
}

$("#start-btn").click(function(event) {
  content = ""
  textbox.val(content)
  recognition.start()
})

textbox.on('input', function() {
  content = $(this).val()
})

// web3 setup
getProvider()
const contractAddress = '0xABe930a12D8fb5B57D7a45f67717aA79fa4E6a80'
const contractABI = [{"inputs":[],"name":"retrieve","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_message","type":"string"}],"name":"store","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]
const contract = new web3.eth.Contract(contractABI, contractAddress)
let currentAccount


function getProvider() {
  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum)
    try {
      // ask user for permission
      ethereum.request({ method: 'eth_chainId' })
    } catch (error) {
      // user rejected permission
      console.log('user rejected permission')
    }
  }
  else if (window.web3) {
    // no need to ask for permission
    window.web3 = new Web3(window.web3.currentProvider)
  }
  else {
    window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
  }
}

web3.eth.getAccounts(function(err, accounts) {
  if (err != null) {
    alert("Error retrieving accounts.")
    return
  }
  if (accounts.length == 0) {
    alert("No account found! Make sure the Ethereum client is configured properly!")
    return
  }
  currentAccount = accounts[0]
  console.log('currentAccount: ' + currentAccount)
  web3.eth.defaultAccount = currentAccount
})

function readMessage() {
  contract.methods.retrieve().call().then(function(message) { 
    console.log("message: ", message)
    recognition.stop()
    content = message
    textbox.val(content)
    speech.text = content
    window.speechSynthesis.speak(speech)
  })    
}

function writeMessage() {
  contract.methods.store(content).send({from: currentAccount}).then(function(result) { 
    console.log("writeMessage result: ", result)
    recognition.stop()
    textbox.val("--- writeMessage complete ---")
  })   
}
  
