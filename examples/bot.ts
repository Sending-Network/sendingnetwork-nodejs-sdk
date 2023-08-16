import {
    LogLevel,
    LogService,
    SDNAuth,
    SDNClient,
    RichConsoleLogger,
    SimpleFsStorageProvider,
} from "../src";
import { execCommand } from "./commands";

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import * as fs from 'fs/promises'
import Web3 from 'web3'

LogService.setLogger(new RichConsoleLogger());
LogService.setLevel(LogLevel.INFO);
LogService.muteModule("Metrics");
LogService.trace = LogService.debug;

const configFilePath = "./examples/storage/bot.creds.json"
const storage = new SimpleFsStorageProvider("./examples/storage/bot.json");

async function login(nodeUrl: string, address: string, key: string, developerKey: string): Promise<string> {
    const auth = new SDNAuth(nodeUrl)
    let loginMessage = await auth.didPreLogin(address)
    let web3 = new Web3()
    // sign with wallet account key
    let walletSignature = web3.eth.accounts.sign(loginMessage["message"], key)
    // sign with developer key (add '0x' prefix if necessary)
    let developerKeySignature = web3.eth.accounts.sign(loginMessage["message"], developerKey)
    //did login
    let loginResp = await auth.didLoginWithAppToken(address,
        loginMessage["did"], loginMessage["message"], walletSignature["signature"], developerKeySignature["signature"],
        loginMessage["random_server"], loginMessage["updated"])
    return loginResp["access_token"]
}

(async function () {
    let configRaw = await fs.readFile(configFilePath)
    let configJson = JSON.parse(configRaw.toString())

    let nodeUrl = configJson['nodeUrl']
    let walletAddress = configJson['walletAddress']
    let privateKey = configJson['privateKey']
    let developerKey = configJson['developerKey']
    let accessToken = configJson['accessToken']
    if(accessToken == "" || accessToken == undefined) {
        accessToken = await login(nodeUrl, walletAddress, privateKey, developerKey)
        configJson["accessToken"] = accessToken
        fs.writeFile(configFilePath, JSON.stringify(configJson, null, 4))
    }

    const client = new SDNClient(nodeUrl, accessToken, storage);

    // register message listener
    client.on("room.message", async (roomId: string, event: any) => {
        LogService.info("index", roomId, event);
    });

    // start syncing
    await client.start();

    const rl = readline.createInterface({ input, output });
    while(true) {
        const inputCommand = await rl.question('[input command]');
        await execCommand(client, inputCommand)
    }
    rl.close();
})();