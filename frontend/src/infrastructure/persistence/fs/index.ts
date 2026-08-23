import { File, Paths } from "expo-file-system";

/**
 * Copy a file
 * @param uri - The uri of the file.
 * @param destination - The location to copy to.
 * @returns The uri as string if successful or null if the file doesn't exist.
 */
function copyFile(uri: string, destination: File): string | null {
    const file = new File(uri);

    if (!file.exists) {
        return null;
    }

    if (!destination.exists) {
        file.copy(destination);
    }

    return destination.uri;
}

/**
 * Copy a file to the persistent document directory.
 * @param uri - The uri of the file.
 * @returns The uri as string if successful or null if the file doesn't exist.
 */
export function copyFileToDocument(uri: string): string | null {
    const fileName = uri.split("/").pop();

    if (fileName == null || fileName === "") {
        return null;
    }

    return copyFile(uri, new File(Paths.document, fileName));
}

/**
 * Copy a file to the cache directory.
 * @param uri - The uri of the file.
 * @returns The uri as string if successful or null if the file doesn't exist.
 */
export function copyFileToCache(uri: string): string | null {
    const fileName = uri.split("/").pop();

    if (fileName == null || fileName === "") {
        return null;
    }

    return copyFile(uri, new File(Paths.cache, fileName));
}

/**
 * Remove a file from the persistent document storage.
 * @param uri - The uri of the file
 * @returns The uri as string if successful or null if file never existed.
 */
export function removeFileFromDocument(uri: string): string | null {
    const file = new File(uri);

    if (!file.exists) {
        return null;
    }

    file.delete();

    return file.uri;
}
