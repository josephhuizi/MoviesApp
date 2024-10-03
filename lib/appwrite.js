import {Account, Avatars, Client, Databases, ID, Query} from 'react-native-appwrite';

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
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username,
        );

        if(!newAccount) throw new Error();

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password);

        return await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        );

    } catch (error) {
        console.log(error);
        throw new Error('Error creating user');
    }
}

export const signIn = async(email, password) => {
    try {
        return await account.createEmailPasswordSession(email, password);
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
        );

        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}



