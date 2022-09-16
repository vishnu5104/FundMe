import { ethers } from "./ethers.js";
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
}

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
