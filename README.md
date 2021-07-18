# FSMStorage

for storing FSMs data and user accounts

## start the storage

```bash
$ npm install

$ npm run start
```

## Three main dirs

### 1. /models

    The stateDiagram.js file is used to declare what keys or properties
    a piece of fsm data should have as well as their type:

    **accountName**: the account that a fsm data corresponding to
    **entityName**: the entityName of a fsm
    **data**: a whole string describing the fsm data

    The users.js file is used to declare what keys or properties
    a account should have as well as their type:

    **accountName**: the accountName
    **email**: email address from the user
    **password**: just a password to validate
    **data**: used to store a set of fsm entityName belonging to the account
    **userStatus**: to mark the status of the user account, not really used so far

### 2. /routers

    account.js file is used to handle the request about account
    including login, register, get user info;

    data.js file is used to handle the request about fsm data operations
    basically is CRUD;

### 3. /authorization

    Expose the API of generating a token and verifying a token.
