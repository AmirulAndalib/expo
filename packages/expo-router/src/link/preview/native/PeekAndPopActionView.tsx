import { requireNativeView } from 'expo';

import { PeekAndPopActionViewProps } from './types';

const NativeView: React.ComponentType<PeekAndPopActionViewProps> = requireNativeView(
  'ExpoRouterPeekAndPop',
  'PeekAndPopActionView'
);

export default function PeekAndPopActionNativeView(props: PeekAndPopActionViewProps) {
  return <NativeView {...props} />;
}
