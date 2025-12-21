# Hướng dẫn sử dụng Components với @shopify/restyle

## Cấu hình Theme

Theme được định nghĩa trong `src/theme/restyle.ts` với các màu sắc, khoảng cách, và variants cho các component.

### Sử dụng ThemeProvider

Wrap ứng dụng của bạn với `RestyleThemeProvider`:

```tsx
import RestyleThemeProvider from '@/theme/ThemeProvider/RestyleThemeProvider';

function App() {
  return (
    <RestyleThemeProvider>
      {/* Your app components */}
    </RestyleThemeProvider>
  );
}
```

## Components Atoms

### Box
Component container cơ bản với hỗ trợ đầy đủ các props của restyle:

```tsx
import { Box } from '@/components/atoms';

<Box
  backgroundColor="cardPrimaryBackground"
  padding="l"
  borderRadius="l"
>
  {/* Content */}
</Box>
```

### Text
Component text với các variants được định nghĩa sẵn:

```tsx
import { Text } from '@/components/atoms';

<Text variant="header">Header Text</Text>
<Text variant="title">Title Text</Text>
<Text variant="body">Body Text</Text>
<Text variant="caption">Caption Text</Text>
<Text variant="stat">1234</Text>
```

### Button
Button với các variants khác nhau:

```tsx
import { Button } from '@/components/atoms';

<Button
  variant="primary"
  title="NHẬN THƯỞNG"
  onPress={() => console.log('Pressed')}
/>

<Button
  variant="secondary"
  title="Cancel"
  onPress={() => {}}
/>

<Button
  variant="outlined"
  title="More Info"
  onPress={() => {}}
/>
```

### Avatar
Component hiển thị avatar với border tùy chỉnh:

```tsx
import { Avatar } from '@/components/atoms';

<Avatar
  source={{ uri: 'https://example.com/avatar.jpg' }}
  size="large"
  borderColor="borderPrimary"
/>

// Sizes: 'small' | 'medium' | 'large'
```

### ProgressBar
Thanh tiến trình với label và caption:

```tsx
import { ProgressBar } from '@/components/atoms';

<ProgressBar
  current={1250}
  max={2000}
  variant="yellow"
  label="KINH NGHIỆM"
  icon={<Text>⚡</Text>}
  caption="Thiếu 750 XP đi lên cấp"
/>

<ProgressBar
  current={85}
  max={100}
  variant="pink"
  label="SỨC KHỎE"
/>

// Variants: 'yellow' | 'pink'
```

### Badge
Huy hiệu số đỏ (notification badge):

```tsx
import { Badge } from '@/components/atoms';

<Badge count={3} />
<Badge count={99} />
<Badge count={150} /> // Hiển thị "99+"
```

### Card
Container với variants được định nghĩa sẵn:

```tsx
import { Card } from '@/components/atoms';

<Card variant="elevated">
  {/* Content */}
</Card>

<Card variant="bordered">
  {/* Content */}
</Card>

// Variants: 'defaults' | 'elevated' | 'bordered' | 'stat'
```

## Components Molecules

### StatCard
Thẻ hiển thị thống kê với icon:

```tsx
import { StatCard } from '@/components/molecules';

<StatCard
  icon={<Text fontSize={24}>💰</Text>}
  value="450"
  label="VÀNG"
  variant="gold"
  borderColor="secondary"
/>

<StatCard
  icon={<Text fontSize={24}>💎</Text>}
  value="12"
  label="ĐÁ QUÝ"
  variant="blue"
  borderColor="primary"
/>

// Variants: 'gold' | 'blue' | 'orange'
```

### ItemCard
Thẻ vật phẩm trong kho đồ:

```tsx
import { ItemCard } from '@/components/molecules';

<ItemCard
  image={{ uri: 'https://example.com/item.png' }}
  name="Kiếm sắt"
  status="Đã trang bị"
  isEquipped
  onPress={() => console.log('Item pressed')}
/>

<ItemCard
  image={{ uri: 'https://example.com/potion.png' }}
  name="Bình máu"
  status="HỒI PHỤC"
  badgeCount={3}
  borderColor="danger"
/>
```

## Theme Colors

Các màu sắc có sẵn trong theme:

- Background: `darkBg`, `cardBg`, `cardBgLight`
- Accent: `primary`, `secondary`, `success`, `danger`, `warning`
- Text: `textPrimary`, `textSecondary`, `textMuted`
- Border: `borderPrimary`, `borderSecondary`, `borderDefault`
- Icon backgrounds: `iconBgGold`, `iconBgBlue`, `iconBgOrange`, `iconBgGreen`
- Progress bars: `progressBgYellow`, `progressYellow`, `progressBgPink`, `progressPink`

## Spacing

- `xs`: 4px
- `s`: 8px
- `m`: 12px
- `l`: 16px
- `xl`: 20px
- `xxl`: 24px
- `xxxl`: 32px

## Border Radius

- `xs`: 4px
- `s`: 8px
- `m`: 12px
- `l`: 16px
- `xl`: 20px
- `xxl`: 24px
- `full`: 9999px (tròn hoàn toàn)

## Example Screen

Xem file `src/screens/ProfileExample.tsx` để tham khảo cách sử dụng tất cả components trong một màn hình hoàn chỉnh.

## Tùy chỉnh Theme

Để thay đổi colors, spacing, hoặc variants, chỉnh sửa file `src/theme/restyle.ts`:

```tsx
const theme = createTheme({
  colors: {
    // Thêm hoặc sửa màu sắc
    myCustomColor: '#FF5733',
  },
  spacing: {
    // Thêm khoảng cách mới
    huge: 48,
  },
  // ...
});
```

## TypeScript Support

Tất cả components đều có type-safety đầy đủ. IDE sẽ gợi ý các props và variants có sẵn.
