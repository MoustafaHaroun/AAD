import {
    MediaTypeOptions,
    launchCameraAsync,
    launchImageLibraryAsync,
    requestCameraPermissionsAsync,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { Paths, File, Directory } from "expo-file-system";
import { Linking, Platform, Alert } from "react-native";
import type { IImageService } from "@/domain/services";

export class ImageService implements IImageService {
    private async requestPermissions(): Promise<boolean> {
        const cameraPerm = await requestCameraPermissionsAsync();
        const libraryPerm = await requestMediaLibraryPermissionsAsync();

        if (cameraPerm.status !== "granted" || libraryPerm.status !== "granted") {
            Alert.alert(
                "Permissions required",
                "Camera and gallery access are needed.",
            );
            if (Platform.OS === "ios") {
                Linking.openURL("app-settings:");
            } else {
                Linking.openSettings();
            }

            return false;
        }

        return true;
    }

    async pickImageFromGallery(): Promise<string | null> {
        const hasPermission = await this.requestPermissions();

        if (!hasPermission) { return null; }

        const result = await ImagePickerlaunchImageLibraryAsync({
            mediaTypes: MediaTypeOptions.Images,
            quality: 0.8,
        });

        if (result.canceled || !result.assets.length) { return null; }

        return result.assets[0].uri;
    }

    async takePhoto(): Promise<string | null> {
        const hasPermission = await this.requestPermissions();

        if (!hasPermission) {
            return null;
        }

        const result = await launchCameraAsync({
            quality: 0.8,
        });

        if (result.canceled || result.assets.length <= 0) {
            return null;
        }

        return result.assets[0].uri;
    }

    async saveImageLocally(uri: string): Promise<string> {
    }

    public async deleteLocalImage(uri: string): Promise<string | null> {
    }
}
