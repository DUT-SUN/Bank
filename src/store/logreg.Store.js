// login module
import { Modal } from "antd";
import { useState } from "react";
import { makeAutoObservable } from "mobx";
class LogregStore {
  constructor() {
    // 响应式
    this.state = {
      destory: false,
    };
    makeAutoObservable(this);
  }
  handledestory = () => {
    this.state.destory = !this.state.destory;
  };
}
export default LogregStore;
