import { ScrollViewStyleReset } from "expo-router/html";
import type { PropsWithChildren } from "react";

// This file is web-only and used to configure the root HTML for every
// Web page during static rendering.
// The contents of this function only run in Node.js environments and
// Do not have access to the DOM or browser APIs.
/**
 *
 * @param root0
 * @param root0.children
 */
export default function Root({ children }: PropsWithChildren) {
    return (
        <html
            className="bg-background"
            lang="en"
        >
            <head>
                <meta charSet="utf-8" />

                <meta
                    content="IE=edge"
                    httpEquiv="X-UA-Compatible"
                />

                <meta
                    content="width=device-width, initial-scale=1, shrink-to-fit=no"
                    name="viewport"
                />

                {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
                <ScrollViewStyleReset />

                {/* Add any additional <head> elements that you want globally available on web... */}
            </head>

            <body>{children}</body>
        </html>
    );
}
