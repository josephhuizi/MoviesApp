import { Client, Account, ID } from 'react-native-appwrite';

const config = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.jsm.aora',
    projectId: '66fc98440034981cfdca',
    databaseId: '66fcb00600298da93c49',
    userCollectionId: '66fcb0710032001d51b7',
    videoCollectionId: '66fcb09d000333b7c921',
    storageId: '66fcb6d2000434b61381'
}

const client = new Client();
client.setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        );

        if(!newAccount) throw Error;


    } catch (error) {
        console.log(error);
        throw new Error('Error creating user');
    }
}



