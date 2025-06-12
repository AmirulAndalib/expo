"use strict";
'use client';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkWithPreview = LinkWithPreview;
exports.LinkMenuItem = LinkMenuItem;
exports.LinkMenu = LinkMenu;
exports.LinkPreview = LinkPreview;
exports.LinkTrigger = LinkTrigger;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const hooks_1 = require("../hooks");
const BaseExpoRouterLink_1 = require("./BaseExpoRouterLink");
const Link_1 = require("./Link");
const HrefPreview_1 = require("./preview/HrefPreview");
const LinkPreviewContext_1 = require("./preview/LinkPreviewContext");
const native_1 = require("./preview/native");
const useScreenPreload_1 = require("./preview/useScreenPreload");
const url_1 = require("../utils/url");
const PreviewRouteContext_1 = require("./preview/PreviewRouteContext");
const InternalLinkPreviewContext = (0, react_1.createContext)(undefined);
function LinkWithPreview({ experimentalPreview, children, ...rest }) {
    const router = (0, hooks_1.useRouter)();
    const { setIsPreviewOpen } = (0, LinkPreviewContext_1.useLinkPreviewContext)();
    const [isCurrentPreviewOpen, setIsCurrenPreviewOpen] = (0, react_1.useState)(false);
    const { preload, updateNavigationKey, navigationKey } = (0, useScreenPreload_1.useScreenPreload)(rest.href);
    (0, react_1.useEffect)(() => {
        if ((0, url_1.shouldLinkExternally)(String(rest.href))) {
            console.warn('External links previews are not supported');
        }
        if (rest.replace) {
            console.warn('Using replace links with preview is not supported');
        }
    }, [rest.href, rest.replace]);
    const triggerElement = react_1.default.useMemo(() => getFirstChildOfType(children, LinkTrigger), [children]);
    const menuElement = react_1.default.useMemo(() => getFirstChildOfType(children, LinkMenu), [children]);
    const previewElement = react_1.default.useMemo(() => getFirstChildOfType(children, LinkPreview), [children]);
    const trigger = react_1.default.useMemo(() => triggerElement ??
        react_1.default.Children.toArray(children).filter((child) => !(0, react_1.isValidElement)(child) ||
            ![Link_1.Link.Menu, Link_1.Link.Trigger, Link_1.Link.Preview].includes(child.type)), [triggerElement, children]);
    const buttons = react_1.default.useMemo(() => menuElement?.props.children
        ? Array.isArray(menuElement?.props.children)
            ? menuElement.props.children
            : [menuElement?.props.children]
        : [], [menuElement]);
    const actionsHandlers = react_1.default.useMemo(() => buttons
        .filter((button) => (0, react_1.isValidElement)(button) && (button.type === react_native_1.Button || button.type === LinkMenuItem))
        .reduce((acc, action) => ({
        ...acc,
        [action.props.title]: action.props.onPress,
    }), {}), [buttons]);
    const preview = react_1.default.useMemo(() => previewElement ?? <LinkPreview />, [previewElement, rest.href]);
    if ((0, url_1.shouldLinkExternally)(String(rest.href)) || rest.replace) {
        return <BaseExpoRouterLink_1.BaseExpoRouterLink children={children} {...rest}/>;
    }
    return (<native_1.PeekAndPopView nextScreenId={navigationKey} onActionSelected={({ nativeEvent: { id } }) => {
            actionsHandlers[id]?.();
        }} onWillPreviewOpen={() => {
            preload();
            setIsPreviewOpen(true);
            setIsCurrenPreviewOpen(true);
        }} onDidPreviewOpen={() => {
            updateNavigationKey();
        }} onPreviewWillClose={() => { }} onPreviewDidClose={() => {
            setIsPreviewOpen(false);
            setIsCurrenPreviewOpen(false);
        }} onPreviewTapped={() => {
            router.navigate(rest.href, { __internal__PreviewKey: navigationKey });
        }}>
      <InternalLinkPreviewContext value={{ isVisible: isCurrentPreviewOpen, href: rest.href }}>
        <native_1.PeekAndPopTriggerView>
          <BaseExpoRouterLink_1.BaseExpoRouterLink {...rest} children={trigger} ref={rest.ref}/>
        </native_1.PeekAndPopTriggerView>
        {preview}
        {menuElement}
      </InternalLinkPreviewContext>
    </native_1.PeekAndPopView>);
}
function getFirstChildOfType(children, type) {
    return react_1.default.Children.toArray(children).find((child) => (0, react_1.isValidElement)(child) && child.type === type);
}
function LinkMenuItem(_) {
    return null;
}
function LinkMenu({ children }) {
    if ((0, PreviewRouteContext_1.useIsPreview)()) {
        return null;
    }
    return react_1.default.Children.map(children, (child) => {
        if ((0, react_1.isValidElement)(child) && (child.type === react_native_1.Button || child.type === LinkMenuItem)) {
            return <native_1.PeekAndPopActionView title={child.props.title} id={child.props.title}/>;
        }
        return null;
    });
}
function LinkPreview({ children, Component, width, height }) {
    if ((0, PreviewRouteContext_1.useIsPreview)()) {
        return null;
    }
    const { isVisible, href } = (0, react_1.use)(InternalLinkPreviewContext);
    const contentSize = {
        width: width ?? 0,
        height: height ?? 0,
    };
    let content;
    if (Component) {
        content = <Component isVisible={isVisible}/>;
    }
    else if (children) {
        content = children;
    }
    else {
        content = isVisible ? <HrefPreview_1.HrefPreview href={href}/> : null;
    }
    return (<native_1.PeekAndPopPreviewView preferredContentSize={contentSize}>{content}</native_1.PeekAndPopPreviewView>);
}
function LinkTrigger({ children }) {
    return children;
}
//# sourceMappingURL=LinkWithPreview.js.map