import { Button as AntdButton } from 'antd';
import { CommonComponentProps } from '../../interface';

const Button = ({id, type, text, styles, ...props}: CommonComponentProps) => {
  return (
    <AntdButton type={type} style={styles} {...props}>{text as string}</AntdButton>
  )
}

export default Button;
