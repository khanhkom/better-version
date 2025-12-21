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
  readonly textColor?: keyof Theme['colors'];
  readonly title: string;
} &
  RestyleProps & TouchableOpacityProps;

const Button: React.FC<ButtonProps> = ({
  textColor = 'textPrimary',
  title,
  ...rest
}) => {
  return (
    <ButtonContainer {...rest}>
      <Text color={textColor} variant="title">
        {title}
      </Text>
    </ButtonContainer>
  );
};

Button.defaultProps = {
  variant: 'defaults',
};

export default Button;
