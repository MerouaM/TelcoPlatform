//SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <8.10.0;

contract Marketplace {
    // ----------------- client -----------------------
    struct TClient {
        bool exists;
        string name;
    }

    mapping(address => TClient) private clients;

    address[] private clientList;
    uint256 public clientCount;

    // Event to be emitted when a new client is registered
    event ClientRegisteredEvent(address clientAddress, string name);

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
    function registerClient(string memory name) public isNotClient {
        clients[msg.sender] = TClient({exists: true, name: name});
        clientList.push(msg.sender);
        clientCount++;
        emit ClientRegisteredEvent(msg.sender, name);
    }

    // Function to check if a client has an account
    function clientHasAccount(address _clientAddress) public view returns (bool) {
        return clients[_clientAddress].exists;
    }

    // Function to get all clients
    function getAllClients() public view returns (address[] memory) {
        return clientList;
    }

    // ----------------- provider -----------------------
    struct TProvider {
        bool exists;
        string name;
        uint256 ratingCount;
        uint256 ratingSum;
    }

    mapping(address => TProvider) private providers;
    
    address[] private providerList;
    uint256 public providerCount;

    // Event to be emitted when a new provider is registered
    event ProviderRegisteredEvent(address providerAddress, string name);

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
    function registerProvider(string memory name) public isNotProvider {
        providers[msg.sender] = TProvider({exists: true, name: name, ratingSum: 0, ratingCount: 0});
        providerList.push(msg.sender);
        providerCount++;
        emit ProviderRegisteredEvent(msg.sender, name);
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

    // Function to get all providers
    function getAllProviders() public view returns (address[] memory) {
        return providerList;
    }

    // ----------------- component -----------------------
    struct TComponent {
        bool exists;
        string name;
        uint256 price;
        string information;
        address provider;
    }

    // Mapping from component ID to TComponent
    mapping(uint256 => TComponent) public components;
    uint256 public componentCount;
    uint256[] private componentList;

    // Event to be emitted when a new component is created
    event NewComponentAddedEvent(uint256 componentId, string name, uint256 price, string information, address provider);

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
    function addComponent(string memory _name, uint256 price, string memory information) public isProvider {
        uint256 newComponentId = componentCount++;
        components[newComponentId] = TComponent({name: _name, provider: msg.sender, price: price, information: information, exists: true});
        componentList.push(newComponentId);
        emit NewComponentAddedEvent(newComponentId, _name, price, information, msg.sender);
    }

    // Function to get component details
    function getComponent(uint256 _componentId) public view isComponentExists(_componentId) returns (string memory, uint256, string memory, address) {
        TComponent storage component = components[_componentId];
        return (component.name, component.price, component.information, component.provider);
    }

    function getComponentPrice(uint256 _componentId) public view isComponentExists(_componentId) returns (uint256) {
        TComponent storage component = components[_componentId];
        return (component.price);
    }

    // Function to get all components
    function getAllComponents() public view returns (uint256[] memory) {
        return componentList;
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
    uint256[] private slaContractList;

    // Event to be emitted when a new sla Contract is created
    event SlaContractsCreatedEvent(uint256 contractId, uint256 componentId, address client, uint256 rentalDuration, uint256 rentEndTime);

    // Event to be emitted when an SLA contract is rated
    event SLAContractRatedEvent(uint256 contractId, uint8 rating);

    // Function for clients to rent a component
    function rentComponent(uint256 _componentId, uint256 _rentalDuration) public payable isClient isComponentExists(_componentId) {
        require(msg.value > 0, "Rental price must be greater than zero.");
        
        uint256 rentEndTime = block.timestamp + _rentalDuration;
        uint256 componentPrice = getComponentPrice(_componentId);
        uint256 rentPrice = componentPrice * (_rentalDuration/60);

        require(msg.value == rentPrice, "Wrong rental price");    
        
        slaContracts[contractCount] = TSLAContract({
            componentId: _componentId,
            client: msg.sender,
            rentalDuration: _rentalDuration,
            rentalPrice: msg.value,
            rentStartTime: block.timestamp,
            rentEndTime: rentEndTime,
            isCompleted: false
        });

        slaContractList.push(contractCount);

        emit SlaContractsCreatedEvent(contractCount, _componentId, msg.sender, _rentalDuration, rentEndTime);
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

    // Function to get all SLA contracts
    function getAllSLAContracts() public view returns (uint256[] memory) {
        return slaContractList;
    }
}
