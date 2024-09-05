



// type MessageType = 'text' | 'image' | 'video' | 'audio' | 'file';

export type MessageType = {
    id: string;
    content?: string;
    file?: string;
    fileType?: string,
    created: string,
    updated: string,
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
}