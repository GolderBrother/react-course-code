import { Button as AntdButton } from 'antd';
import { ButtonType } from 'antd/es/button';
import { CommonComponentProps } from '../../interface';

export type ButtonProps = {
  // id: number;
  type: ButtonType;
  text: string;
} & Pick<CommonComponentProps, 'id' | 'styles'>

const Button = ({ id, type, text, styles }: ButtonProps) => {
  return (
    <AntdButton data-component-id={id} type={type} style={styles}>{text}</AntdButton>
  )
}

export default Button;
