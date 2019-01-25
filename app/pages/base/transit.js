import React, { Component } from 'react'
import { Spin, notification, Button, Popconfirm, Form, Input, message, Layout } from 'antd'
import $ from 'jquery';
import path from './testpath'

export default class transit extends Component {
  // 初始化页面常量 绑定事件方法
  constructor(props, context) {
    super(props);
    this.getData = this.getData.bind(this);
    this.getUrlParam = this.getUrlParam.bind(this);
    this.state = {
      brandName: '正在中转中...',
      userRoleSetResult: { list: [], loading: false },
      yan: { color: 'white' },
    }
  }

  // 组件即将加载
  componentWillMount() {
    const targetId = this.getUrlParam('targetId=');
    this.getData(targetId);
  }

  // 组件已经加载到dom中
  componentDidMount() {
  }
  // 获取url中的参数
  getUrlParam(name) {
    const r = window.location.href.split(name)[1];
    if (r != null) {
      return r;
    }
    return null;
  }

    getData = (targetId) => {
      const _this = this;
      $.ajax({
        url: `${path.path1}findWeblinkByGiud`,
        type: 'post',
        data: {
          guid: targetId,
        },
        dataType: 'text',
        async: true,
        success: function (res) {
          const obj = res;
          console.log(obj);
          if (obj == '此链接不存在' || obj == '此链接已关闭') {
            _this.setState({
              brandName: '此链接已关闭',
              yan: { color: 'black' },
            })
          } else {
            window.location.replace(obj)
          }
        },
        error: function () {
        },
      });
    }

    render() {
      const center = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
      }
      const {
        brandName,
        yan,
      } = this.state
      return (
        <div className="welcome">
          <div style={center}>
            <div className="title"><h1 style={yan}>{brandName}</h1></div>
          </div>
        </div>
      )
    }
}
