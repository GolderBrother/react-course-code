import { Input, Select } from "antd"
import { useComponentsStore } from "../../../stores/components";
import { useEffect, useState } from "react";


export interface ShowMessageConfig {
    type: 'showMessage',
    config: {
        type: 'success' | 'error' | 'info' | 'warn'
        text: string
    }
}

export interface ShowMessageProps {
    value?: ShowMessageConfig['config']
    onChange?: (config: ShowMessageConfig) => void
}
export function ShowMessage(props: ShowMessageProps) {
    const { value: val, onChange } = props;

    const { curComponentId } = useComponentsStore();

    const [type, setType] = useState<ShowMessageConfig['config']['type']>(val?.type || 'success');
    const [text, setText] = useState<string>(val?.text || '');
    useEffect(() => {
        if (val) {
            setType(val?.type);
            setText(val?.text);
        }
    }, [val])
    function messageTypeChange(value: 'success' | 'error') {
        if (!curComponentId) return;

        setType(value);

        onChange?.({
            type: 'showMessage',
            config: {
                type: value,
                text
            }
        })
      }
    
    function messageTextChange(value: string) {
        if (!curComponentId) return;

        setText(value);

        onChange?.({
            type: 'showMessage',
            config: {
                type,
                text: value
            }
        })
    }

    return <div className='mt-[10px]'>
        <div className='flex items-center gap-[10px]'>
            <div>类型：</div>
            <div>
                <Select
                    style={{ width: 500, height: 50 }}
                    options={[
                        { label: '提示', value: 'info' },
                        { label: '成功', value: 'success' },
                        { label: '警告', value: 'warn' },
                        { label: '失败', value: 'error' },
                    ]}
                    // onChange={(value) => { messageTypeChange(event.name, value) }}
                    // value={curComponent?.props?.[event.name]?.config?.type}
                    onChange={(value) => { messageTypeChange(value) }}
                    value={type}
                />
            </div>
        </div>
        <div className='flex items-center gap-[10px] mt-[10px]'>
            <div>文本：</div>
            <div>
                <Input
                    style={{ width: 500, height: 50 }}
                    // onChange={(e) => { messageTextChange(event.name, e.target.value) }}
                    // value={curComponent?.props?.[event.name]?.config?.text}
                    onChange={(e) => { messageTextChange(e.target.value) }}
                    value={text}
                />
            </div>
        </div>
    </div>
}
