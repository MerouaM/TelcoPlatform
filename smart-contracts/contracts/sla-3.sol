// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Agreement {
    // Enum for agreement status
    enum Status { Pending, Refused, Accepted, Canceled, InProgress, Terminated }

    // Struct for agreement
    struct AgreementData {
        uint duration;
        Status status;
    }

    // Array to store agreements
    AgreementData[] public agreements;

// Event emitted when a new agreement is stored
event AgreementStored(uint indexed agreementId, uint duration, Status status);

// Event emitted when agreement status is changed
event StatusChanged(uint indexed agreementId, Status newStatus);

// Event emitted when agreement status is changed to Accepted
event AgreementAccepted(uint indexed agreementId, Status status);

    // Function to store a new agreement
    function storeAgreement(uint _duration, Status _status) external {
        agreements.push(AgreementData(_duration, _status));
        uint agreementId = agreements.length - 1;
        emit AgreementStored(agreementId, _duration, _status);
    }


    // Function to change the status of an existing agreement
    function changeStatus(uint _agreementId, Status _newStatus) external {
        require(_agreementId < agreements.length, "Agreement ID does not exist");
        agreements[_agreementId].status = _newStatus;
        emit StatusChanged(_agreementId, _newStatus);
    }
}