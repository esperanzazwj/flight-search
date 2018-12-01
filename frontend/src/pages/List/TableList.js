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
    sort: 1,
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

  addWish = item => {
    const { dispatch } = this.props;
    if (item) {
      window.alert("Add to wish list");
      console.log('id: ', item[0].id);
      const wid = item[0].id;
      dispatch({
        type: 'flights/add',
        payload: { wid },
      });
    }
  };

  handleSort = rule => {
    const { sort } = this.state;
    this.setState({
      sort: rule,
    });
    // window.alert('sort' + rule);
  }

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

  sortBeforeRender(item) {
    const { sort } = this.state;
    if (item) {
      if (sort === 1) {
        console.log('sort: ', item[0]);
        item.sort(
          function(a, b) {
            var keyA = a[0].price, keyB = b[0].price;
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
      }
      else if (sort === 2) {
        item.sort(function(a, b){
          var keyA = a[0].price, keyB = b[0].price;
          if(keyA < keyB) return 1;
          if(keyA > keyB) return -1;
          return 0;
        });
      }
      else if (sort === 0) {
        item.sort(function(a, b){
          var keyA = a[0].duration, keyB = b[0].duration;
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });
      }
      else if (sort === 3) {
        item.sort(function(a, b){
          var keyA = a[0].d_time, keyB = b[0].d_time;
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });
      }
      else if (sort === 4) {
        item.sort(function(a, b){
          var keyA = a[0].d_time, keyB = b[0].d_time;
          if(keyA < keyB) return 1;
          if(keyA > keyB) return -1;
          return 0;
        });
      }
      else if (sort === 5) {
        item.sort(function(a, b){
          var keyA = a[0].a_time, keyB = b[0].a_time;
          if(keyA < keyB) return -1;
          if(keyA > keyB) return 1;
          return 0;
        });
      }
      else if (sort === 6) {
        item.sort(function(a, b){
          var keyA = a[0].a_time, keyB = b[0].a_time;
          if(keyA < keyB) return 1;
          if(keyA > keyB) return -1;
          return 0;
        });
      }
    }
  }

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
              {getFieldDecorator('origin', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
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
          <Col md={8} sm={24}>
            <FormItem label="Sort">
              {getFieldDecorator('sort')(
                <Select placeholder="Price(Low-High)" style={{ width: '100%' }} >
                  <Option value="Shortest" onClick={this.handleSort.bind(this,0)}>Shortest</Option>
                  <Option value="Price(Low-High)" onClick={this.handleSort.bind(this,1)}>Price(Low-High)</Option>
                  <Option value="Price(High-Low)" onClick={this.handleSort.bind(this,2)}>Price(High-Low)</Option>
                  <Option value="Departure(00:00-23:59)" onClick={this.handleSort.bind(this,3)}>Departure(00:00-23:59)</Option>
                  <Option value="Departure(23:59-00:00)" onClick={this.handleSort.bind(this,4)}>Departure(23:59-00:00)</Option>
                  <Option value="Arrival(00:00-23:59)" onClick={this.handleSort.bind(this,5)}>Arrival(00:00-23:59)</Option>
                  <Option value="Arrival(23:59-00:00)" onClick={this.handleSort.bind(this,6)}>Arrival(23:59-00:00)</Option>
                </Select>
              )}
            </FormItem>
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
              {getFieldDecorator('origin', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Departing">
              {getFieldDecorator('depart', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
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
          <Col md={8} sm={24}>
            <FormItem label="Sort">
              {getFieldDecorator('sort')(
                <Select placeholder="Price(Low-High)" style={{ width: '100%' }} >
                  <Option value="Shortest" onClick={this.handleSort.bind(this,0)}>Shortest</Option>
                  <Option value="Price(Low-High)" onClick={this.handleSort.bind(this,1)}>Price(Low-High)</Option>
                  <Option value="Price(High-Low)" onClick={this.handleSort.bind(this,2)}>Price(High-Low)</Option>
                  <Option value="Departure(00:00-23:59)" onClick={this.handleSort.bind(this,3)}>Departure(00:00-23:59)</Option>
                  <Option value="Departure(23:59-00:00)" onClick={this.handleSort.bind(this,4)}>Departure(23:59-00:00)</Option>
                  <Option value="Arrival(00:00-23:59)" onClick={this.handleSort.bind(this,5)}>Arrival(00:00-23:59)</Option>
                  <Option value="Arrival(23:59-00:00)" onClick={this.handleSort.bind(this,6)}>Arrival(23:59-00:00)</Option>
                </Select>
              )}
            </FormItem>
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
              {getFieldDecorator('origin', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
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
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="Duration">
              {getFieldDecorator('max_duration')(<Input placeholder="Maximum hours" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{ marginLeft:96 }}>
            <FormItem label="Lowest Price">
              {getFieldDecorator('low_price')(<Input />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{ marginLeft:24 }}>
            <FormItem label="Highest Price">
              {getFieldDecorator('high_price')(<Input />)}
            </FormItem>
          </Col>
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
                    <TagSelect.Option value="0">Nonstop</TagSelect.Option>
                    <TagSelect.Option value="1">1 Stop</TagSelect.Option>
                    <TagSelect.Option value="3">2+ Stops</TagSelect.Option>
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
                Up <Icon type="up" />
              </a>
            </span>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Sort">
              {getFieldDecorator('sort')(
                <Select placeholder="Price(Low-High)" style={{ width: '100%' }}>
                  <Option value="Shortest" onClick={this.handleSort.bind(this,0)}>Shortest</Option>
                  <Option value="Price(Low-High)" onClick={this.handleSort.bind(this,1)}>Price(Low-High)</Option>
                  <Option value="Price(High-Low)" onClick={this.handleSort.bind(this,2)}>Price(High-Low)</Option>
                  <Option value="Departure(00:00-23:59)" onClick={this.handleSort.bind(this,3)}>Departure(00:00-23:59)</Option>
                  <Option value="Departure(23:59-00:00)" onClick={this.handleSort.bind(this,4)}>Departure(23:59-00:00)</Option>
                  <Option value="Arrival(00:00-23:59)" onClick={this.handleSort.bind(this,5)}>Arrival(00:00-23:59)</Option>
                  <Option value="Arrival(23:59-00:00)" onClick={this.handleSort.bind(this,6)}>Arrival(23:59-00:00)</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
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
              {getFieldDecorator('origin', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={12} sm={24}>
            <FormItem label="Destination">
              {getFieldDecorator('destination', {rules: [{ required: true }]})(
                <Select placeholder="City" style={{ width: '100%' }}>
                  <Option value="New York">New York</Option>
                  <Option value="Los Angeles">Los Angeles</Option>
                  <Option value="San Francisco">San Francisco</Option>
                  <Option value="Chicago">Chicago</Option>
                  <Option value="Seattle">Seattle</Option>
                  <Option value="Washington DC">Washington DC</Option>
                  <Option value="Dallas">Dallas</Option>
                  <Option value="Philadelphia">Philadelphia</Option>
                  <Option value="Houston">Houston</Option>
                  <Option value="Phoenix">Phoenix</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Departing">
              {getFieldDecorator('depart', {rules: [{ required: true }]})(
                <DatePicker style={{ width: '100%' }} placeholder="YYYY-MM-DD" />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            <FormItem label="Duration">
              {getFieldDecorator('max_duration')(<Input placeholder="Maximum hours" />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{ marginLeft:96 }}>
            <FormItem label="Lowest Price">
              {getFieldDecorator('low_price')(<Input />)}
            </FormItem>
          </Col>
          <Col md={4} sm={24} style={{ marginLeft:24 }}>
            <FormItem label="Highest Price">
              {getFieldDecorator('high_price')(<Input />)}
            </FormItem>
          </Col>
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
                    <TagSelect.Option value="0">Nonstop</TagSelect.Option>
                    <TagSelect.Option value="1">1 Stop</TagSelect.Option>
                    <TagSelect.Option value="3">2+ Stops</TagSelect.Option>
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
                Up <Icon type="up" />
              </a>
            </span>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="Sort">
              {getFieldDecorator('sort')(
                <Select placeholder="Price(Low-High)" style={{ width: '100%' }}>
                  <Option value="Shortest" onClick={this.handleSort.bind(this,0)}>Shortest</Option>
                  <Option value="Price(Low-High)" onClick={this.handleSort.bind(this,1)}>Price(Low-High)</Option>
                  <Option value="Price(High-Low)" onClick={this.handleSort.bind(this,2)}>Price(High-Low)</Option>
                  <Option value="Departure(00:00-23:59)" onClick={this.handleSort.bind(this,3)}>Departure(00:00-23:59)</Option>
                  <Option value="Departure(23:59-00:00)" onClick={this.handleSort.bind(this,4)}>Departure(23:59-00:00)</Option>
                  <Option value="Arrival(00:00-23:59)" onClick={this.handleSort.bind(this,5)}>Arrival(00:00-23:59)</Option>
                  <Option value="Arrival(23:59-00:00)" onClick={this.handleSort.bind(this,6)}>Arrival(23:59-00:00)</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
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
    
    console.log('data before', this.props.flights.data);
    if (this.props.flights.data && this.props.flights.data.length > 0) {
      this.sortBeforeRender(this.props.flights.data);
    }
    console.log('data after', this.props.flights.data);
  
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
                  <Button style={{ marginLeft: 48 } } type="primary" htmlType="submit" onClick={() => this.addWish(item)}>
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
