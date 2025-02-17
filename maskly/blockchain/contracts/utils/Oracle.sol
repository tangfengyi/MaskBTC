// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract Oracle is Ownable {
    struct DataPoint {
        uint256 timestamp;
        uint256 value;
    }

    mapping(string => DataPoint) public dataPoints;

    event DataUpdated(string key, uint256 value, uint256 timestamp);

    function updateData(string memory key, uint256 value) public onlyOwner {
        dataPoints[key] = DataPoint({
            timestamp: block.timestamp,
            value: value
        });
        emit DataUpdated(key, value, block.timestamp);
    }

    function getData(string memory key) public view returns (uint256, uint256) {
        DataPoint memory dataPoint = dataPoints[key];
        return (dataPoint.value, dataPoint.timestamp);
    }
}

