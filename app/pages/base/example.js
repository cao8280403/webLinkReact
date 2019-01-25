import React, { Component } from 'react'
// import PropTypes from 'prop-types'
import { Spin, notification, Button, Popconfirm, Form, Input, message, Layout, Table } from 'antd'
import $ from 'jquery';
import path from './testpath'
import copy from 'copy-to-clipboard'
import TableList from '@tableList'
import { synUser } from '@apis/common'
import {
  fetchUserDepttList,
  fetchUserList,
  fetchUserDetail,
  fetchUserDelete,
  fetchRoleList,
  fetchChangeUserStatus,
} from '@apis/manage'
import AddPolice from '../setCenter/sys/userManage/modal/addPolice'
import SelectRole from '../setCenter/sys/userManage/modal/selectRole'
import { Link } from 'react-router/es/Link';
// import {} from '@actions/xxx'

// @connect((storeState)=>({}))
const FormItem = Form.Item
const { Content } = Layout
const { fetchBtns } = require('@configs/common')

@Form.create({})
// 声明组件  并对外输出
export default class app extends Component {
  static defaultProps={
  }

  static propTypes = {
  }

  // 初始化页面常量 绑定事件方法
  constructor(props) {
    super(props)
    this.getAllData = this.getAllData.bind(this);
    this.onChange = this.onChange.bind(this);
    this.state = {
      // activeTab: 'list',
      searchtitle: '',
      PoliceAddVisible: false,
      synchronizeLoading: false,
      RoleVisible: false,
      spinloading: true,
      moduletitle: '',
      moduletype: '',
      currPeopleId: '',
      // hasList: false,
      searchKey: {
        keyword: '',
        pageSize: 10,
        pageNo: 1,
        deptCode: 1,
      },
      btnRights: {
        view: true,
        freeze: true,
        delete: true,
        edit: true,
        add: true,
      }, // 按钮权限的数组
      userDeptResult: { list: [], loading: false },
      userListResult: { list: [], loading: false },
      userDetailResult: { list: [], loading: false },
      userRoleSetResult: { list: [], loading: false },
      exampleList: [],
      pass: [],
      pageLoading: { loading: false },
      searcho: '',
    }
  }

  // 组件即将加载
  componentWillMount() {
    this.getAllData();
  }

  // 组件已经加载到dom中
  componentDidMount() {
    this.props.form.setFieldsValue({ key: '' })
    console.log(this.props)
  }

  copy(e) {
    copy(e.target.id);
    message.success('复制链接成功')
  }

  getAllData() {
    const _this = this;
    $.ajax({
      url: `${path.path1}findAllweblink`,
      type: 'post',
      data: {
        productName: _this.state.searcho,
      },
      dataType: 'json',
      // cashe: false,
      async: true,
      success: function (res) {
        const obj = res;
        const mytext = [];
        for (const i in obj) {
          mytext.push({
            key: i,
            id: obj[i].guid,
            weblink: <span onClick={_this.copy.bind(this)} id={path.path2 + obj[i].guid}>{path.path2 + obj[i].guid}</span>,
            chineseName: parseInt(i) + 1,
            post: obj[i].productName,
            username: obj[i].sourceWebLink,
            statusLabel: obj[i].state,
          })
        }
        _this.setState({
          exampleList: mytext,
        })
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
      },
    });
  }

  // 发送获取当前菜单的按钮权限
  getBtnRights() {
    fetchBtns(this, btnRights => this.setState({ btnRights }))
  }

  // 获取用户列表数据
  // getData(callback) {
  //     // fetchUserList({ ...this.state.searchKey }, (res) => {
  //     //     console.log(res)
  //     //     this.setState({
  //     //         userListResult: res.data,
  //     //     })
  //     //     callback && callback()
  //     // })
  //     let _this = this;
  //     $.ajax({
  //         url: path.path1 + 'findAllweblink',
  //         type: 'get',
  //         dataType: 'json',
  //         cashe: false,
  //         async: true,
  //         success: function (res) {
  //             let obj = res;
  //             let mytext = [];
  //             for (let i in obj){
  //                 mytext.push({
  //                     key :  i,
  //                     id : obj[i].guid,
  //                     chineseName : parseInt(i)+1,
  //                     post : obj[i].productName,
  //                     username : obj[i].sourceWebLink,
  //                     statusLabel : obj[i].state,
  //                 })
  //             }
  //             _this.setState({
  //                 exampleList: mytext
  //             })
  //             callback && callback()
  //         },
  //         error: function (XMLHttpRequest,textStatus,errorThrown) {
  //         }
  //     });
  //
  // }

  // // 删除用户
  // handleDelete(id) {
  //     if (sessionStorage.getItem('userid') === id) {
  //         message.warning('自己不能删除自己');
  //         return;
  //     }
  //     const curUserListResult = this.props.userListResult
  //     let curpage = this.state.searchKey.pageNo;
  //     fetchUserDelete({ deptcode: this.state.searchKey.deptCode, id: id }, (res) => {
  //         message.success(res.msg)
  //         if (curUserListResult.totalPage > 1 && curUserListResult.totalCount % 10 === 1) {
  //             curpage -= 1
  //         }
  //         this.setState({
  //             searchKey: {
  //                 ...this.state.searchKey,
  //                 pageNo: curpage,
  //             },
  //         }, () => { this.getData() })
  //     })
  // }

  // // 冻结、解冻用户
  // handleChangeStatus(id, status) {
  //     fetchChangeUserStatus({ id: id, status: status }, (res) => {
  //         message.success(res.msg)
  //         this.getData()
  //     })
  // }


  // // 点击人员角色
  // handleUserRole(id) {
  //     fetchUserDetail({ id: id }, (res) => {
  //         this.setState({
  //             userDetailResult: res.data,
  //             RoleVisible: true,
  //             currPeopleId: id,
  //         })
  //     })
  // }

  // 搜索
  handleSearch(e) {
    e.preventDefault()
    const keyword = this.props.form.getFieldValue('key')
    console.log(keyword)
    this.setState({
      spinloading: true,
      searcho: keyword,
    }, () => { this.getAllData(() => { this.setState({ spinloading: false }) }) })
  }


    // 点击人员详情
    // handleUserInfo(form, key) {
    //     form.validateFields((error, row) => {
    //         console.log(row);
    //         console.log(key)
    //         if (error) {
    //             return;
    //         }
    //     });
    // }
    handleUserInfo = (id, key) => {
      const _this = this;
      const arr = _this.state.exampleList;
      const obj = arr.find(obj => obj.key === key)
      // let obj = arr.map(function (item) { return item.id; }).indexOf(id);
      _this.setState({
        userDetailResult: obj,
        PoliceAddVisible: true,
        moduletype: 'edit',
        moduletitle: '详情',
        currPeopleId: id,
      })
      // fetchUserDetail({ id: id }, (res) => {
      //     console.log(res.data)
      //     this.setState({
      //         userDetailResult: res.data,
      //         PoliceAddVisible: true,
      //         moduletype: 'edit',
      //         moduletitle: '详情',
      //         currPeopleId: id,
      //     })
      // })
    }

    // 点击新增人员的时候判断部门 deptid  是否存在，有则弹窗新增
    policeAdd() {
      // if (this.state.searchKey.deptCode) {
      this.setState({
        PoliceAddVisible: true,
        moduletype: 'add',
        moduletitle: '新增',
      })
      // } else {
      //     notification.error({
      //         message: '错误',
      //         description: '请先选择部门',
      //     });
      // }
    }

    synchronize() {
      message.info('数据同步中')
      this.setState({
        synchronizeLoading: true,
      }, () => {
        synUser({}, () => {
          message.success('数据同步完成')
          this.setState({
            synchronizeLoading: false,
          })
          this.getAllData()
        }, (res) => {
          message.warning(res.msg)
          this.setState({
            synchronizeLoading: false,
          })
        })
      })
    }

  // 新增或编辑用户保存
    handleOk() {
      const curUserListResult = this.props.userListResult
      let curpage = this.state.searchKey.pageNo
      if (this.state.moduletype === 'add' && curUserListResult && curUserListResult.totalCount > 0 && curUserListResult.totalCount % 10 === 0) {
        curpage += 1
      }
      this.setState({
        PoliceAddVisible: false,
        searchKey: {
          ...this.state.searchKey,
          pageNo: curpage,
        },
      }, () => {
        this.getAllData()
      })
    }

    // 新增用户modal取消
    handleCancel = () => {
      this.setState({ PoliceAddVisible: false })
    }

    // 角色弹窗确认事件
    handleOkRole() {
      this.setState({ RoleVisible: false }, () => {
        this.getAllData()
      })
    }

    // 角色弹窗取消事件
    handleCancelRole() {
      this.setState({ RoleVisible: false })
    }

    // 页数改变事件
    pageChange = (newPage) => {
      this.state.searchKey.pageNo = newPage
      this.getAllData()
    }

    onChange(pagination, filters, sorter) {
      console.log('params', pagination, filters, sorter);
    }

    // 页大小改变事件
    pageSizeChange = (e, pageSize) => {
      this.state.searchKey.pageNo = 1
      this.state.searchKey.pageSize = pageSize
      this.getAllData()
    }


    // 生成表格头部信息
    renderColumn() {
      return [
        {
          title: '编号',
          dataIndex: 'chineseName',
          key: 'chineseName',
          width: '5%',
        },
        {
          title: '名称',
          dataIndex: 'post',
          key: 'post',
          width: '10%',
        },
        {
          title: '链接',
          dataIndex: 'username',
          key: 'username',
          width: '30%',
        },
        {
          title: '中转链接',
          dataIndex: 'weblink',
          key: 'weblink',
          width: '25%',
        },
        {
          title: '访问量',
          dataIndex: 'visit',
          width: '5%',
          render: (text, record, index) => <span><a onClick={() => this.handleUserInfo(record.id, record.key)}>查看</a></span>,
        },
        {
          title: '状态',
          dataIndex: 'statusLabel',
          key: 'statusLabel',
          width: '5%',
          render: (text, record, index) => <span>{record.statusLabel ? '正常' : '停用'}</span>,
        },
        // {
        //     title: '角色',
        //     dataIndex: 'roles',
        //     key: 'roles',
        //     width: '20%',
        //     render: (text, record, index) => {
        //         const roleNames = [];
        //         (text || []).map((item) => {
        //             roleNames.push(item.roleName)
        //         })
        //         return roleNames.length === 0 ? '' : roleNames.join(',')
        //     },
        // },
        {
          title: '操作',
          key: 'operate',
          width: '5%',
          render: (text, record, index) => <span><a onClick={() => this.handleUserInfo(record.id, record.key)}>详情</a></span>,
          // render: (text, record ) => {
          //     {form => (<span><a onClick={() => this.handleUserInfo(form, record.key)}>详情</a></span>)}
          // },
          //     render: (text, record, index) => {
          //         const { btnRights } = this.state
          //         // console.log(btnRights)
          //         return (
          //             <span>
          //   {
          //       btnRights.view ? <span><a onClick={() => this.handleUserInfo(record.id)}>详情</a><span className="" /></span> : null
          //   }
          //                 {/*{*/}
          //                     {/*btnRights.freeze ?*/}
          //                         {/*<span>*/}
          //         {/*<Popconfirm*/}
          //             {/*title={`确认${record.status ? '解冻' : '冻结'}账户?`}*/}
          //             {/*placement="left"*/}
          //             {/*onConfirm={() => this.handleChangeStatus(record.id, `${record.status ? 0 : 1}`)}*/}
          //         {/*>*/}
          //           {/*<a>{record.status ? '解冻账户' : '冻结账户'}</a>*/}
          //         {/*</Popconfirm>*/}
          //       {/*</span> : null*/}
          //                 {/*}*/}
          //                 {/*{*/}
          //                  {/*<span className="ant-divider" />*/}
          //                  {/*btnRights.delete ?*/}
          //                  {/*<Popconfirm title="删除?" placement="left" onConfirm={() => this.handleDelete(record.id)}>*/}
          //                  {/*<a>删除</a>*/}
          //                  {/*</Popconfirm> : null*/}
          //                  {/*}*/}
          // </span>
          //         )
          //     },
        },
      ]
    }

    render() {
      const {
        userDeptResult,
        userListResult,
        userDetailResult,
        userRoleSetResult,
        pageLoading,
      } = this.state
      const { btnRights } = this.state
      const { getFieldDecorator } = this.props.form
      const thevalue = this.state.moduletype === 'add' ? '' : userDetailResult


      return (
        <div className="page page-scrollfix page-usermanage">
          <Layout>
            <Layout className="page-body">
              <Content>
                {/* <h3 className="page-title"> */}
                {/* </h3> */}
                <div className="page-header">
                  <div className="layout-between">
                    <Form className="flexrow" onSubmit={e => this.handleSearch(e)}>
                      <FormItem>
                        {getFieldDecorator('key')(<Input className="input-base-width" size="default" placeholder="请输入名称进行搜索" />)}
                      </FormItem>
                      <Button type="primary" htmlType="submit" >搜索</Button>
                      <Button type="primary" style={{ marginRight: '10px', marginLeft: '20px' }} onClick={() => this.policeAdd()}> 新增</Button>
                      <Button type="primary" loading={this.state.synchronizeLoading} onClick={() => this.synchronize()}> 同步</Button>
                    </Form>
                  </div>
                </div>
                <div className="page-content has-pagination table-flex table-scrollfix">
                  {/* <TableList */}
                  {/* rowKey="id" */}
                  {/* columns={this.renderColumn()}      //表头 */}
                  {/* dataSource={this.state.exampleList}  //数据源 */}
                  {/* loading={pageLoading.loading}  //加载 */}
                  {/* // currentPage={this.state.searchKey.pageNo}   //开始页 */}
                  {/* // pageSize={this.state.searchKey.pageSize}   //一页展示条数 */}
                  {/* // scroll={{ y: true }} */}
                  {/* // onChange={this.pageChange}   //值改变 */}
                  {/* // onShowSizeChange={this.pageSizeChange}   //展示多少条 */}
                  {/* // totalCount={this.state.exampleList.length}  //左边长度 */}
                  {/* /> */}
                  <Table
                    rowKey="id"
                    columns={this.renderColumn()}
                    dataSource={this.state.exampleList}
                    loading={pageLoading.loading}
                  />

                </div>
                <div className="page-footer">
                  <div className="page-footer-buttons" />
                </div>
              </Content>
            </Layout>
          </Layout>

          {/* 允许新增的判断 */}
          {
            this.state.PoliceAddVisible ?
              <AddPolice
                visible={this.state.PoliceAddVisible}
                title={this.state.moduletitle}
                handleOk={() => this.handleOk()}
                values={thevalue}
                deptId={this.state.searchKey.deptCode}
                currPeopleId={this.state.currPeopleId}
                type={this.state.moduletype}
                onCancel={this.handleCancel}
                roleList={userRoleSetResult.list || []}
              />
              : null
          }
          {/* { */}
          {/* this.state.RoleVisible ? */}
          {/* <SelectRole */}
          {/* visible={this.state.RoleVisible} */}
          {/* handleOkRole={() => this.handleOkRole()} */}
          {/* values={userDetailResult} */}
          {/* currPeopleId={this.state.currPeopleId} */}
          {/* select={userRoleSetResult.list} */}
          {/* onCancel={() => this.handleCancelRole()} */}
          {/* /> */}
          {/* : null */}
          {/* } */}

        </div>
      )
    }
}
