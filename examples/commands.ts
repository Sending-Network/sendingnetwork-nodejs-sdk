import {SDNClient} from "../src";


/* Commands:
"room list -- List rooms"
"room create <name> -- Create new room"
"room invite <roomId> <userId> -- Invite user to room"
"room join <roomId> -- Join room by id"
"room kick <roomId> <userId> -- Kick user by userId"
"room leave <roomId> -- Leave room by id"
"room members <roomId> -- List room members"
"room send <roomId> <message text> -- Send a text message"
*/
export async function execCommand(client: SDNClient, command: string): Promise<boolean> {
    let cmdParts = command.split(/\s/)
    if(cmdParts.length < 2) {
        return false
    }
    if(cmdParts[0] != "room") {
        return false
    }

    let action = cmdParts[1]
    switch (action) {
        case "list":
            let rooms = await client.getJoinedRooms()
            console.log(rooms)
            break;
        case "members":
            let roomId = cmdParts[2]
            let membershipEvents = await client.getRoomMembersByMembership(roomId, "join")
            let memberIds = membershipEvents.map(event => event.membershipFor)
            console.log(memberIds)
            break
        case "create":
            let roomName = cmdParts[2]
            let createRoomId = await client.createRoom({name: roomName})
            console.log(createRoomId)
            break;
        case "invite":
            let inviteRoomId = cmdParts[2]
            let inviteUserId = cmdParts[3]
            await client.inviteUser(inviteUserId, inviteRoomId)
            console.log("invite success!")
            break;
        case "kick":
            let kickRoomId = cmdParts[2]
            let kickUserId = cmdParts[3]
            await client.kickUser(kickUserId, kickRoomId)
            console.log("kick success!")
            break;
        case "join":
            let joinRoomId = cmdParts[2]
            await client.joinRoom(joinRoomId)
            console.log("join success!")
            break;
        case "leave":
            let leaveRoomId = cmdParts[2]
            await client.leaveRoom(leaveRoomId)
            console.log("leave success!")
            break;
        case "send":
            let sendRoomId = cmdParts[2]
            let message = cmdParts[3]
            let eventId = await client.sendText(sendRoomId, message)
            console.log(eventId)
            break;
        default:
            console.log("unknown command")
            break
    }

    return true
}