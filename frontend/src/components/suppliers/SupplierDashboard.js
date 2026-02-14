import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Progress,
  List,
  Avatar
} from 'antd';
import {
  ShoppingOutlined,
  DollarCircleOutlined,
  StarOutlined,
  WarningOutlined,
  CheckCircleOutlined
} from '@ant-design/icons';
import { supplierService } from '../../services/supplierService';
import { Line, Pie } from '@ant-design/charts';

const SupplierDashboard = () => {
  const [stats, setStats] = useState({
    totalSuppliers: 0,
    activeSuppliers: 0,
    totalOrders: 0,
    pendingPayments: 0
  });
  const [topSuppliers, setTopSuppliers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await supplierService.getSuppliers({ limit: 100 });
      const suppliers = response.data;
      
      // Calculate stats
      setStats({
        totalSuppliers: suppliers.length,
        activeSuppliers: suppliers.filter(s => s.status === 'active').length,
        totalOrders: suppliers.reduce((acc, s) => acc + (s.performance?.totalOrders || 0), 0),
        pendingPayments: suppliers.reduce((acc, s) => acc + (s.performance?.totalSpent || 0), 0)
      });

      // Top rated suppliers
      setTopSuppliers(
        suppliers
          .filter(s => s.status === 'active')
          .sort((a, b) => b.supplierRating - a.supplierRating)
          .slice(0, 5)
      );
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    }
  };

  // Chart configurations
  const lineConfig = {
    data: [
      { month: 'Jan', orders: 12 },
      { month: 'Feb', orders: 15 },
      { month: 'Mar', orders: 18 },
      { month: 'Apr', orders: 22 },
      { month: 'May', orders: 25 },
      { month: 'Jun', orders: 28 }
    ],
    xField: 'month',
    yField: 'orders',
    point: {
      size: 5,
      shape: 'diamond'
    }
  };

  const pieConfig = {
    data: [
      { type: 'Spare Parts', value: 45 },
      { type: 'Oils', value: 20 },
      { type: 'Tools', value: 15 },
      { type: 'Batteries', value: 12 },
      { type: 'Others', value: 8 }
    ],
    angleField: 'value',
    colorField: 'type',
    radius: 0.8
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Suppliers"
              value={stats.totalSuppliers}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress percent={75} showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Suppliers"
              value={stats.activeSuppliers}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress 
              percent={Math.round((stats.activeSuppliers / stats.totalSuppliers) * 100)} 
              status="active"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={stats.totalOrders}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Pending Payments"
              value={stats.pendingPayments}
              prefix="Rs."
              precision={2}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Monthly Orders Trend">
            <Line {...lineConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Purchase by Category">
            <Pie {...pieConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Top Rated Suppliers">
            <List
              itemLayout="horizontal"
              dataSource={topSuppliers}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<StarOutlined />} />}
                    title={item.companyName}
                    description={
                      <>
                        <Rate disabled defaultValue={item.supplierRating} allowHalf />
                        <Tag color="blue" style={{ marginLeft: 8 }}>
                          Orders: {item.performance?.totalOrders || 0}
                        </Tag>
                      </>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Activities">
            <List
              itemLayout="horizontal"
              dataSource={recentActivities}
              renderItem={item => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<WarningOutlined />} />}
                    title={item.title}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SupplierDashboard;

