import { create } from 'zustand';
import EditContainer from '../materials/Container/edit';
import PreviewContainer from '../materials/Container/preview';

import EditButton from '../materials/Button/edit';
import PreviewButton from '../materials/Button/preview';

import EditModal from '../materials/Modal/edit';
import PreviewModal from '../materials/Modal/preview';

import EditPage from '../materials/Page/edit';
import PreviewPage from '../materials/Page/preview';

import EditTable from '../materials/Table/edit';
import PreviewTable from '../materials/Table/preview';

import EditTableColumn from '../materials/TableColumn/edit';
import PreviewTableColumn from '../materials/TableColumn/preview';

import EditForm from '../materials/Form/edit';
import PreviewForm from '../materials/Form/preview';

import EditFormItem from '../materials/FormItem/edit';
import PreviewFormItem from '../materials/FormItem/preview';

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

export interface ComponentMethod {
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
    methods?: ComponentMethod[]; // 方法
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
        },
        Modal: {
            name: 'Modal',
            defaultProps: {
                title: '弹窗'
            },
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input'
                }
            ],
            stylesSetter: [],
            events: [
                {
                    name: 'onOk',
                    label: '确认事件',
                },
                {
                    name: 'onCancel',
                    label: '取消事件'
                },
            ],
            methods: [
                {
                    name: 'open',
                    label: '打开弹窗',
                },
                {
                    name: 'close',
                    label: '关闭弹窗'
                }
            ],
            desc: '弹窗',
            edit: EditModal,
            preview: PreviewModal
        },
        Table: {
            name: 'Table',
            defaultProps: {},
            desc: '表格',
            setter: [
                {
                    name: 'url',
                    label: 'url',
                    type: 'input',
                },
            ],
            edit: EditTable,
            preview: PreviewTable
        },
        TableColumn: {
            name: 'TableColumn',
            desc: '表格列',
            defaultProps: {
                dataIndex: `col_${new Date().getTime()}`,
                title: '列名'
            },
            setter: [
                {
                    name: 'type',
                    label: '类型',
                    type: 'select',
                    options: [
                        {
                            label: '文本',
                            value: 'text',
                        },
                        {
                            label: '日期',
                            value: 'date',
                        },
                    ],
                },
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
                {
                    name: 'dataIndex',
                    label: '字段',
                    type: 'input',
                },
            ],
            edit: EditTableColumn,
            preview: PreviewTableColumn,
        },
        Form: {
            name: 'Form',
            defaultProps: {},
            desc: '表单',
            setter: [
                {
                    name: 'title',
                    label: '标题',
                    type: 'input',
                },
            ],
            events: [
                {
                    name: 'onFinish',
                    label: '提交事件',
                }
            ],
            // 组件暴露出去的方法
            methods: [
                {
                    name: 'submit',
                    label: '提交',
                }
            ],
            edit: EditForm,
            preview: PreviewForm,
        },
        FormItem: {
            name: 'FormItem',
            desc: '表单项',
            defaultProps: {
                name: new Date().getTime(),
                type: 'input',
                label: '姓名',
            },
            edit: EditFormItem,
            preview: PreviewFormItem,
            setter: [
                {
                    name: 'type',
                    label: '类型',
                    type: 'select',
                    options: [
                        {
                            label: '文本',
                            value: 'input',
                        },
                        {
                            label: '日期',
                            value: 'date',
                        },
                    ],
                },
                {
                    name: 'label',
                    label: '标题',
                    type: 'input',
                },
                {
                    name: 'name',
                    label: '字段',
                    type: 'input',
                },
                {
                    name: 'rules',
                    label: '校验',
                    type: 'select',
                    options: [
                        {
                            label: '必填',
                            value: 'required',
                        },
                    ],
                }
            ]
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
