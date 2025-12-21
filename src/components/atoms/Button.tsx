import React from 'react';
import { TouchableOpacity, type TouchableOpacityProps } from 'react-native';
import {
  createRestyleComponent,
  createVariant,
  spacing,
  border,
  backgroundColor,
  type SpacingProps,
  type BorderProps,
  type BackgroundColorProps,
  type VariantProps,
} from '@shopify/restyle';
import type { Theme } from '@/theme/restyle';
import Text from './Text';

type RestyleProps = SpacingProps<Theme> &
  BorderProps<Theme> &
  BackgroundColorProps<Theme> &
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

type ButtonProps = RestyleProps &
  TouchableOpacityProps & {
    title: string;
    textColor?: keyof Theme['colors'];
  };

const Button: React.FC<ButtonProps> = ({
  title,
  textColor = 'textPrimary',
  ...rest
}) => {
  return (
    <ButtonContainer {...rest}>
      <Text variant="title" color={textColor}>
        {title}
      </Text>
    </ButtonContainer>
  );
};

Button.defaultProps = {
  variant: 'defaults',
};

export default Button;
