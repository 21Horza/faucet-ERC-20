const hre = require("hardhat");

async function main() {
  const Faucet = await hre.ethers.getContractFactory("Faucet");
  const faucet = await Faucet.deploy("0xfFA1c4B3D6a79cF8Fd004699F5E170Eac0092503"); //token contract

  await faucet.deployed();

  console.log("Faucet contract successfully deployed", faucet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
