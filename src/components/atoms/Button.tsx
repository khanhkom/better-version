import type { Theme } from '@/theme/restyle';

import {
  backgroundColor,
  type BackgroundColorProps,
  border,
  type BorderProps,
  createRestyleComponent,
  createVariant,
  spacing,
  type SpacingProps,
  type VariantProps,
} from '@shopify/restyle';
import React from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';

import Text from './Text';

type RestyleProps = BackgroundColorProps<Theme> &
  BorderProps<Theme> &
  SpacingProps<Theme> &
  VariantProps<Theme, 'buttonVariants'>;

const ButtonContainer = createRestyleComponent<
  RestyleProps & TouchableOpacityProps,
  Theme
>(
  [
    spacing,
    border,
    backgroundColor,
    createVariant({ themeKey: 'buttonVariants' }),
  ],
  TouchableOpacity,
);

type ButtonProps = {
  readonly fontSize?: number;
  readonly fontWeight?: '400' | '500' | '600' | '700' | '800' | '900';
  readonly textColor?: keyof Theme['colors'];
  readonly title: string;
} &
  RestyleProps & TouchableOpacityProps;

const Button: React.FC<ButtonProps> = ({
  fontSize,
  fontWeight,
  textColor = 'textPrimary',
  title,
  ...rest
}) => {
  return (
    <ButtonContainer {...rest}>
      <Text
        color={textColor}
        fontSize={fontSize}
        fontWeight={fontWeight}
        variant="title"
      >
        {title}
      </Text>
    </ButtonContainer>
  );
};

Button.defaultProps = {
  variant: 'defaults',
};

export default Button;
