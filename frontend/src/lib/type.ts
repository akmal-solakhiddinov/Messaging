



// type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

export type MessageType = {
    id: string;
    content: string;
    file: string | null;
    fileType: string | null;
    senderId: string;
    receiverId: string;
    chatId: string;
    status: 'unseen' | 'seen';
    created: string;
    updated: string;
    deleted: boolean;
    sender: {
        id: string;
        username: string;
        fullName: string;
    }
}


/* 
id content file fileType | senderId receiverId chatId  created  updated deleted 

*/


/* 
{
    "id": "5d463f14-c18f-4ee1-86ea-81534ee5ec85",
    "email": "akmal@gmail.com",
    "username": null,
    "fullName": "Akmal Solakhiddinov",
    "status": "offline",
    "lastLogin": null,
    "password": "$2b$10$znKeSetSofO7LV9kPcABhOgeo19lCChzBzDehbNK8tev5R27Vuqeu",
    "image": null,
    "created": "2024-08-06T15:36:34.933Z",
    "updated": "2024-08-06T15:36:34.933Z",
    "deleted": false,
    "account": "public"
}
*/

export type UserType = {
    id: string;
    username?: string;
    fullName: string;
    email: string;
    image: string;
    account: 'public' | 'private';
    status: 'offline' | 'online';
    lastLogin: string;
    isActivated: boolean;
    chatRoomId?: string,
}




// Define the type for a User
// interface User {
//     id: string;
//     username: string | null;
//     fullName: string;
//     status: string;
//     image: string;
//     lastLogin: string | null;
//   }

// Define the type for a Message Sender
//   interface Sender {
//     id: string;
//     username: string | null;
//     fullName: string;
//   }

//   // Define the type for a Message
//   interface Message {
// id: string;
// content: string;
// file: string | null;
// fileType: string | null;
// senderId: string;
// receiverId: string;
// chatId: string;
// status: string;
// created: string;
// updated: string;
// deleted: boolean;
// sender: Sender;
//   }

// Define the type for the Main Data


export type RequestType = {
    id: string;
    senderId: string;
    friendId: string;
    status: 'approved' | 'rejected' | 'pending';
    created: string;
    updated: string;
    sender: UserType
}
