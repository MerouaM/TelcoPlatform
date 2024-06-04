// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NotificationStorage {
    struct Notification {
        string title;
        string content;
        string timestamp;
        string sender;
    }

    Notification[] public notifications;

    event NotificationStored(string title, string content, string timestamp, string sender);

    function storeNotification(string memory _title, string memory _content, string memory _timestamp, string memory _sender) public {
        notifications.push(Notification(_title, _content, _timestamp, _sender));
        emit NotificationStored(_title, _content, _timestamp, _sender);
    }

    function getNotification(uint _index) public view returns (string memory, string memory, string memory, string memory) {
        require(_index < notifications.length, "Index out of bounds");
        Notification memory notification = notifications[_index];
        return (notification.title, notification.content, notification.timestamp, notification.sender);
    }

    function getNotificationCount() public view returns (uint) {
        return notifications.length;
    }
}