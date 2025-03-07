import { Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://appwrite-os08sgw04g4swk0s8owwoooc.beamzy.net/v1')
    .setProject('project-x'); // Replace with your project ID

export const account = new Account(client);
export { ID } from 'appwrite';
// Appwrite configuration constants
export const DATABASE_ID = 'blogv1'; // Replace with your actual database ID
export const POSTS_COLLECTION_ID = 'posts'; // Collection ID for posts
export const STORAGE_BUCKET_ID = '67c9dbab003009fc0a92'; // Storage bucket ID for files/images