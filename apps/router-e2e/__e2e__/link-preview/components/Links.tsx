import { Link, useIsPreview } from 'expo-router';
import { useState } from 'react';
import { View, Text, Button } from 'react-native';

export function Links() {
  const isPreview = useIsPreview();
  const [width, setWidth] = useState(undefined);
  return (
    <View style={{ gap: 10, marginTop: 10 }}>
      <Text>width: {width}</Text>
      <Button title="toggle width" onPress={() => setWidth((prev) => (prev ? undefined : 300))} />
      <Link href="/(tabs)/home" experimentalPreview>
        /(tabs)/home
      </Link>
      <Link href="/(tabs)/home/redirect" experimentalPreview>
        /(tabs)/home/redirect
      </Link>
      <Link href="/(tabs)/home/one" experimentalPreview>
        /(tabs)/home/one
        <Link.Preview width={width}>
          <View style={{ flex: 1, backgroundColor: '#00F' }}>
            <Text>This is custom preview</Text>
          </View>
        </Link.Preview>
      </Link>
      <Link href="/(tabs)/home/two" experimentalPreview>
        /(tabs)/home/two
        <Link.Trigger>Custom trigger</Link.Trigger>
        <Link.Preview width={width}>
          <View style={{ flex: 1, backgroundColor: '#0F0' }}>
            <Text>This is custom preview</Text>
          </View>
        </Link.Preview>
        <Link.Menu>
          <Button title="Share the link" onPress={() => console.log('Share button pressed')} />
          {width ? (
            <Link.MenuItem
              title="Second share the link"
              onPress={() => console.log('Share button pressed 2')}
            />
          ) : null}
        </Link.Menu>
      </Link>
      <Link href="/(tabs)/home/two" experimentalPreview push>
        Push: /(tabs)/home/two
      </Link>
      <Link
        href="/(tabs)/home/two"
        experimentalPreview
        style={{
          backgroundColor: isPreview ? 'transparent' : 'red',
        }}>
        Red: /(tabs)/home/two (transparent in preview)
      </Link>
      <Link href="/(tabs)/home/slot" experimentalPreview>
        /(tabs)/home/slot
      </Link>
      <Link href="/(tabs)/home/slot/one" experimentalPreview>
        /(tabs)/home/slot/one
      </Link>
      <Link href="/(tabs)/home/slot/router" experimentalPreview>
        /(tabs)/home/slot/router
      </Link>
      <Link href="/(tabs)/home/hello_world" experimentalPreview>
        /(tabs)/home/hello_world
      </Link>
      <Link href="/(tabs)/settings" experimentalPreview>
        /(tabs)/settings
      </Link>
      <Link href="/settings" experimentalPreview>
        /settings
      </Link>
    </View>
  );
}
