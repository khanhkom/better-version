import Text from './Text';

type EmojiProps = {
  readonly size?: number;
  readonly symbol: string;
  readonly testID?: string;
};

/**
 * Cross-platform Emoji component
 * Renders emoji with consistent sizing across iOS and Android
 */
export function Emoji({ size = 24, symbol, testID }: EmojiProps) {
  return (
    <Text
      fontSize={size}
      lineHeight={size}
      style={{
        // Android fix for emoji padding
        includeFontPadding: false,
        textAlignVertical: 'center',
        // Ensure emoji is centered
        textAlign: 'center',
      }}
      testID={testID}
    >
      {symbol}
    </Text>
  );
}
