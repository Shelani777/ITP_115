import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  List,
  Avatar,
  Progress,
  Space,
  Select,
  DatePicker
} from 'antd';
import {
  ShoppingOutlined,
  DollarCircleOutlined,
  StarOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  ShopOutlined
} from '@ant-design/icons';
import { supplierService } from '../../services/supplierService';
import { Line, Pie, Column } from '@ant-design/charts';
import moment from 'moment';

const { RangePicker } = DatePicker;
const { Option } = Select;

const SupplierDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalOrders: 0,
    totalSpent: 0,
    averageRating: 0,
    pendingOrders: 0
  });
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const response = await supplierService.getSuppliers({ limit: 100 });
      const suppliers = response.data;
      
      // Calculate statistics
      const active = suppliers.filter(s => s.status === 'active').length;
      const totalOrders = suppliers.reduce((acc, s) => acc + (s.performance?.totalOrders || 0), 0);
      const totalSpent = suppliers.reduce((acc, s) => acc + (s.performance?.totalSpent || 0), 0);
      const avgRating = suppliers.reduce((acc, s) => acc + (s.supplierRating || 0), 0) / suppliers.length;

      setStats({
        totalSuppliers: suppliers.length,
        activeSuppliers: active,
        totalOrders: totalOrders,
        totalSpent: totalSpent,
        averageRating: avgRating || 0,
        pendingOrders: 12 // Example data - replace with actual
      });

      // Top rated suppliers
      setTopSuppliers(
        suppliers
          .filter(s => s.status === 'active')
          .sort((a, b) => b.supplierRating - a.supplierRating)
          .slice(0, 5)
          .map(s => ({
            ...s,
            key: s._id
          }))
      );

      // Category distribution (example data)
      setCategoryData([
        { category: 'Spare Parts', count: 45 },
        { category: 'Oils', count: 20 },
        { category: 'Tools', count: 15 },
        { category: 'Batteries', count: 12 },
        { category: 'Tyres', count: 8 }
      ]);

      // Monthly trend data
      setMonthlyData([
        { month: 'Jan', orders: 12, value: 45000 },
        { month: 'Feb', orders: 15, value: 52000 },
        { month: 'Mar', orders: 18, value: 61000 },
        { month: 'Apr', orders: 22, value: 78000 },
        { month: 'May', orders: 25, value: 82000 },
        { month: 'Jun', orders: 28, value: 95000 }
      ]);

      // Recent activities
      setRecentActivities([
        {
          id: 1,
          title: 'New supplier added: Auto Parts Ltd',
          time: '5 minutes ago',
          type: 'add'
        },
        {
          id: 2,
          title: 'Purchase order #PO2402 approved',
          time: '1 hour ago',
          type: 'approve'
        },
        {
          id: 3,
          title: 'Goods received from Parts Hub',
          time: '3 hours ago',
          type: 'receive'
        },
        {
          id: 4,
          title: 'Payment made to Supplier Co',
          time: '5 hours ago',
          type: 'payment'
        }
      ]);

    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  // Chart configurations
  const lineConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
    smooth: true,
  };

  const pieConfig = {
    data: categoryData,
    angleField: 'count',
    colorField: 'category',
    radius: 0.8,
    label: {
      type: 'outer',
      content: '{name} {percentage}',
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const columnConfig = {
    data: monthlyData,
    xField: 'month',
    yField: 'orders',
    label: {
      position: 'middle',
      style: {
        fill: '#FFFFFF',
        opacity: 0.6,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
      },
    },
    meta: {
      month: {
        alias: 'Month',
      },
      orders: {
        alias: 'Orders',
      },
    },
  };

  const columns = [
    {
      title: 'Supplier',
      dataIndex: 'companyName',
      key: 'name',
      render: (text, record) => (
        <Space>
          <Avatar icon={<ShopOutlined />} />
          <span>{text}</span>
        </Space>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'supplierRating',
      key: 'rating',
      render: (rating) => (
        <Space>
          <StarOutlined style={{ color: '#faad14' }} />
          <span>{rating}/5</span>
        </Space>
      )
    },
    {
      title: 'Orders',
      dataIndex: ['performance', 'totalOrders'],
      key: 'orders',
      render: (val) => val || 0
    },
    {
      title: 'On-Time',
      dataIndex: ['performance', 'onTimeDelivery'],
      key: 'ontime',
      render: (val) => <span>{val || 0}%</span>
    }
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <h1>Supplier Dashboard</h1>
        <Space>
          <Select 
            defaultValue="month" 
            onChange={setTimeRange}
            style={{ width: 120 }}
          >
            <Option value="week">This Week</Option>
            <Option value="month">This Month</Option>
            <Option value="quarter">This Quarter</Option>
            <Option value="year">This Year</Option>
          </Select>
          <RangePicker />
        </Space>
      </div>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Suppliers"
              value={stats.totalSuppliers}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress 
              percent={Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100) || 0} 
              size="small"
              format={() => `${stats.activeSuppliers} Active`}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Space>
              <RiseOutlined style={{ color: '#52c41a' }} />
              <span>↑ 12% from last month</span>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Total Spent"
              value={stats.totalSpent}
              prefix="Rs."
              precision={2}
              valueStyle={{ color: '#faad14' }}
            />
            <Space>
              <FallOutlined style={{ color: '#f5222d' }} />
              <span>↓ 5% from last month</span>
            </Space>
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="Average Rating"
              value={stats.averageRating}
              prefix={<StarOutlined />}
              suffix="/5"
              precision={1}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="Monthly Purchase Trend" loading={loading}>
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Purchase by Category" loading={loading}>
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={12}>
          <Card title="Monthly Orders" loading={loading}>
            <Column {...columnConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Performance Metrics" loading={loading}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="On-Time Delivery"
                  value={85}
                  suffix="%"
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Quality Score"
                  value={92}
                  suffix="%"
                  prefix={<StarOutlined />}
                />
              </Col>
            </Row>
            <Progress percent={85} status="active" strokeColor="#52c41a" />
            <Progress percent={92} status="active" strokeColor="#1890ff" />
          </Card>
        </Col>
      </Row>

      {/* Tables and Lists */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Top Rated Suppliers" loading={loading}>
            <Table
              dataSource={topSuppliers}
              columns={columns}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Activities" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar icon={
                        item.type === 'add' ? <UserOutlined /> :
                        item.type === 'approve' ? <CheckCircleOutlined /> :
                        <WarningOutlined />
                      } />
                    }
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      {/* Low Stock Alert */}
      <Card style={{ marginTop: 16, backgroundColor: '#fff7e6' }}>
        <Space>
          <WarningOutlined style={{ color: '#faad14', fontSize: 24 }} />
          <div>
            <strong>Low Stock Alert:</strong> 5 items are below minimum threshold
          </div>
          <Button type="link">Create Purchase Order</Button>
        </Space>
      </Card>
    </div>
  );
};

export default SupplierDashboard;
