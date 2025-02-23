import { Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://appwrite-os08sgw04g4swk0s8owwoooc.nestgit.com//v1')
    .setProject('project-x'); // Replace with your project ID

export const account = new Account(client);
export { ID } from 'appwrite';
