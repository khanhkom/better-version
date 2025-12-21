import { createBox } from '@shopify/restyle';
import type { Theme } from '@/theme/restyle';

const Card = createBox<Theme>();

Card.defaultProps = {
  variant: 'defaults',
};

export default Card;
