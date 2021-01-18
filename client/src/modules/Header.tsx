import styled from 'styled-components';

export const Header = styled.div<{variant: 1 | 2 | 3}>`
  font-size: ${props => {
    switch (props.variant) {
      case 1:
        return '3rem';
      case 2:
        return '2rem';
      case 3:
        return '1.5rem';
    }
  }};
`;