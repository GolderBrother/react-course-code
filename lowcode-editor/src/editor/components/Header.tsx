import { Button, Space } from 'antd';
import { useComponentsStore, State } from '../stores/components';

export function Header() {

  const { mode, setMode, setCurComponentId } = useComponentsStore();
  const handleModeChange = (newMode: State['mode']) => {
    if (newMode === 'preview') {
      setMode(newMode);
      setCurComponentId(null);
    } else if (newMode === 'edit') {
      setMode(newMode);
    }
  };


  return (
    <div className='w-[100%] h-[100%]'>
      <div className='h-[50px] flex justify-between items-center px-[20px]'>
        <div>低代码编辑器</div>
        <Space>
          {mode === 'edit' && (
            <Button
                onClick={() => handleModeChange('preview')}

                type='primary'
            >
                预览
            </Button>
          )}
          {mode === 'preview' && (
            <Button
              onClick={() => handleModeChange('edit')}
              type='primary'
            >
              退出预览
            </Button>
          )}
        </Space>
      </div>
    </div>
  )
} 