
import React, { Component } from 'react'
import { Button, Form, Input, message, Select } from 'antd'
import $ from 'jquery';
import path from '@app/pages/base/testpath'
import { regExpConfig } from '@reg'
import Drawer from '@components/draw/draw'
import {
  fetchUserDetailUpdate,
  fetchUserAdd,
} from '@apis/manage'

const FormItem = Form.Item
const { Option } = Select
// const Option = Select.Option;

@Form.create({})

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.updateWeblink = this.updateWeblink.bind(this);
    this.Changeo = this.Changeo.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      loading: false,
    }
  }

  // 组件已经加载到dom中
  componentDidMount() {
    console.log(this.props)
    this.props.form.resetFields()
  }

  Changeo(value) {
    console.log(`selected ${value}`);
  }

  updateWeblink(guid, idcardNo, policeCode) {
    console.log(guid);
    console.log(idcardNo);
    console.log(policeCode);
    $.ajax({
      url: `${path.path1}updateWeblink`,
      type: 'post',
      data: {
        guid: guid,
        weblink: idcardNo,
        state: policeCode,
      },
      dataType: 'text',
      // cashe: false,
      async: false,
      success: function (res) {
        const obj = res;
        if (obj == '修改成功') {
          message.success(obj)
        } else {
          message.warning(obj)
        }
        this.state.loading = false
        this.props.handleOk()
      }.bind(this),
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        this.setState({ loading: false })
      },
    });
  }


  handleSubmit(e) {
    e.preventDefault()
    this.props.form.validateFields((errors, values) => {
      if (errors) {
        return;
      }
      console.log('vvvv');
      console.log(this.props.type);
      this.setState({ loading: true }, () => {
        if (this.props.type === 'edit') {
          let status = values.policeCode
          if (status === '正常') {
            status = 1;
          } else if (status === '停用') {
            status = 0
          }
          console.log(status)
          console.info('shang')
          this.updateWeblink(this.props.values.id, values.idcardNo, status);
        } else {
          console.log(values.chineseName)
          console.log(values.idcardNo)
          $.ajax({
            url: `${path.path1}insertWeblink`,
            type: 'post',
            data: {
              productName: values.chineseName,
              weblink: values.idcardNo,
            },
            dataType: 'text',
            // cashe: false,
            async: false,
            success: function (res) {
              const obj = res;
              message.success(obj)
              this.state.loading = false
              this.props.handleOk()
            }.bind(this),
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              // message.warning(errorThrown)
              // this.setState({ loading: false })
            },
          });
        }
      })
    })
  }

  footer() {
    return (
      <div>
        <Button type="primary" onClick={this.handleSubmit} loading={this.state.loading}>确定</Button>
        <Button onClick={this.props.onCancel}>取消</Button>
      </div>
    )
  }

  render() {
    const {
      visible, onCancel, title, roleList, values,
    } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 17 },
    };
    (values.roleIds || []).map((item, index) => (values.roleIds.splice(index, 1, String(item))));
    return (
      <Drawer
        visible={visible}
        title={title}
        onCancel={onCancel}
        footer={this.footer()}
        className="modal-header modal-body"
      >
        <div className="modalcontent">
          <FormItem layout="horizontal" onSubmit={this.handleSubmit}>
            <FormItem {...formItemLayout} label="名称" hasFeedback>
              {getFieldDecorator('chineseName', {
                initialValue: values.post || '',
                rules: [{ required: true, message: '请输入名称' }],
              })(<Input placeholder="请输入名称" disabled={this.props.type === 'edit'} />)}
            </FormItem>
            <FormItem {...formItemLayout} label="链接" hasFeedback>
              {getFieldDecorator('idcardNo', {
                initialValue: values.username || '',
                rules: [
                  { required: true, message: '请输入链接' },
                  // { pattern: regExpConfig.IDcard, message: '身份证号格式不正确' },
                ],
              })(<Input placeholder="请输入链接" />)}
              {/* disabled={this.props.type === 'edit'} /> */}
            </FormItem>
            {/* <FormItem {...formItemLayout} label="状态" hasFeedback> */}
            {/* {getFieldDecorator('policeCode', { */}
            {/* initialValue: values.statusLabel, */}
            {/* rules: [ */}
            {/* // { required: true, message: '请输入警号' }, */}
            {/* { pattern: regExpConfig.zeroFirst, message: '请输入整数' }, */}
            {/* ], */}
            {/* })(<Input placeholder="1为正常，0为停用" maxLength={1} disabled={this.props.type === 'add'}/>)} */}
            {/* </FormItem> */}

            {
              this.props.type === 'edit' ?
                (<FormItem {...formItemLayout} label="状态" hasFeedback>{
                  getFieldDecorator('policeCode', {
                    initialValue: values.statusLabel ? '正常' : '停用',
                    rules: [{ required: true, message: 'Please select your gender' }],
                  })(<Select >
                    <Option value="1">正常</Option>
                    <Option value="0">停用</Option>
                  </Select>)}
                </FormItem>) : null
            }

            {/* <FormItem {...formItemLayout} label="状态" hasFeedback> */}
            {/* { */}
            {/* getFieldDecorator('policeCode',{ */}
            {/* rules: [{required: true, message: 'Please select your gender'}] */}
            {/* }) */}
            {/* ( */}
            {/* <Select */}
            {/* defaultValue={values.statusLabel ? '正常' : '停用'} */}
            {/* // onChange={this.Changeo} */}
            {/* disabled={this.props.type === 'add'} */}
            {/* > */}
            {/* <Option value="1">正常</Option> */}
            {/* <Option value="0">停用</Option> */}
            {/* </Select> */}
            {/* )} */}
            {/* </FormItem> */}

            {/* <FormItem {...formItemLayout} label="登陆用户名" hasFeedback> */}
            {/* {getFieldDecorator('username', { */}
            {/* initialValue: values.username || '', */}
            {/* rules: [ */}
            {/* { required: true, message: '请输入4-10位数字或字母' }, */}
            {/* { pattern: regExpConfig.policeNo, message: '请输入4-10位数字或字母' }, */}
            {/* ], */}
            {/* })(<Input placeholder="请输入登陆用户名" disabled={this.props.type === 'edit'} />)} */}
            {/* </FormItem> */}
            {/* <FormItem style={{ position: 'absolute', zIndex: -10 }} ><input type="password" /></FormItem> */}
            {/* { */}
            {/* this.props.type === 'edit' ? ( */}
            {/* <FormItem {...formItemLayout} label="修改密码"> */}
            {/* {getFieldDecorator('password', { */}
            {/* initialValue: values.password || '', */}
            {/* rules: [{ pattern: regExpConfig.pwd, message: '请输入6-16位数字或者字母' }], */}
            {/* })(<Input type="password" placeholder="不改密码此项为空" />)} */}
            {/* </FormItem> */}
            {/* ) : ( */}
            {/* <FormItem {...formItemLayout} label="登陆密码" hasFeedback> */}
            {/* {getFieldDecorator('password', { */}
            {/* initialValue: values.password || '', */}
            {/* rules: [ */}
            {/* { required: true, message: '密码请输入6-16位数字或者字母' }, */}
            {/* { pattern: regExpConfig.pwd, message: '密码请输入6-16位数字或者字母' }, */}
            {/* ], */}
            {/* })(<Input placeholder="请输入密码" type="password" />)} */}
            {/* </FormItem> */}
            {/* ) */}
            {/* } */}
            {/* <FormItem {...formItemLayout} label="手机号码" hasFeedback> */}
            {/* {getFieldDecorator('phoneNo', { */}
            {/* initialValue: values.phoneNo || '', */}
            {/* rules: [ */}
            {/* { required: true, message: '请输入手机号码' }, */}
            {/* { pattern: regExpConfig.mobile, message: '手机号码格式不正确' }, */}
            {/* ], */}
            {/* })(<Input placeholder="请输入手机号码" />)} */}
            {/* </FormItem> */}
            {/* <FormItem {...formItemLayout} label="手机短号" hasFeedback> */}
            {/* {getFieldDecorator('shortPhoneNo', { */}
            {/* initialValue: values.shortPhoneNo || '', */}
            {/* })(<Input placeholder="请输入手机短号" />)} */}
            {/* </FormItem> */}
            {/* <FormItem {...formItemLayout} label="职务" hasFeedback> */}
            {/* {getFieldDecorator('post', { */}
            {/* initialValue: values.post || '', */}
            {/* })(<Input placeholder="请输入职务" />)} */}
            {/* </FormItem> */}
            {/* <FormItem {...formItemLayout} label="角色" hasFeedback> */}
            {/* {getFieldDecorator('roleIds', { */}
            {/* initialValue: values.roleIds || [], */}
            {/* rules: [ */}
            {/* { required: true, message: '请选择用户的角色' }, */}
            {/* ], */}
            {/* })(<Select */}
            {/* mode="multiple" */}
            {/* placeholder="请选择用户的角色" */}
            {/* showSearch */}
            {/* filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) >= 0} */}
            {/* > */}
            {/* { */}
            {/* roleList.map(item => <Option key={item.roleName} value={`${item.id}`}>{item.roleName}</Option>) */}
            {/* } */}
            {/* </Select>)} */}
            {/* </FormItem> */}
            <Button className="hide" type="primary" htmlType="submit">确定</Button>
          </FormItem>
        </div>
      </Drawer>
    )
  }
}
