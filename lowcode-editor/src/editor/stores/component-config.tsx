import {create} from 'zustand';
import Container from '../materials/Container';
import Button from '../materials/Button';
import Page from '../materials/Page';

export interface ComponentConfig {
    name: string;
    desc: string;
    defaultProps: Record<string, unknown>,
    component: unknown
}
 
interface State {
    componentConfig: {[key: string]: ComponentConfig};
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
            component: Container
        },
        Button: {
            name: 'Button',
            defaultProps: {
                type: 'primary',
                text: '按钮'
            },
            desc: '按钮',
            component: Button
        },
        Page: {
            name: 'Page',
            desc: '页面',
            defaultProps: {},
            component: Page
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