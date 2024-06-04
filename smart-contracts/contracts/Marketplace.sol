//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <8.10.0;

contract Marketplace {
    // ----------------- client -----------------------
    struct TClient {
        bool exists;
    }

    mapping(address => TClient) private clients;

    // Event to be emitted when a new client is registered
    event ClientRegisteredEvent(address clientAddress);

    // Modifier to check if client is not already registered
    modifier isNotClient() {
        require(!clients[msg.sender].exists, "Client already registered.");
        _;
    }

    // Modifier to check if client is registered
    modifier isClient() {
        require(clients[msg.sender].exists, "Client does not exist.");
        _;
    }

    // Function to register a new client
    function registerClient() public isNotClient {
        clients[msg.sender] = TClient({exists: true});
        emit ClientRegisteredEvent(msg.sender);
    }

    // Function to check if a client has an account
    function clientHasAccount(address _clientAddress) public view returns (bool) {
        return clients[_clientAddress].exists;
    }

    // ----------------- provider -----------------------
    struct TProvider {
        bool exists;
        uint256 ratingCount;
        uint256 ratingSum;
    }

    mapping(address => TProvider) private providers;

    // Event to be emitted when a new provider is registered
    event ProviderRegisteredEvent(address providerAddress);

    // Modifier to check if provider is not already registered
    modifier isNotProvider() {
        require(!providers[msg.sender].exists, "TProvider already registered.");
        _;
    }

    // Modifier to check if provider is registered
    modifier isProvider() {
        require(providers[msg.sender].exists, "TProvider does not exist.");
        _;
    }

    // Function to register a new provider
    function registerProvider() public isNotProvider {
        providers[msg.sender] = TProvider({exists: true, ratingSum: 0, ratingCount: 0});
        emit ProviderRegisteredEvent(msg.sender);
    }

    // Function to check if a provider has an account
    function providerHasAccount(address _providerAddress) public view returns (bool) {
        return providers[_providerAddress].exists;
    }

    // Function to get provider rating
    function getProviderRating(address _provider) public view returns (uint256, uint256) {
        TProvider storage provider = providers[_provider];
        return (provider.ratingSum, provider.ratingCount);
    }

    // ----------------- component -----------------------
    struct TComponent {
        bool exists;
        string name;
        address provider;
    }

    // Mapping from component ID to TComponent
    mapping(uint256 => TComponent) public components;
    uint256 public componentCount;

    // Event to be emitted when a new component is created
    event NewComponentAddedEvent(uint256 componentId, string name, address provider);

    // Modifier to check if component is not already registered
    modifier isNotComponentExist(uint256 _componentId) {
        require(!components[_componentId].exists, "TComponent does exist.");
        _;
    }

    // Modifier to check if component is registered
    modifier isComponentExists(uint256 _componentId) {
        require(components[_componentId].exists, "TComponent does not exist.");
        _;
    }

    // Function to add new component
    function addComponent(string memory _name) public isProvider {
        uint256 newComponentId = componentCount++;
        components[newComponentId] = TComponent({name: _name, provider: msg.sender, exists: true});
        emit NewComponentAddedEvent(newComponentId, _name, msg.sender);
    }

    // Function to get component details
    function getComponent(uint256 _componentId) public view isComponentExists(_componentId) returns (string memory, address) {
        TComponent storage component = components[_componentId];
        return (component.name, component.provider);
    }

    // ----------------- sla contract -----------------------
    struct TSLAContract {
        uint256 componentId;
        address client;
        uint256 rentalDuration;
        uint256 rentalPrice;
        uint256 rentStartTime;
        uint256 rentEndTime;
        bool isCompleted;
    }  

    // Mapping from sla contract ID to SLa contract
    mapping(uint256 => TSLAContract) public slaContracts;
    uint256 public contractCount;

    // Event to be emitted when a new sla Contract is created
    event SlaContractsCreatedEvent(uint256 contractId, uint256 componentId, address client, uint256 rentEndTime);

    // Event to be emitted when an SLA contract is rated
    event SLAContractRatedEvent(uint256 contractId, uint8 rating);

    // Function for clients to rent a component
    function rentComponent(uint256 _componentId, uint256 _rentalDuration) public payable isClient isComponentExists(_componentId) {
        require(msg.value > 0, "Rental price must be greater than zero.");
        
        uint256 rentEndTime = block.timestamp + _rentalDuration;
        
        slaContracts[contractCount] = TSLAContract({
            componentId: _componentId,
            client: msg.sender,
            rentalDuration: _rentalDuration,
            rentalPrice: msg.value,
            rentStartTime: block.timestamp,
            rentEndTime: rentEndTime,
            isCompleted: false
        });

        emit SlaContractsCreatedEvent(contractCount, _componentId, msg.sender, rentEndTime);
        contractCount++;
    }

    // Function to rate an SLA contract
    function rateSLAContract(uint256 _contractId, uint8 _rating) public isClient {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5.");
        TSLAContract storage slaContract = slaContracts[_contractId];
        require(slaContract.client == msg.sender, "Only the client can rate this contract.");
        require(block.timestamp > slaContract.rentEndTime, "Rental period not yet ended.");
        require(!slaContract.isCompleted, "SLA contract already rated.");

        TProvider storage provider = providers[components[slaContract.componentId].provider];
        provider.ratingSum += _rating;
        provider.ratingCount++;

        slaContract.isCompleted = true;

        emit SLAContractRatedEvent(_contractId, _rating);
    }
    
        // Function to get SLA contract details
    function getSLAContract(uint256 _contractId) public view returns (uint256, address, uint256, uint256, uint256, bool) {
        TSLAContract storage slaContract = slaContracts[_contractId];
        return (
            slaContract.componentId,
            slaContract.client,
            slaContract.rentalDuration,
            slaContract.rentalPrice,
            slaContract.rentEndTime,
            slaContract.isCompleted
        );
    }
}
