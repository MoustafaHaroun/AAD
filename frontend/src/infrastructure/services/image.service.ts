import {
    launchCameraAsync, launchImageLibraryAsync, PermissionStatus,
    requestCameraPermissionsAsync,
    requestMediaLibraryPermissionsAsync,
} from "expo-image-picker";
import { Linking, Platform, Alert } from "react-native";
import i18n from "@/presentation/i18n";
import type { IImageService } from "@/domain/services";

/**
 * Pick or capture images for listing attachments and avatars.
 */
export class ImageService implements IImageService {
    /**
     * Pick an image from the device's photo library.
     * @returns The picked image's local URI, or null if permission was denied or the picker was canceled.
     */
    public async pickImageFromGallery(): Promise<string | null> {
        const hasPermission = await this.requestPermissions();

        if (!hasPermission) {
            return null;
        }

        const result = await launchImageLibraryAsync({
            quality: 0.8,
        });

        if (result.canceled || result.assets.length <= 0) {
            return null;
        }

        return result.assets[0].uri;
    }

    /**
     * Capture a photo with the device's camera.
     * @returns The captured photo's local URI, or null if permission was denied or capture was canceled.
     */
    public async takePhoto(): Promise<string | null> {
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

    /**
     * Ask the user to choose between the camera and the photo library, then get an image from that source.
     * @returns The picked/captured image's local URI, or null if the user canceled at any point.
     */
    public async pickImage(): Promise<string | null> {
        const source = await new Promise<"camera" | "gallery" | null>(resolve => {
            Alert.alert(
                i18n.t("common.addPhoto"),
                undefined,
                [
                    { text: i18n.t("common.cancel"), style: "cancel", onPress: () => { resolve(null); } },
                    { text: i18n.t("common.chooseFromLibrary"), onPress: () => { resolve("gallery"); } },
                    { text: i18n.t("common.takePhoto"), onPress: () => { resolve("camera"); } },
                ],
                { onDismiss: () => { resolve(null); } },
            );
        });

        if (source === "camera") {
            return this.takePhoto();
        }

        if (source === "gallery") {
            return this.pickImageFromGallery();
        }

        return null;
    }

    /**
     * Request camera and media library permissions, prompting the user to open settings if denied.
     * @returns Whether both permissions were granted.
     */
    private async requestPermissions(): Promise<boolean> {
        const cameraPerm = await requestCameraPermissionsAsync();
        const libraryPerm = await requestMediaLibraryPermissionsAsync();

        if (cameraPerm.status !== PermissionStatus.GRANTED || libraryPerm.status !== PermissionStatus.GRANTED) {
            Alert.alert(
                i18n.t("permissions.title"),
                i18n.t("permissions.message"),
            );
            if (Platform.OS === "ios") {
                await Linking.openURL("app-settings:");
            } else {
                await Linking.openSettings();
            }

            return false;
        }

        return true;
    }
}
