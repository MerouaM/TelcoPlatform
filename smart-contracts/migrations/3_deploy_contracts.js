const NotificationStorage = artifacts.require("NotificationStorage");

module.exports = function(deployer) {
  deployer.deploy(NotificationStorage);
};