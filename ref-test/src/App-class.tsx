import React from "react";
export default class App extends React.Component {
  inputRef: React.RefObject<unknown>;

  constructor() {
    super();
    // 类组件里用 createRef
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    this.inputRef.current?.focus();
  }
  render(): React.ReactNode {
    return <input ref={this.inputRef} type="text" />
  }
}