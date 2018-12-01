import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import moment from 'moment';
import { connect } from 'dva';
import {
  List,
  Card,
  Row,
  Col,
  Radio,
  Input,
  Progress,
  Button,
  Icon,
  Dropdown,
  Menu,
  Avatar,
  Modal,
  Form,
  DatePicker,
  Select,
} from 'antd';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import Result from '@/components/Result';
import Ellipsis from '@/components/Ellipsis';

import styles from './BasicList.less';

const FormItem = Form.Item;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
const SelectOption = Select.Option;
const { Search, TextArea } = Input;

@connect(({ list, flights, loading }) => ({
  list,
  flights,
  loading: loading.models.wish,
}))
@Form.create()
class BasicList extends PureComponent {
  state = { visible: false, done: false };

  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'list/fetch',
      payload: {
        count: 5,
      },
    });
  }

  deleteItem = item => {
    const { dispatch } = this.props;
    const wid = item[0].id;
    dispatch({
      type: 'list/remove',
      payload: { wid },
    });
  };

  renderOneFlight(item, styles) {
    return (
      <List.Item>
        <Card
          className={styles.card}
          hoverable
        >
          <div className={styles.cardList}>
            <Card.Meta
              avatar={<Avatar src={item.logo} shape="square"/>}
              title={
                <a onClick={this.showDetails}>
                  <div>{item.airlines + ' ' + item.number}</div>
                </a>
              }
              description={
                <Ellipsis lines={2} style={{marginTop:24}}>{item.depart_time + ' - ' + item.arrival_time}</Ellipsis>
              }
            />
            <div className={styles.listContent} style={{display: 'flex'}} >
              <div className={styles.listContentItem} style={{ marginLeft: 400}}>
                <span>{item.hour + ' h ' + item.minute + ' m ' + item.stops}</span>
                <p>{item.departure + ' - ' + item.arrival}</p>
              </div>
              <div className={styles.listContentItem} style={{ marginLeft: 128}}>
                <span>{'$'+item.price}</span>
                <p>{item.r_type}</p>
              </div>
            </div>
          </div>
        </Card>
      </List.Item>
  );
}

  render() {
    const {
      list: { list },
      loading,
    } = this.props;
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { visible, done, current = {} } = this.state;

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      pageSize: 5,
      total: 50,
    };

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card
            className={styles.listCard}
            bordered={false}
            title="Wish List"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
          >
            <List
              size="large"
              rowKey="id"
              loading={loading}
              pagination={paginationProps}
              dataSource={list}
              renderItem={item => (
                <List.Item>
                <div className="flightSetList">
                  <div className="flightSet"></div>
                  {item.map(i => this.renderOneFlight(i, styles))}
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ float: 'right', marginBottom: 24 }}>
                      <Button 
                        style={{ marginLeft: 48 }} 
                        type="primary" 
                        htmlType="submit" 
                        onClick={() => {
                          Modal.confirm({
                            title: 'Remove Item',
                            content: 'Really want to remove this flight from wish list?',
                            okText: 'OK',
                            cancelText: 'Cancel',
                            onOk: () => this.deleteItem(item),
                          });
                        }}
                      >
                        Remove from wish list
                      </Button>
                    </div>
                  </div>
                </div>
                </List.Item>
              )}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default BasicList;
