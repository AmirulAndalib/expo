import React, { type ComponentType, type PropsWithChildren, type ReactElement } from 'react';
import { type ButtonProps } from 'react-native';
import { LinkProps } from './useLinkHooks';
export declare function LinkWithPreview({ experimentalPreview, children, ...rest }: LinkProps): React.JSX.Element;
interface LinkMenuItemProps {
    title: string;
    onPress: () => void;
}
export declare function LinkMenuItem(_: LinkMenuItemProps): null;
interface LinkMenuProps {
    children: ReactElement<ButtonProps | LinkMenuItemProps> | ReactElement<ButtonProps | LinkMenuItemProps>[];
}
export declare function LinkMenu({ children }: LinkMenuProps): React.JSX.Element[] | null;
interface LinkPreviewProps {
    width?: number;
    height?: number;
    children?: React.ReactNode;
    Component?: ComponentType<{
        isVisible: boolean;
    }>;
}
export declare function LinkPreview({ children, Component, width, height }: LinkPreviewProps): React.JSX.Element | null;
export declare function LinkTrigger({ children }: PropsWithChildren): React.ReactNode;
export {};
//# sourceMappingURL=LinkWithPreview.d.ts.map