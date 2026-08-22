import ComingSoonScreen from "@/presentation/screens/coming-soon.screen";
import * as React from "react";

/**
 * Render the Privacy & Security route as a coming-soon placeholder.
 * @returns The rendered coming-soon screen.
 */
export default function Screen(): React.JSX.Element {
    return <ComingSoonScreen titleKey="account.menu.privacy" />;
}
