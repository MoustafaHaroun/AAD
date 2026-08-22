import * as React from "react";
import Layout from "@/presentation/components/containers/layout";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from "expo-router";

/**
 * Render the app's root layout.
 * @returns The rendered root layout.
 */
export default function RootLayout(): React.JSX.Element {
    return (
        <Layout />
    );
}
