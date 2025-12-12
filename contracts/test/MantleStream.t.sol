// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MantleStream.sol";
import {console} from "forge-std/console.sol";
import {MockUSDT} from '../src/MockUSDT.sol';
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MantleStreamtest is Test {
    MantleStream public mantleStream;
    MockUSDT public usdt;

    address my_wallet = address(10);
    address recipient1 = address(20);
    address recipient2 = address(30);
    address newRecipient = address(40);

    address[] recips = [recipient1,recipient2];
    uint256[] perc = [5000, 5000];

    function setUp() public {
        usdt = new MockUSDT();
        mantleStream = new MantleStream(address(usdt));
    }

    function testCreateStream() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
        uint256 id = mantleStream.createStream(recipient1, 1798761599, 10e18);
        (address storedSender, uint256 storedDuration,uint256 storedAmount  ,, ,uint256 storedFlowRate, , ,  , uint256 totalPausedDuration) = mantleStream.streams(id);
        assertEq(storedSender, address(my_wallet));
        assertEq(storedDuration, 1798761599);
        vm.stopPrank();
    }

    function testcreateMultipleStreams() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
       
        uint256 id = mantleStream.createMultipleStreams(
            recips,
            1798761599,
            100e18,
            perc
        );  
        uint256 balance =  usdt.balanceOf(address(my_wallet)); 

        assertEq(balance, 900e18);
    }

    function testwithdrawFromStream() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
        uint256 id = mantleStream.createStream(recipient1, 1798761599, 10e18);
        vm.stopPrank();

        vm.startPrank(recipient1);
        vm.warp(1798761599);
        mantleStream.withdrawFromStream(id,1e18);

        uint256 bal = usdt.balanceOf(recipient1);
        assertEq(bal, 1e18);

        vm.stopPrank();
    }

    function testtransferClaimsToAddress() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
        uint256 id = mantleStream.createStream(recipient1, 1798761599, 10e18);
        vm.stopPrank();

        vm.startPrank(recipient1);
        vm.warp(1798761599);

        mantleStream.transferClaimsToAddress(id,1e18,address(recipient2));
        uint256 bal = usdt.balanceOf(recipient2);
        assertEq(bal, 1e18);

        vm.stopPrank();
    }
    function testredirectClaimsRecipient() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
        uint256 id = mantleStream.createStream(recipient1, 1798761599, 10e18);
        vm.stopPrank();

        vm.startPrank(recipient1);
        mantleStream.redirectClaimsRecipient(id, newRecipient);
        vm.stopPrank(); 

        vm.warp(1798761599);
        vm.startPrank(newRecipient);
        mantleStream.withdrawFromStream(id,1e18);
        vm.stopPrank(); 

        uint256 bal = usdt.balanceOf(newRecipient);
        assertEq(bal, 1e18);

    }

    function tespauseStream() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
        uint256 id = mantleStream.createStream(recipient1, 1798761599, 10e18);

        mantleStream.pauseStream(id);

    }
    function testunPauseStream() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
        uint256 id = mantleStream.createStream(recipient1, 1798761599, 10e18);
        mantleStream.pauseStream(id);
        mantleStream.unPauseStream(id);
    }

    function testcancelStream() public {
        vm.startPrank(my_wallet);
        usdt.mint(address(my_wallet),1000e18);
        usdt.approve(address(mantleStream), type(uint256).max);
        uint256 id = mantleStream.createStream(recipient1, 1798761599, 10e18);
        vm.warp(block.timestamp + 10000);
     
        mantleStream.cancelStream(id);
        uint256 balRecipient = usdt.balanceOf(recipient1);
        uint256 balSender = usdt.balanceOf(my_wallet);

        console.logUint(balRecipient);
        console.logUint(balSender);
    }

}