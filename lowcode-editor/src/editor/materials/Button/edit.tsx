import { Button as AntdButton } from 'antd';
import { ButtonType } from 'antd/es/button';
import { CommonComponentProps } from '../../interface';
import { useDrag } from 'react-dnd';

export type ButtonProps = {
  // id: number;
  type: ButtonType;
  text: string;
} & Pick<CommonComponentProps, 'id' | 'styles'>

const Button = ({ id, type, text, styles }: ButtonProps) => {
  const [_, drag] = useDrag({
    type: 'Button',
    item: {
      type: 'Button',
      dragType: 'move',
      id
    }
  });

  return (
    <AntdButton ref={drag} data-component-id={id} type={type} style={styles}>{text}</AntdButton>
  )
}

export default Button;
