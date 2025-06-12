'use client';

import React, {
  createContext,
  isValidElement,
  use,
  useEffect,
  useState,
  type ComponentType,
  type PropsWithChildren,
  type ReactElement,
} from 'react';
import { Button, type ButtonProps } from 'react-native';

import { useRouter } from '../hooks';
import { BaseExpoRouterLink } from './BaseExpoRouterLink';
import { Link } from './Link';
import { HrefPreview } from './preview/HrefPreview';
import { useLinkPreviewContext } from './preview/LinkPreviewContext';
import {
  PeekAndPopActionView,
  PeekAndPopPreviewView,
  PeekAndPopTriggerView,
  PeekAndPopView,
} from './preview/native';
import { useScreenPreload } from './preview/useScreenPreload';
import { LinkProps } from './useLinkHooks';
import { shouldLinkExternally } from '../utils/url';
import { useIsPreview } from './preview/PreviewRouteContext';

const InternalLinkPreviewContext = createContext<
  { isVisible: boolean; href: LinkProps['href'] } | undefined
>(undefined);

export function LinkWithPreview({ experimentalPreview, children, ...rest }: LinkProps) {
  const router = useRouter();
  const { setIsPreviewOpen } = useLinkPreviewContext();
  const [isCurrentPreviewOpen, setIsCurrenPreviewOpen] = useState(false);

  const { preload, updateNavigationKey, navigationKey } = useScreenPreload(rest.href);

  useEffect(() => {
    if (shouldLinkExternally(String(rest.href))) {
      console.warn('External links previews are not supported');
    }
    if (rest.replace) {
      console.warn('Using replace links with preview is not supported');
    }
  }, [rest.href, rest.replace]);

  const triggerElement = React.useMemo(
    () => getFirstChildOfType(children, LinkTrigger),
    [children]
  );
  const menuElement = React.useMemo(() => getFirstChildOfType(children, LinkMenu), [children]);
  const previewElement = React.useMemo(
    () => getFirstChildOfType(children, LinkPreview),
    [children]
  );

  const trigger = React.useMemo(
    () =>
      triggerElement ??
      React.Children.toArray(children).filter(
        (child) =>
          !isValidElement(child) ||
          !([Link.Menu, Link.Trigger, Link.Preview] as unknown[]).includes(child.type)
      ),
    [triggerElement, children]
  );
  const buttons = React.useMemo(
    () =>
      menuElement?.props.children
        ? Array.isArray(menuElement?.props.children)
          ? menuElement.props.children
          : [menuElement?.props.children]
        : [],
    [menuElement]
  );

  const actionsHandlers = React.useMemo(
    () =>
      buttons
        .filter(
          (button) =>
            isValidElement(button) && (button.type === Button || button.type === LinkMenuItem)
        )
        .reduce(
          (acc, action) => ({
            ...acc,
            [action.props.title]: action.props.onPress as () => void,
          }),
          {} as Record<string, () => void>
        ),
    [buttons]
  );
  const preview = React.useMemo(
    () => previewElement ?? <LinkPreview />,
    [previewElement, rest.href]
  );

  if (shouldLinkExternally(String(rest.href)) || rest.replace) {
    return <BaseExpoRouterLink children={children} {...rest} />;
  }

  return (
    <PeekAndPopView
      nextScreenId={navigationKey}
      onActionSelected={({ nativeEvent: { id } }) => {
        actionsHandlers[id]?.();
      }}
      onWillPreviewOpen={() => {
        preload();
        setIsPreviewOpen(true);
        setIsCurrenPreviewOpen(true);
      }}
      onDidPreviewOpen={() => {
        updateNavigationKey();
      }}
      onPreviewWillClose={() => {}}
      onPreviewDidClose={() => {
        setIsPreviewOpen(false);
        setIsCurrenPreviewOpen(false);
      }}
      onPreviewTapped={() => {
        router.navigate(rest.href, { __internal__PreviewKey: navigationKey });
      }}>
      <InternalLinkPreviewContext value={{ isVisible: isCurrentPreviewOpen, href: rest.href }}>
        <PeekAndPopTriggerView>
          <BaseExpoRouterLink {...rest} children={trigger} ref={rest.ref} />
        </PeekAndPopTriggerView>
        {preview}
        {menuElement}
      </InternalLinkPreviewContext>
    </PeekAndPopView>
  );
}

function getFirstChildOfType<PropsT>(
  children: React.ReactNode | React.ReactNode[],
  type: (props: PropsT) => unknown
) {
  return React.Children.toArray(children).find(
    (child): child is ReactElement<PropsT> => isValidElement(child) && child.type === type
  );
}

interface LinkMenuItemProps {
  title: string;
  onPress: () => void;
}

export function LinkMenuItem(_: LinkMenuItemProps) {
  return null;
}
interface LinkMenuProps {
  children:
    | ReactElement<ButtonProps | LinkMenuItemProps>
    | ReactElement<ButtonProps | LinkMenuItemProps>[];
}

export function LinkMenu({ children }: LinkMenuProps) {
  if (useIsPreview()) {
    return null;
  }
  return React.Children.map(children, (child) => {
    if (isValidElement(child) && (child.type === Button || child.type === LinkMenuItem)) {
      return <PeekAndPopActionView title={child.props.title} id={child.props.title} />;
    }
    return null;
  });
}

interface LinkPreviewProps {
  width?: number;
  height?: number;
  children?: React.ReactNode;
  Component?: ComponentType<{ isVisible: boolean }>;
}

export function LinkPreview({ children, Component, width, height }: LinkPreviewProps) {
  if (useIsPreview()) {
    return null;
  }
  const { isVisible, href } = use(InternalLinkPreviewContext)!;
  const contentSize = {
    width: width ?? 0,
    height: height ?? 0,
  };
  let content: React.ReactNode;
  if (Component) {
    content = <Component isVisible={isVisible} />;
  } else if (children) {
    content = children;
  } else {
    content = isVisible ? <HrefPreview href={href} /> : null;
  }
  return (
    <PeekAndPopPreviewView preferredContentSize={contentSize}>{content}</PeekAndPopPreviewView>
  );
}

export function LinkTrigger({ children }: PropsWithChildren) {
  return children;
}
