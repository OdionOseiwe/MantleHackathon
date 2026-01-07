#  MantleStream

Real-time, per-second money streaming protocol built on Mantle Network.

MantleStream enables users to create continuous USDT payment streams that distribute funds every second to one or multiple recipients, with support for pausing, cancelling, claim transfers, and recipient redirection — all fully on-chain.

##  Project Overview

MantleStream is a smart contract protocol that allows a sender to lock USDT and stream it continuously over time, instead of sending lump-sum payments.

---

### Use Cases

- Salaries & payroll

- Creator subscriptions

- Freelance milestone payments

- Revenue sharing

- DAO contributor compensation

--- 

### Core Features
- - Continuous Money Streaming

- Funds accrue per second

- Claimable balances increase in real time

- - Multi-Recipient Streams

Stream funds to multiple recipients

Custom percentage allocation (basis points)

Percentages must sum to 100% (10,000 bp)

- - Flexible Claiming

Recipients can:

Withdraw to their wallet

Transfer claims to another address

Redirect future claims to a new recipient

- - Stream Control

Sender can pause and unpause streams

Sender can cancel streams at any time

Fair settlement on cancellation:

Earned funds go to recipients

Unearned funds are refunded to sender

- - Security

Uses ReentrancyGuard

Safe ERC-20 transfers

Strict validation and access control