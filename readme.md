# MantleStream

Real-time, per-second money streaming protocol built on Mantle Network.

MantleStream enables users to create continuous USDT payment streams that distribute funds every second to one or multiple recipients, with support for pausing, cancelling, claim transfers, and recipient redirection — all fully on-chain.

## Project Overview

MantleStream is a smart contract protocol that allows a sender to lock USDT and stream it continuously over time, instead of sending lump-sum payments.

### Use Cases

- Salaries & payroll

- Creator subscriptions

- Freelance milestone payments

- Revenue sharing

- DAO contributor compensation

### Core Features
#### Continuous Money Streaming

- Funds accrue per second

- Claimable balances increase in real time

#### Multi-Recipient Streams

- Stream funds to multiple recipients

- Custom percentage allocation (basis points)

- Percentages must sum to 100% (10,000 bp)

#### Flexible Claiming

Recipients can:

- Withdraw funds to their wallet

- Transfer claims to another address

- Redirect future claims to a new recipient

#### Stream Control

- Sender can pause and unpause streams

- Sender can cancel streams at any time

Fair settlement on cancellation:

- Earned funds go to recipients

- Unearned funds are refunded to the sender

#### Security

- Uses ReentrancyGuard

- Safe ERC-20 transfers

- Strict validation and access control

## Tech Stack

### Frontend
- **Framework**: React js 
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Blockchain & Web3
- **Smart Contracts**: Solidity ^0.8.20
- **Contract Framework**: OpenZeppelin Contracts
- **Ethereum Library**: Ethers.js v6

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint

- **Type Checking**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet
- Mantle Sepolia testnet configured

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OdionOseiwe/MantleHackathon.git
   cd MantleHackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173/
   ```

### Smart Contract Deployment

1. **Deploy MockUSDT contract**
   ```bash
   forge create src/MockUSDT.sol:MockUSDT --rpc-url <YOUR_RPC_URL> --private-key <YOUR_PRIVATE_KEY> --broadcast
   ```

2. **Deploy GiftVoucher contract**
   ```bash
   forge create src/MantleStream.sol:MantleStream --rpc-url <YOUR_RPC_URL> --private-key <YOUR_PRIVATE_KEY> --constructor-args [MockUSDT] --broadcast
   ```

3. **Update contract addresses in `src/constants/Address.ts`**


# Usage Guide

### Creating a Stream

1. **Connect Wallet**: Click "Connect Wallet" and authorize your Web3 wallet (MetaMask / WalletConnect).

2. **Enter Recipient**: Input the recipient's Ethereum address.

3. **Enter Amount**: Specify the USDT amount to stream.

4. **Select Duration**: Choose the duration for your stream (seconds, minutes, hours, or days).

5. **Add Message**: Include a message to the recipient.

6. **Create Stream**: Approve the transaction in your wallet and create the stream.

### Batch Streaming (Multiple Recipients)

1. **Enable Batch Mode**: Toggle the multi-recipient option

2. **Add Recipients**: Enter multiple recipient addresses

3. **Set Percentages / Amounts:**: Allocate the stream amount across recipients (percentages must sum to 100%).

4. **Add Messages**: Personalize each recipient with a message.

5. **Send Stream**: Approve the transaction to create all streams in one batch.

