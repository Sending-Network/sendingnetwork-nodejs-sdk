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

async function login(nodeUrl: string, address: string, key: string): Promise<string> {
    const auth = new SDNAuth(nodeUrl)
    let loginMessage = await auth.didPreLogin(address)
    let web3 = new Web3()
    web3.eth.accounts.wallet.add(key);
    const signature = await web3.eth.sign(loginMessage["message"], address)
    let loginResp = await auth.didLogin(
        loginMessage["did"], loginMessage["message"], signature["signature"], 
        loginMessage["random_server"], loginMessage["updated"])
    return loginResp["access_token"]
}

(async function () {
    let configRaw = await fs.readFile(configFilePath)
    let configJson = JSON.parse(configRaw.toString())

    let nodeUrl = configJson['nodeUrl']
    let walletAddress = configJson['walletAddress']
    let privateKey = configJson['privateKey']
    let accessToken = configJson['accessToken']
    if(accessToken == "") {
        accessToken = await login(nodeUrl, walletAddress, privateKey)
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