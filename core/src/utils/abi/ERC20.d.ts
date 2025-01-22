export declare const ERC20Abi: readonly [
    {
        readonly type: "constructor";
        readonly inputs: readonly [
            {
                readonly name: "name_";
                readonly type: "string";
                readonly internalType: "string";
            },
            {
                readonly name: "symbol_";
                readonly type: "string";
                readonly internalType: "string";
            },
        ];
        readonly stateMutability: "nonpayable";
    },
    {
        readonly type: "function";
        readonly name: "allowance";
        readonly inputs: readonly [
            {
                readonly name: "owner";
                readonly type: "address";
                readonly internalType: "address";
            },
            {
                readonly name: "spender";
                readonly type: "address";
                readonly internalType: "address";
            },
        ];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly stateMutability: "view";
    },
    {
        readonly type: "function";
        readonly name: "approve";
        readonly inputs: readonly [
            {
                readonly name: "spender";
                readonly type: "address";
                readonly internalType: "address";
            },
            {
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            },
        ];
        readonly stateMutability: "nonpayable";
    },
    {
        readonly type: "function";
        readonly name: "balanceOf";
        readonly inputs: readonly [
            {
                readonly name: "account";
                readonly type: "address";
                readonly internalType: "address";
            },
        ];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly stateMutability: "view";
    },
    {
        readonly type: "function";
        readonly name: "decimals";
        readonly inputs: readonly [];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "uint8";
                readonly internalType: "uint8";
            },
        ];
        readonly stateMutability: "view";
    },
    {
        readonly type: "function";
        readonly name: "decreaseAllowance";
        readonly inputs: readonly [
            {
                readonly name: "spender";
                readonly type: "address";
                readonly internalType: "address";
            },
            {
                readonly name: "subtractedValue";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            },
        ];
        readonly stateMutability: "nonpayable";
    },
    {
        readonly type: "function";
        readonly name: "increaseAllowance";
        readonly inputs: readonly [
            {
                readonly name: "spender";
                readonly type: "address";
                readonly internalType: "address";
            },
            {
                readonly name: "addedValue";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            },
        ];
        readonly stateMutability: "nonpayable";
    },
    {
        readonly type: "function";
        readonly name: "name";
        readonly inputs: readonly [];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "string";
                readonly internalType: "string";
            },
        ];
        readonly stateMutability: "view";
    },
    {
        readonly type: "function";
        readonly name: "symbol";
        readonly inputs: readonly [];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "string";
                readonly internalType: "string";
            },
        ];
        readonly stateMutability: "view";
    },
    {
        readonly type: "function";
        readonly name: "totalSupply";
        readonly inputs: readonly [];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly stateMutability: "view";
    },
    {
        readonly type: "function";
        readonly name: "transfer";
        readonly inputs: readonly [
            {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            },
            {
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            },
        ];
        readonly stateMutability: "nonpayable";
    },
    {
        readonly type: "function";
        readonly name: "transferFrom";
        readonly inputs: readonly [
            {
                readonly name: "from";
                readonly type: "address";
                readonly internalType: "address";
            },
            {
                readonly name: "to";
                readonly type: "address";
                readonly internalType: "address";
            },
            {
                readonly name: "amount";
                readonly type: "uint256";
                readonly internalType: "uint256";
            },
        ];
        readonly outputs: readonly [
            {
                readonly name: "";
                readonly type: "bool";
                readonly internalType: "bool";
            },
        ];
        readonly stateMutability: "nonpayable";
    },
    {
        readonly type: "event";
        readonly name: "Approval";
        readonly inputs: readonly [
            {
                readonly name: "owner";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            },
            {
                readonly name: "spender";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            },
            {
                readonly name: "value";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            },
        ];
        readonly anonymous: false;
    },
    {
        readonly type: "event";
        readonly name: "Transfer";
        readonly inputs: readonly [
            {
                readonly name: "from";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            },
            {
                readonly name: "to";
                readonly type: "address";
                readonly indexed: true;
                readonly internalType: "address";
            },
            {
                readonly name: "value";
                readonly type: "uint256";
                readonly indexed: false;
                readonly internalType: "uint256";
            },
        ];
        readonly anonymous: false;
    },
];
