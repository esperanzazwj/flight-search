import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  List,
  Avatar,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import TagSelect from '@/components/TagSelect';
import AvatarList from '@/components/AvatarList';
import Ellipsis from '@/components/Ellipsis';
import StandardFormRow from '@/components/StandardFormRow';

import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ list, flights, loading }) => ({
  list,
  flights,
  loading: loading.models.flights,
}))
@Form.create()
class TableList extends PureComponent {
  state = {
    expandForm: false,
    roundtrip: false,
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
  };


  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };

  handleRoundtripChange = e => {
    const { roundtrip } = this.state;
    this.setState({
      roundtrip: e,
    });
    // window.alert('chunjie'+ roundtrip + e);
  };

  addWish = id => {
    const { dispatch } = this.props;
    window.alert("Add to wish list");
    dispatch({
      type: 'flights/add',
      payload: { id },
    });
  };

  handleSearch = e => {
    // Send all input and fetch list to show
    e.preventDefault();

    const { dispatch, form } = this.props;
    console.log('form: ', form);  
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      if(values.depart){
        values.depart=values.depart.format();
      }
      if(values.return){
        values.return=values.return.format();
      }
      this.setState({
        formValues: values,
      });
      console.log("values----", values);
      dispatch({
        type: 'flights/fetch',
        payload: values,
      });
    });
  };

  renderSimpleForm() {
    const {
      data,
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="Origin">
              {getFieldDecorator('origin', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Departing">
              {getFieldDecorator('depart', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Returning">
              {getFieldDecorator('return', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="Travelers">
              {getFieldDecorator('travelers')(
                <Select placeholder="1" style={{ width: '100%' }}>
                  <Option value="0">0</Option>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <Row>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Down <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderSimpleFormOneWay() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const flights = this.props.flights;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="Origin">
              {getFieldDecorator('origin', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <div>
             {/* {flights && JSON.stringify(flights) || 'no data'}  */}
          </div>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Departing">
              {getFieldDecorator('depart', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          {/* <Col md={12} sm={24}>
            <FormItem label="Travelers">
              {getFieldDecorator('travelers')(
                <Select placeholder="1" style={{ width: '100%' }}>
                  <Option value="0">0</Option>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <Row>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                Reset
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                Down <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="Origin">
              {getFieldDecorator('origin', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Departing">
              {getFieldDecorator('depart', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Returning">
              {getFieldDecorator('return', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="Travelers">
              {getFieldDecorator('travelers')(
                <Select placeholder="1" style={{ width: '100%' }}>
                  <Option value="0">0</Option>
                  <Option value="1">1</Option>
                  <Option value="2">2</Option>
                  <Option value="3">3</Option>
                  <Option value="4">4</Option>
                  <Option value="5">5</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <StandardFormRow block style={{ paddingBottom: 11 }}>
              <FormItem label="Airlines">
                {getFieldDecorator('airlines')(
                  <TagSelect expandable>
                    <TagSelect.Option value="airline1">American Airlines</TagSelect.Option>
                    <TagSelect.Option value="airline2">Alaska Airlines</TagSelect.Option>
                    <TagSelect.Option value="airline3">Frontier America</TagSelect.Option>
                    <TagSelect.Option value="airline4">JetBlue Airways</TagSelect.Option>
                    <TagSelect.Option value="airline5">Delta</TagSelect.Option>
                    <TagSelect.Option value="airline6">United</TagSelect.Option>
                    <TagSelect.Option value="airline7">Spirit Airlines</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
              <FormItem label="Stops">
                {getFieldDecorator('stops')(
                  <TagSelect>
                    <TagSelect.Option value="stop0">Nonstop</TagSelect.Option>
                    <TagSelect.Option value="stop1">1 Stop</TagSelect.Option>
                    <TagSelect.Option value="stop2">2+ Stops</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
              <FormItem label="Outbound departure time">
                {getFieldDecorator('out_time')(
                  <TagSelect expandable>
                    <TagSelect.Option value="out_time0">Early morning (12:00am-4:59am)</TagSelect.Option>
                    <TagSelect.Option value="out_time1">Morning (5:00am-11:59am)</TagSelect.Option>
                    <TagSelect.Option value="out_time2">Afternoon (12:00pm-5:59pm)</TagSelect.Option>
                    <TagSelect.Option value="out_time3">Evening (6:00pm-11:59pm)</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
              <FormItem label="Inbound departure time">
                {getFieldDecorator('in_time')(
                  <TagSelect expandable>
                    <TagSelect.Option value="in_time0">Early morning (12:00am-4:59am)</TagSelect.Option>
                    <TagSelect.Option value="in_time1">Morning (5:00am-11:59am)</TagSelect.Option>
                    <TagSelect.Option value="in_time2">Afternoon (12:00pm-5:59pm)</TagSelect.Option>
                    <TagSelect.Option value="in_time3">Evening (6:00pm-11:59pm)</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
          </StandardFormRow>
        
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Up <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderAdvancedFormOneWay() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={12} sm={24}>
            <FormItem label="Origin">
              {getFieldDecorator('origin', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(<Input placeholder="City or airport" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Departing">
              {getFieldDecorator('depart', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
          {/* <Col md={8} sm={24}>
            <FormItem label="Travelers">
              {getFieldDecorator('travelers')(
                <Select placeholder="1" style={{ width: '100%' }}>
                  <Option value="travel0">0</Option>
                  <Option value="travel1">1</Option>
                  <Option value="travel2">2</Option>
                  <Option value="travel3">3</Option>
                  <Option value="travel4">4</Option>
                  <Option value="travel5">5</Option>
                </Select>
              )}
            </FormItem>
          </Col> */}
        </Row>
        <StandardFormRow block style={{ paddingBottom: 11 }}>
              <FormItem label="Airlines">
                {getFieldDecorator('airlines')(
                  <TagSelect expandable>
                    <TagSelect.Option value="airline1">American Airlines</TagSelect.Option>
                    <TagSelect.Option value="airline2">Alaska Airlines</TagSelect.Option>
                    <TagSelect.Option value="airline3">Frontier America</TagSelect.Option>
                    <TagSelect.Option value="airline4">JetBlue Airways</TagSelect.Option>
                    <TagSelect.Option value="airline5">Delta</TagSelect.Option>
                    <TagSelect.Option value="airline6">United</TagSelect.Option>
                    <TagSelect.Option value="airline7">Spirit Airlines</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
              <FormItem label="Stops">
                {getFieldDecorator('stops')(
                  <TagSelect>
                    <TagSelect.Option value="stop0">Nonstop</TagSelect.Option>
                    <TagSelect.Option value="stop1">1 Stop</TagSelect.Option>
                    <TagSelect.Option value="stop2">2+ Stops</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
              <FormItem label="Departure time">
                {getFieldDecorator('out_time')(
                  <TagSelect expandable>
                    <TagSelect.Option value="out_time0">Early morning (12:00am-4:59am)</TagSelect.Option>
                    <TagSelect.Option value="out_time1">Morning (5:00am-11:59am)</TagSelect.Option>
                    <TagSelect.Option value="out_time2">Afternoon (12:00pm-5:59pm)</TagSelect.Option>
                    <TagSelect.Option value="out_time3">Evening (6:00pm-11:59pm)</TagSelect.Option>
                  </TagSelect>
                )}
              </FormItem>
          </StandardFormRow>
        
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              Reset
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              Up <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }

  renderForm() {
    const { expandForm, roundtrip } = this.state;
    return roundtrip? (expandForm ? this.renderAdvancedForm() : this.renderSimpleForm()) :
            (expandForm ? this.renderAdvancedFormOneWay() : this.renderSimpleFormOneWay());
  }

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
      list: { list = [] },
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const cardList = list ? (
      <List
        rowKey="id"
        loading={loading}
        grid={{ gutter: 24, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        dataSource={this.props.flights.data}
        renderItem={item => {
          return (
            <div className="flightSetList">
              <div className="flightSet"></div>
              {item.map(item => this.renderOneFlight(item, styles))}
              <div style={{ overflow: 'hidden' }}>
                <div style={{ float: 'right', marginBottom: 24 }}>
                  <Button style={{ marginLeft: 48 } } type="primary" htmlType="submit" onClick={() => this.addWish(item.id)}>
                    Add to wish list
                  </Button>
                </div>
              </div>
            </div>
          );
        }}
      />
    ) : null;
    console.log('XXX', this.props, this.state);
    return (
      <PageHeaderWrapper title="Flight search">
        <Card bordered={true}>
          <div className={styles.tableList}>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={12} sm={24}>
                <FormItem >
                  {getFieldDecorator('roundtrip', {
                      initialValue: '1',
                    })(
                      <RadioGroup>
                        <Radio value="1" onClick={this.handleRoundtripChange.bind(this,false)}>One-way</Radio>
                        <Radio value="2" onClick={this.handleRoundtripChange.bind(this,true)}>Roundtrip</Radio>
                      </RadioGroup>
                    )}
                </FormItem>
              </Col>
            </Row>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
          </div>
        </Card>
        <div className={styles.cardList}>{cardList}</div>
        {/* <div>{this.props && this.props.flights && this.props.flights.data.map(a => a.airlines)}</div> */}
      </PageHeaderWrapper>
    );
  }
}

export default TableList;
