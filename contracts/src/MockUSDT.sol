// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "USDT") {
        _mint(msg.sender, 1000 * 1e18); // Mint 1,000,000 USDT with 6 decimals
    }

    function decimals() public view virtual override returns (uint8) {
        return 6; // USDT has 6 decimals
    }

    // Faucet function: anyone can mint themselves any amount (for testnet only!)
    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}
// forge create src/MantleStream.sol:MantleStream --rpc-url https://mantle-sepolia.drpc.org \
//     --private-key 76dbef1b354c8201f5aa1f9e26365d115c29f004b32a29aeec833b74cdc6e1f4 \
//     --broadcast \
//     --etherscan-api-key Z8P4W843RDB83JD848SWFRI6JVVXGVM9KT \
//     --verify \
//     --constructor-args 0xDCBbde31e98A9a190C3932e562Dc723Bf56b87f8

// graph init \
//   --from-contract  \
//   --network mantle-sepolia \
//   --node https://api.subgraph.mantle.xyz/deploy/ \
//   mantle-stream-subgraph
