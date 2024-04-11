import { storage } from '../config';
import { ref, uploadBytes, UploadResult } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

export default async function uploadFile(folder: string, file: File) {
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
