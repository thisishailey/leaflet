import { storage } from '../config';
import { ref, getDownloadURL } from 'firebase/storage';

export default async function getFile(imageUrl: string) {
    let result: string | null = null,
        error: Error | null = null;

    try {
        result = await getDownloadURL(ref(storage, imageUrl));
    } catch (e) {
        error = e as Error;
    }

    return { result, error };
}
