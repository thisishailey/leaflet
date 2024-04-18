import { storage } from '../config';
import { ref, uploadBytes, type UploadResult } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import type { ImageFolders } from './directory';

export default async function uploadFile(folder: ImageFolders, file: File) {
    const uniqueId = uuidv4();
    const imageUrl = `/${folder}/${uniqueId}/${file.name}`;
    const storageRef = ref(storage, imageUrl);

    let result: UploadResult | null = null,
        error: Error | null = null;

    try {
        result = await uploadBytes(storageRef, file);
    } catch (e) {
        error = e as Error;
    }

    return { result, error, imageUrl };
}
