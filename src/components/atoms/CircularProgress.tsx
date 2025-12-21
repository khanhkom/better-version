import Svg, { Circle } from 'react-native-svg';

import Box from './Box';

type CircularProgressProps = {
  readonly backgroundColor?: string;
  readonly color?: string;
  readonly progress: number; // 0-100
  readonly size?: number;
  readonly strokeWidth?: number;
  readonly testID?: string;
};

/**
 * Circular Progress Indicator
 * SVG-based circular progress for Pomodoro timer
 */
export function CircularProgress({
  backgroundColor = '#3e2723',
  color = '#ef5350',
  progress,
  size = 200,
  strokeWidth = 12,
  testID,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  return (
    <Box height={size} testID={testID} width={size}>
      <Svg height={size} width={size}>
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          // Rotate -90 degrees to start from top
          origin={`${size / 2}, ${size / 2}`}
          rotation="-90"
        />
      </Svg>
    </Box>
  );
}
