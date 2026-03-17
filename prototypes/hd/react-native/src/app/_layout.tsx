import Layout from "@/presentation/components/containers/layout";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

/**
 * Render the RootLayout.
 * @returns The RootLayout component.
 */
export default function RootLayout() {
    return (
        <Layout />
    );
}
