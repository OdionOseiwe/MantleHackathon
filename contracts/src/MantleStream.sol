// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title MantleStream.
 * @author Odion Oseiwe.
 * @notice A protocol for creating real-time, per-second money streams on Mantle.
 */

contract MantleStream is ReentrancyGuard {
    struct Stream {
        uint256 id;
        address sender;
        string message;
        address[] recipient;
        uint256[] percentages;
        uint256 duration;
        uint256 amount;
        uint256 startTime;
        uint256 endTime;
        uint256 flowRate;
        uint256[] amountWithdrawn;
        bool active;
        bool paused;
        uint256 pausedAt;
        uint256 totalPausedDuration;
    }

    address immutable USDT;
    uint256 streamCounter = 1;

    mapping(uint256 => Stream) public streams;
    mapping(address => uint256[]) public streamsBySender;
    mapping(address => uint256[]) public streamsByRecipient;

    event StreamCreated(
        uint256 indexed id,
        address indexed sender,
        uint256 amount,
        uint256 duration
    );

    event StreamRecipient(
        uint256 indexed id,
        address indexed recipient,
        uint256 percentage
    );

    event WithdrawFromStream(
        uint256 indexed id,
        address indexed recipient,
        uint256 amount
    );

    event StreamCancelled(uint256 indexed id);
    event StreamPaused(uint256 indexed id);
    event StreamUnpaused(uint256 indexed id);

    event StreamRedirected(
        uint256 indexed id,
        address indexed oldRecipient,
        address indexed newRecipient
    );

    event ClaimsTransferred(
        uint256 indexed id,
        address indexed to,
        uint256 amount
    );

    constructor(address _usdtAddress) {
        require(_usdtAddress != address(0), "Invalid USDT address");
        USDT = _usdtAddress;
    }

    //TODO: add a message 
    ///@dev used to create stream
    ///@param _recipient the address that can claim money stream
    ///@param _duration the length of stream
    ///@param _amount to stream
    ///@return the id for the stream created
    function createStream(
        address _recipient,
        uint256 _duration,
        uint256 _amount,
        string memory _message
    ) external nonReentrant returns (uint256) {
        require(_recipient != address(0), "invalid recipient");
        require(_amount > 0 && _duration > 0, "invalid amount or duration");

        bool success = IERC20(USDT).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(success, "transfer failed");

        uint256 id = streamCounter;

        Stream storage stream = streams[id];

        stream.sender = msg.sender;
        stream.recipient.push(_recipient);
        stream.percentages.push(10000); // 100% (basis points)
        stream.amountWithdrawn.push(0);
        stream.duration = _duration;
        stream.amount = _amount;
        stream.startTime = block.timestamp;
        stream.endTime = block.timestamp + _duration;
        stream.flowRate = _amount / _duration;
        stream.active = true;
        stream.paused = false;
        stream.message =_message;

        streamCounter++;
        streamsBySender[msg.sender].push(id);
        streamsByRecipient[_recipient].push(id);

        emit StreamCreated(id, msg.sender, _amount, _duration);
        return id;
    }

    //TODO: add a message 
    ///@dev used to create stream for multiple recipient
    ///@param _recipients the addresses that can claim money stream
    ///@param _duration the length of stream
    ///@param _amount to stream
    ///@param _percentages for the recipients
    ///@return the id for the stream created
    function createMultipleStreams(
        address[] memory _recipients,
        uint256 _duration,
        uint256 _amount,
        uint256[] memory _percentages,
        string memory _message
    ) external nonReentrant returns (uint256) {
        require(_recipients.length > 1, "need multiple recipients");
        require(_recipients.length == _percentages.length, "array mismatch");
        require(_amount > 0 && _duration > 0, "invalid amount or duration");

        uint256 totalPercent;
        // check if percentage length is equal to 1000 %
        for (uint256 i = 0; i < _percentages.length; i++) {
            require(_percentages[i] > 0, "bad percentage");
            totalPercent += _percentages[i];
        }
        require(totalPercent == 10000, "percentages must sum to 10000");

        bool success = IERC20(USDT).transferFrom(
            msg.sender,
            address(this),
            _amount
        );
        require(success, "transfer failed");
        uint256 id = streamCounter;

        Stream storage stream = streams[id];

        for (uint256 i = 0; i < _recipients.length; i++) {
            require(_recipients[i] != address(0), "invalid recipient");
            stream.recipient.push(_recipients[i]);
            stream.percentages.push(_percentages[i]);
            stream.amountWithdrawn.push(0);

            streamsByRecipient[_recipients[i]].push(id);
            emit StreamRecipient(id, _recipients[i], _percentages[i]);
        }
        stream.sender = msg.sender;
        stream.duration = _duration;
        stream.amount = _amount;
        stream.startTime = block.timestamp;
        stream.endTime = block.timestamp + _duration;
        stream.flowRate = _amount / _duration; // every second
        stream.active = true;
        stream.paused = false;
        stream.message =_message;

        streamCounter++;
        streamsBySender[msg.sender].push(id);

        emit StreamCreated(id, msg.sender, _amount, _duration);
        return id;
    }

    ///@dev used to withdraw directly into the recipient wallet
    ///@param _streamId stream id
    ///@param _amount to claim
    function withdrawFromStream(
        uint256 _streamId,
        uint256 _amount
    ) external nonReentrant {
        Stream storage stream = streams[_streamId];
        require(stream.active, "stream inactive");
        require(!stream.paused, "stream paused");
        require(block.timestamp > stream.startTime, "stream not started");

        uint256 totalClaimable = _calculateRewards(msg.sender, stream);

        require(_amount > 0, "invalid amount");
        require(_amount <= totalClaimable, "exceeds claimable");

        // Update withdrawn amount
        for (uint256 i = 0; i < stream.recipient.length; i++) {
            if (stream.recipient[i] == msg.sender) {
                stream.amountWithdrawn[i] += _amount;
                break;
            }
        }

        // Transfer tokens
        bool success = IERC20(USDT).transfer(msg.sender, _amount);
        require(success, "transfer failed");
        emit WithdrawFromStream(_streamId, msg.sender, _amount);
    }

    ///@dev used to transfer claims to another address
    ///@param _streamId stream id
    ///@param _amount to claim
    ///@param _receiver address to claim to
    function transferClaimsToAddress(
        uint256 _streamId,
        uint256 _amount,
        address _receiver
    ) external {
        Stream storage stream = streams[_streamId];
        require(stream.active, "stream inactive");
        require(!stream.paused, "stream paused");
        require(block.timestamp > stream.startTime, "stream not started");

        uint256 totalClaimable = _calculateRewards(msg.sender, stream);

        require(_amount > 0, "invalid amount");
        require(_amount <= totalClaimable, "exceeds claimable");

        // Update withdrawn amount
        for (uint256 i = 0; i < stream.recipient.length; i++) {
            if (stream.recipient[i] == msg.sender) {
                stream.amountWithdrawn[i] += _amount;
                break;
            }
        }

        // Transfer tokens
        bool success = IERC20(USDT).transfer(_receiver, _amount);
        require(success, "transfer failed");
        emit ClaimsTransferred(_streamId, _receiver, _amount);
    }

    ///@dev used to redirect claimes to a new address
    ///@param _streamId stream id
    ///@param _newRecipient new recipient address
    function redirectClaimsRecipient(
        uint256 _streamId,
        address _newRecipient
    ) external {
        require(_newRecipient != address(0), "invalid recipient");

        Stream storage stream = streams[_streamId];
        require(stream.active, "stream inactive");
        require(!stream.paused, "stream paused");

        bool found = false;
        for (uint256 i = 0; i < stream.recipient.length; i++) {
            if (stream.recipient[i] == msg.sender) {
                stream.recipient[i] = _newRecipient;
                found = true;
                break;
            }
        }
        require(found, "caller not a recipient");
        emit StreamRedirected(_streamId, msg.sender, _newRecipient);
    }

    ///@dev used to pause stream
    ///@param _streamId stream id
    function pauseStream(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];

        require(stream.active, "stream inactive");
        require(!stream.paused, "already paused");
        require(msg.sender == stream.sender, "only sender");

        stream.paused = true;
        emit StreamPaused(_streamId);
    }

    ///@dev used to unpause stream
    ///@param _streamId stream id
    function unPauseStream(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];

        require(stream.active, "stream inactive");
        require(stream.paused, "not paused");
        require(msg.sender == stream.sender, "only sender");

        stream.paused = false;

        emit StreamUnpaused(_streamId);
    }

    ///@dev used to cancel stream and refund sender and send remaining claims to recipients
    ///@param _streamId stream id
    function cancelStream(uint256 _streamId) external nonReentrant {
        Stream storage stream = streams[_streamId];

        require(stream.active, "stream inactive");

        // check if msg.sender is creator of stream
        bool authorized = msg.sender == stream.sender;
        require(authorized, "not authorized");

        stream.active = false;
        uint256 elapsed = block.timestamp >= stream.endTime
            ? stream.duration
            : block.timestamp - stream.startTime;

        // get total earned for a duration
        uint256 totalEarned = elapsed * stream.flowRate;

        // Pay each recipient their final share
        for (uint256 i = 0; i < stream.recipient.length; i++) {
            // get the percentage for each recipient
            uint256 entitled = (totalEarned * stream.percentages[i]) / 10000;
            //remove the withdrawn amount to get the remainig claims
            uint256 claimable = entitled - stream.amountWithdrawn[i];

            if (claimable > 0) {
                stream.amountWithdrawn[i] += claimable;
                bool success = IERC20(USDT).transfer(
                    stream.recipient[i],
                    claimable
                );
                require(success, "transfer failed");
            }
        }
        uint256 unstreamed = stream.amount - totalEarned;

        // Refund leftover unearned tokens to sender
        if (unstreamed > 0) {
            bool success = IERC20(USDT).transfer(stream.sender, unstreamed);
            require(success, "transfer failed");
        }

        delete streams[_streamId];
        emit StreamCancelled(_streamId);
    }

    function _calculateRewards(
        address user,
        Stream storage stream
    ) internal view returns (uint256) {
        uint256 elapsed;

        if (block.timestamp >= stream.endTime) {
            elapsed = stream.duration;
        } else {
            elapsed = block.timestamp - stream.startTime;
        }

        uint256 totalEarned = elapsed * stream.flowRate;

        // Find user index
        for (uint256 i = 0; i < stream.recipient.length; i++) {
            if (stream.recipient[i] == user) {
                uint256 share = (totalEarned * stream.percentages[i]) / 10000;
                // to get the current claimable amount
                return share - stream.amountWithdrawn[i];
            }
        }
        return 0;
    }

    function getClaimableBalance(uint256 streamId) public view returns (uint256) {
        Stream storage stream = streams[streamId];
        require(stream.active, "stream inactive");
        require(!stream.paused, "stream paused");
        require(block.timestamp >= stream.startTime, "stream not started");

        uint256 elapsed;

        if (block.timestamp >= stream.endTime) {
            elapsed = stream.duration;
        } else {
            elapsed = block.timestamp - stream.startTime;
        }

        uint256 totalEarned = elapsed * stream.flowRate;


        for (uint256 i = 0; i < stream.recipient.length; i++) {
            if (stream.recipient[i] == msg.sender) {
                uint256 share = (totalEarned * stream.percentages[i]) / 10000;
                return share - stream.amountWithdrawn[i];
            }
        }

        return 0;
    }

    function getClaimableFunds(
        uint256 _streamId
    ) external view returns (uint256) {
        Stream storage stream = streams[_streamId];
        uint256 balance = _calculateRewards(msg.sender, stream);
        return balance;
    }

    function getStreamsBySender(address user)
        external
        view
        returns (uint256[] memory)
    {
        return streamsBySender[user];
    }

    function getStreamsByRecipient(address user)
        external
        view
        returns (uint256[] memory)
    {
        return streamsByRecipient[user];
    }

    function getStreamArrays(uint256 streamId)
        external
        view
        returns (
            address[] memory recipients,
            uint256[] memory percentages,
            uint256[] memory withdrawn
        )
    {
        Stream storage s = streams[streamId];
        return (s.recipient, s.percentages, s.amountWithdrawn);
    }

}
