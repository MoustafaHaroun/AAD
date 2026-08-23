import * as React from "react";
import Svg, { Path } from "react-native-svg";
import { resolveIconColor, type IconProps } from "@/presentation/utils/icon.util";

/**
 * Render the "New listing" home-screen quick-action icon.
 * @param props - The props.
 * @param props.size - The icon size in pixels. Defaults to 24.
 * @param props.color - The fill color. Falls back to `style.color`, then a default.
 * @param props.style - A style prop whose `color` is used when `color` isn't given directly.
 * @returns The rendered icon.
 */
export function NewListingIcon({ size = 24, color, style }: IconProps): React.JSX.Element {
    return (
        <Svg
            fill="none"
            height={size}
            viewBox="0 0 48 48"
            width={size}
        >
            <Path
                d="M24 4C12.954 4 4 12.954 4 24C4 35.046 12.954 44 24 44C35.046 44 44 35.046 44 24C44 12.954 35.046 4 24 4ZM34 26H26V34H22V26H14V22H22V14H26V22H34V26Z"
                fill={resolveIconColor(color, style)}
            />
        </Svg>
    );
}

/**
 * Render the "My listings" home-screen quick-action icon.
 * @param props - The props.
 * @param props.size - The icon size in pixels. Defaults to 24.
 * @param props.color - The fill color. Falls back to `style.color`, then a default.
 * @param props.style - A style prop whose `color` is used when `color` isn't given directly.
 * @returns The rendered icon.
 */
export function MyListingsIcon({ size = 24, color, style }: IconProps): React.JSX.Element {
    const fill = resolveIconColor(color, style);

    return (
        <Svg
            fill="none"
            height={size}
            viewBox="0 0 48 48"
            width={size}
        >
            <Path
                d="M16 7C16 6.20435 16.3161 5.44129 16.8787 4.87868C17.4413 4.31607 18.2043 4 19 4H29C29.7956 4 30.5587 4.31607 31.1213 4.87868C31.6839 5.44129 32 6.20435 32 7V9C32 9.79565 31.6839 10.5587 31.1213 11.1213C30.5587 11.6839 29.7956 12 29 12H19C18.2043 12 17.4413 11.6839 16.8787 11.1213C16.3161 10.5587 16 9.79565 16 9V7Z"
                fill={fill}
            />

            <Path
                clipRule="evenodd"
                d="M13 8.074C10.484 8.214 8.896 8.614 7.758 9.754C6 11.512 6 14.34 6 19.996V31.996C6 37.654 6 40.482 7.758 42.24C9.514 43.996 12.344 43.996 18 43.996H30C35.656 43.996 38.486 43.996 40.242 42.24C42 40.48 42 37.654 42 31.996V19.996C42 14.34 42 11.512 40.242 9.754C39.104 8.614 37.516 8.214 35 8.074V9C35 10.5913 34.3679 12.1174 33.2426 13.2426C32.1174 14.3679 30.5913 15 29 15H19C17.4087 15 15.8826 14.3679 14.7574 13.2426C13.6321 12.1174 13 10.5913 13 9V8.074ZM12.5 21C12.5 20.6022 12.658 20.2206 12.9393 19.9393C13.2206 19.658 13.6022 19.5 14 19.5H34C34.3978 19.5 34.7794 19.658 35.0607 19.9393C35.342 20.2206 35.5 20.6022 35.5 21C35.5 21.3978 35.342 21.7794 35.0607 22.0607C34.7794 22.342 34.3978 22.5 34 22.5H14C13.6022 22.5 13.2206 22.342 12.9393 22.0607C12.658 21.7794 12.5 21.3978 12.5 21ZM14.5 28C14.5 27.6022 14.658 27.2206 14.9393 26.9393C15.2206 26.658 15.6022 26.5 16 26.5H32C32.3978 26.5 32.7794 26.658 33.0607 26.9393C33.342 27.2206 33.5 27.6022 33.5 28C33.5 28.3978 33.342 28.7794 33.0607 29.0607C32.7794 29.342 32.3978 29.5 32 29.5H16C15.6022 29.5 15.2206 29.342 14.9393 29.0607C14.658 28.7794 14.5 28.3978 14.5 28ZM16.5 35C16.5 34.6022 16.658 34.2206 16.9393 33.9393C17.2206 33.658 17.6022 33.5 18 33.5H30C30.3978 33.5 30.7794 33.658 31.0607 33.9393C31.342 34.2206 31.5 34.6022 31.5 35C31.5 35.3978 31.342 35.7794 31.0607 36.0607C30.7794 36.342 30.3978 36.5 30 36.5H18C17.6022 36.5 17.2206 36.342 16.9393 36.0607C16.658 35.7794 16.5 35.3978 16.5 35Z"
                fill={fill}
                fillRule="evenodd"
            />
        </Svg>
    );
}

/**
 * Render the "Chats" home-screen quick-action icon.
 * @param props - The props.
 * @param props.size - The icon size in pixels. Defaults to 24.
 * @param props.color - The fill color. Falls back to `style.color`, then a default.
 * @param props.style - A style prop whose `color` is used when `color` isn't given directly.
 * @returns The rendered icon.
 */
export function ChatsIcon({ size = 24, color, style }: IconProps): React.JSX.Element {
    return (
        <Svg
            fill="none"
            height={size}
            viewBox="0 0 48 48"
            width={size}
        >
            <Path
                d="M12 36L7.4 40.6C6.76667 41.2333 6.04133 41.3753 5.224 41.026C4.40667 40.6767 3.99867 40.0513 4 39.15V8C4 6.9 4.392 5.95867 5.176 5.176C5.96 4.39333 6.90133 4.00133 8 4H40C41.1 4 42.042 4.392 42.826 5.176C43.61 5.96 44.0013 6.90133 44 8V32C44 33.1 43.6087 34.042 42.826 34.826C42.0433 35.61 41.1013 36.0013 40 36H12ZM14 28H26C26.5667 28 27.042 27.808 27.426 27.424C27.81 27.04 28.0013 26.5653 28 26C27.9987 25.4347 27.8067 24.96 27.424 24.576C27.0413 24.192 26.5667 24 26 24H14C13.4333 24 12.9587 24.192 12.576 24.576C12.1933 24.96 12.0013 25.4347 12 26C11.9987 26.5653 12.1907 27.0407 12.576 27.426C12.9613 27.8113 13.436 28.0027 14 28ZM14 22H34C34.5667 22 35.042 21.808 35.426 21.424C35.81 21.04 36.0013 20.5653 36 20C35.9987 19.4347 35.8067 18.96 35.424 18.576C35.0413 18.192 34.5667 18 34 18H14C13.4333 18 12.9587 18.192 12.576 18.576C12.1933 18.96 12.0013 19.4347 12 20C11.9987 20.5653 12.1907 21.0407 12.576 21.426C12.9613 21.8113 13.436 22.0027 14 22ZM14 16H34C34.5667 16 35.042 15.808 35.426 15.424C35.81 15.04 36.0013 14.5653 36 14C35.9987 13.4347 35.8067 12.96 35.424 12.576C35.0413 12.192 34.5667 12 34 12H14C13.4333 12 12.9587 12.192 12.576 12.576C12.1933 12.96 12.0013 13.4347 12 14C11.9987 14.5653 12.1907 15.0407 12.576 15.426C12.9613 15.8113 13.436 16.0027 14 16Z"
                fill={resolveIconColor(color, style)}
            />
        </Svg>
    );
}

/**
 * Render the "Account" home-screen quick-action icon.
 * @param props - The props.
 * @param props.size - The icon size in pixels. Defaults to 24.
 * @param props.color - The fill color. Falls back to `style.color`, then a default.
 * @param props.style - A style prop whose `color` is used when `color` isn't given directly.
 * @returns The rendered icon.
 */
export function AccountIcon({ size = 24, color, style }: IconProps): React.JSX.Element {
    return (
        <Svg
            fill="none"
            height={size}
            viewBox="0 0 33 38"
            width={size}
        >
            <Path
                d="M16.5 19C19.0006 19 21.3988 18.0066 23.167 16.2384C24.9352 14.4702 25.9286 12.072 25.9286 9.57143C25.9286 7.07082 24.9352 4.67262 23.167 2.90442C21.3988 1.13622 19.0006 0.142857 16.5 0.142857C13.9994 0.142857 11.6012 1.13622 9.83299 2.90442C8.06479 4.67262 7.07143 7.07082 7.07143 9.57143C7.07143 12.072 8.06479 14.4702 9.83299 16.2384C11.6012 18.0066 13.9994 19 16.5 19ZM13.1337 22.5357C5.87813 22.5357 0 28.4138 0 35.6694C0 36.8775 0.979688 37.8571 2.18772 37.8571H30.8123C32.0203 37.8571 33 36.8775 33 35.6694C33 28.4138 27.1219 22.5357 19.8663 22.5357H13.1337Z"
                fill={resolveIconColor(color, style)}
            />
        </Svg>
    );
}
