import { ethers } from "hardhat";

async function main() {
  const ETHER_IN_POOL = ethers.utils.parseEther("100");

  const [deployer, attacker] = await ethers.getSigners();

  const SideEntranceLenderPoolFactory = await ethers.getContractFactory(
    "SideEntranceLenderPool",
    deployer
  );

  const pool = await SideEntranceLenderPoolFactory.deploy();
  await pool.deployed();
  console.log(`pool address ${pool.address}`);

  await pool.deposit({ value: ETHER_IN_POOL });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });