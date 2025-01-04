import { ID, Account, Client } from "react-native-appwrite";

export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.blacksteel.yoru",
    projectId: "67792e1e0024e383dae4",
    databaseId: "6779308d0039d0f84011",
    userCollectionId: "677930b6002154536ef3",
    videoCollectionId: "67793101003c60d76662",
    storageId: "6779330e000a5fde565f",
};

const client = new Client();

client.setEndpoint(config.endpoint).setProject(config.projectId).setPlatform(config.platform);

const account = new Account(client);

export const createUser = () => {
    account.create(ID.unique(), "me@example.com", "password", "Jane Doe").then(
        function (response) {
            console.log(response);
        },
        function (error) {
            console.log(error);
        }
    );
};
