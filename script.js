import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance

async function connect() {
  if (typeof window.ethereum !== "undefined") { // Checks if client has Metamask
    try {
      await ethereum.request({ method: "eth_requestAccounts" }) // Requests for account signing -a Metamask pop-up (under the hood: An array of a single, hexadecimal Ethereum address string.)
    } catch (error) {
      console.log(error)
    }
    connectButton.innerHTML = "Connected" // Changes the button's content to Connected if an error is not thrown
    const accounts = await ethereum.request({ method: "eth_accounts" }) //  Returns a list of addresses owned by client.
    console.log(accounts)
  } else {
    connectButton.innerHTML = "Please install MetaMask" // If no Metamask is detected
  }
}

async function withdraw() {
  console.log(`Withdrawing...`)
  if (typeof window.ethereum !== "undefined") { // Checks if client has Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum) // Similar to a RPC provider, acts like a provider
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse, provider) // Returns a promise (either resolved or rejected)
    } catch (error) {
      console.log(error)
    }
  } else {
    withdrawButton.innerHTML = "Please install MetaMask" // If client does not have metamask
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}...`)
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const contract = new ethers.Contract(contractAddress, abi, signer)
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMine(transactionResponse, provider)
    } catch (error) {
      console.log(error)
    }
  } else {
    fundButton.innerHTML = "Please install MetaMask"
  }
}

async function getBalance() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    try {
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.utils.formatEther(balance))
    } catch (error) {
      console.log(error)
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask"
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations. `
      )
      resolve()
    })
  })
}

/*import { ethers } from "./ethers.js";
import { abi, contractAddress } from "./constants.js";
const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("getbalance");
const widthdrawButton = document.getElementById("widthdraw");

//nameofconst.methodname = nameoffun
connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
widthdrawButton.onclick = widthdraw;

// so if the button is clicked then the onclick is trigrred then it pass the correspoding functions {connect and fund}
async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    document.getElementById("connectButton").innerHTML = "Connected";
  } else {
    document.getElementById("connectButton").innerHTML =
      "Please install metamask";
  }
}
// to know the current balance
async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress); // vontract addres is the class of the contract with a abi..
    console.log(ethers.utils.formatEther(balance)); // reading ether formated numbers
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value;
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer); // now it a contract
    // so we can make transations // so we can call all the solidity function from there when we get the abi , contrcat and sighner
    try {
      const transactonResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });

      // listen for the tx to mint
      // listen for an event
      await listenForTransationMined(transactonResponse, provider);
      console.log("Done");
    } catch (error) {
      console.log(error);
    }
  }
}

// transa mint is  not a async func()
function listenForTransationMined(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirms`
      );
      resolve();
    });
  });

  // create a lisnerner
}

async function widthdraw() {
  console.log("Withdrawing...");
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // grab the provider and signer if()
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.widthdraw();
      await listenForTransationMined(transactionResponse, provider);
    } catch (error) {
      console.log(error);
    }
  }
} */

// async function withdraw() {
//   console.log(`Withdrawing...`);
//   if (typeof window.ethereum !== "undefined") {
//     const provider = new ethers.providers.Web3Provider(window.ethereum);
//     const signer = provider.getSigner();
//     const contract = new ethers.Contract(contractAddress, abi, signer);
//     try {
//       const transactionResponse = await contract.withdraw();
//       await listenForTransationMined(transactionResponse, provider);
//       // await transactionResponse.wait(1)
//     } catch (error) {
//       console.log(error);
//     }
//   } else {
//     withdrawButton.innerHTML = "Please install MetaMask";
//   }
// }
