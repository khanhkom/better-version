import { Dimensions } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';

const PERCENTAGE_DIVISOR = 100;
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;
const STATUS_BAR_THRESHOLD = 20;

const { height, width } = Dimensions.get('window');

// Hàm trả về chiều cao màn hình thiết bị đã trừ phần lề trên (status bar)
const deviceHeight = height - (initialWindowMetrics?.insets.top ?? 0);

// Hàm trả về chiều cao của status bar
export const STATUS_BAR_HEIGHT = initialWindowMetrics?.insets.top ?? 0;

// Hàm tính toán chiều cao theo phần trăm so với chiều cao màn hình
export const getHeightPercent = (h: number): number =>
  height * (h / PERCENTAGE_DIVISOR);

// Hàm tính toán chiều rộng theo phần trăm so với chiều rộng màn hình
export const getWidthPercent = (w: number): number =>
  width * (w / PERCENTAGE_DIVISOR);

// Hàm tính toán chiều rộng dựa trên kích thước chuẩn (BASE_WIDTH)
export const scaleWidth = (w: number): number => width * (w / BASE_WIDTH);

// Hàm tính toán chiều cao dựa trên kích thước chuẩn (BASE_HEIGHT)
export const scaleHeight = (h: number): number => height * (h / BASE_HEIGHT);

// Hàm tạo số nguyên ngẫu nhiên trong khoảng [min, max)
export const randomIntInRange = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min)) + min;

// Hàm tính toán chiều rộng của một component theo phần trăm
export const getComponentWidthPercent = (
  widthComponent: number,
  w: number,
): number => widthComponent * (w / PERCENTAGE_DIVISOR);

// Hàm tăng kích thước font lên 2 đơn vị (theo thiết kế Figma)
export const addFigmaFontOffset = (f: number): number => f + 2;

// Hàm trả về chiều cao màn hình hiện tại
export const getDeviceHeight = (): number => height;

// Hàm trả về chiều rộng màn hình hiện tại
export const getDeviceWidth = (): number => width;

// Hàm trả về kích thước font truyền vào (không thay đổi)
export const getFont = (f: number): number => f;

// Hàm trả về chiều cao dòng truyền vào (không thay đổi)
export const identityLineHeight = (f: number): number => f;

// Hàm tính toán kích thước font chữ phù hợp với chiều cao màn hình và status bar
export function getResponsiveFontSize(fontSize: number) {
  const heightPercent =
    (((initialWindowMetrics?.insets.top ?? 0) > STATUS_BAR_THRESHOLD
      ? fontSize
      : fontSize - 2) *
      deviceHeight) /
    getDeviceHeight();
  return Math.round(heightPercent);
}
