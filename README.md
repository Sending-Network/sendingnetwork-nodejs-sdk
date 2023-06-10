# sendingnetwork-bot-sdk

A NodeJS Bot SDK for SendingNetwork.

## Usage
### Add dependency
```shell
npm i sendingnetwork-bot-sdk
```

### Prepare a configuration file
Provide server node url, wallet address and private key in file bot.creds.json:
```json
{
    "nodeUrl": "https://example.com",
    "walletAddress": "",
    "privateKey": ""
}
```

### Create an instance of `SDNClient`
After reading the configuration file, create an instance of `SDNClient`. Register event listener and start syncing.
```typescript
// preLogin to get message to sign
let auth = new SDNAuth(nodeUrl)
let loginMessage = await auth.didPreLogin(address)

// sign message
let web3 = new Web3()
web3.eth.accounts.wallet.add(key);
let signature = await web3.eth.sign(loginMessage["message"], address)

// didLogin to get access token
let loginResp = await auth.didLogin(
    loginMessage["did"], loginMessage["message"], signature["signature"], 
    loginMessage["random_server"], loginMessage["updated"])
let accessToken = loginResp["access_token"]

// create SDNClient with a storage file
let storage = new SimpleFsStorageProvider("/path/to/bot/storage/file");
let client = new SDNClient(nodeUrl, accessToken, storage);

// register message listener
client.on("room.message", async (roomId: string, event: any) => {
    LogService.info("index", roomId, event);
});

// start syncing
await client.start();
```

### Call API functions
```typescript
// create new room
await client.createRoom({name: roomName})

// invite user to the room
await client.inviteUser(inviteUserId, inviteRoomId)

// send room message
await client.sendText(sendRoomId, "hello world")
```

## Examples
See more use cases in `examples` directory.

## License
Apache 2.0