import { create } from 'zustand';
import EditContainer from '../materials/Container/edit';
import PreviewContainer from '../materials/Container/preview';

import EditButton from '../materials/Button/edit';
import PreviewButton from '../materials/Button/preview';

import EditPage from '../materials/Page/edit';
import PreviewPage from '../materials/Page/preview';
import { CSSProperties } from 'react';
import { CommonComponentProps } from '../interface';

export interface ComponentSetter {
    name: string;
    label: string;
    type: string;
    [key: string]: any;
}
export interface ComponentEvent {
    name: string
    label: string
}


export interface ComponentConfig {
    name: string;
    defaultProps: Record<string, unknown>,
    desc: string;
    styles?: CSSProperties;
    setter?: ComponentSetter[]
    stylesSetter?: ComponentSetter[]
    events?: ComponentEvent[]; // 事件
    edit: (props: CommonComponentProps) => JSX.Element
    preview: (props: CommonComponentProps) => JSX.Element
}

interface State {
    componentConfig: { [key: string]: ComponentConfig };
}

interface Action {
    registerComponent: (name: string, componentConfig: ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
    componentConfig: {
        Container: {
            name: 'Container',
            defaultProps: {},
            desc: '容器',
            edit: EditContainer,
            preview: PreviewContainer,
            // component: EditContainer
        },
        Button: {
            name: 'Button',
            defaultProps: {
                type: 'primary',
                text: '按钮'
            },
            setter: [{
                name: 'type',
                label: '按钮类型',
                type: 'select',
                options: [
                    { label: '主按钮', value: 'primary' },
                    { label: '次按钮', value: 'default' },
                ],
            },
            {
                name: 'text',
                label: '文本',
                type: 'input',
            }],
            stylesSetter: [
                {
                    name: 'width',
                    label: '宽度',
                    type: 'inputNumber',
                },
                {
                    name: 'height',
                    label: '高度',
                    type: 'inputNumber',
                }
            ],
            events: [
                {
                    name: 'onClick',
                    label: '点击事件',
                },
                {
                    name: 'onDoubleClick',
                    label: '双击事件'
                },
            ],            
            desc: '按钮',
            edit: EditButton,
            preview: PreviewButton,
            // component: Button
        },
        Page: {
            name: 'Page',
            desc: '页面',
            defaultProps: {},
            edit: EditPage,
            preview: PreviewPage,
            // component: Page
        }
    },
    registerComponent: (name, componentConfig) => set((state) => {
        return {
            ...state,
            componentConfig: {
                ...state.componentConfig,
                [name]: componentConfig
            }
        }
    })
}));
