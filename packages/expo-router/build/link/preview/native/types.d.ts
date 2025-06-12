import { ViewProps } from 'react-native';
export interface PeekAndPopPreviewViewProps extends ViewProps {
    preferredContentSize?: {
        width: number;
        height: number;
    };
}
export interface PeekAndPopTriggerViewProps extends ViewProps {
}
export interface PeekAndPopActionViewProps {
    title: string;
    id: string;
}
export interface PeekAndPopViewProps extends ViewProps {
    nextScreenId: string | undefined;
    onActionSelected?: (event: {
        nativeEvent: {
            id: string;
        };
    }) => void;
    onWillPreviewOpen?: () => void;
    onDidPreviewOpen?: () => void;
    onPreviewWillClose?: () => void;
    onPreviewDidClose?: () => void;
    onPreviewTapped?: () => void;
    children: React.ReactNode;
}
//# sourceMappingURL=types.d.ts.map