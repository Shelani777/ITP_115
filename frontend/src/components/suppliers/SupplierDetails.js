import React, { useState, useEffect } from 'react';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Tag,
  Rate,
  Tabs,
  Table,
  Statistic,
  Row,
  Col,
  message,
  Avatar,
  Divider,
  Timeline,
  Badge
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  BankOutlined,
  ShoppingOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DollarCircleOutlined,
  StarOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierService } from '../../services/supplierService';
import moment from 'moment';

const { TabPane } = Tabs;

const SupplierDetails = () => {
  const [supplier, setSupplier] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadSupplierDetails();
  }, [id]);

  const loadSupplierDetails = async () => {
    try {
      const response = await supplierService.getSupplier(id);
      setSupplier(response.data.supplier);
      setRecentOrders(response.data.recentOrders || []);
    } catch (error) {
      message.error('Failed to load supplier details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'green',
      inactive: 'red',
      blacklisted: 'darkred',
      pending: 'orange'
    };
    return colors[status] || 'default';
  };

  const getPaymentTermText = (term) => {
    const terms = {
      immediate: 'Immediate Payment',
      '7_days': '7 Days',
      '15_days': '15 Days',
      '30_days': '30 Days',
      '45_days': '45 Days',
      '60_days': '60 Days'
    };
    return terms[term] || term;
  };

  if (loading) {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <ClockCircleOutlined spin style={{ fontSize: 40 }} />
          <p>Loading supplier details...</p>
        </div>
      </Card>
    );
  }

  return (
    <div>
      {/* Header */}
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space size="large">
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/suppliers')}
            >
              Back
            </Button>
            <div>
              <Avatar 
                size={64} 
                icon={<BankOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
            </div>
            <div>
              <h1>{supplier?.companyName}</h1>
              <Space>
                <Tag color={getStatusColor(supplier?.status)}>
                  {supplier?.status?.toUpperCase()}
                </Tag>
                <Tag color="blue">{supplier?.supplierCode}</Tag>
                <Rate disabled defaultValue={supplier?.supplierRating} allowHalf />
              </Space>
            </div>
          </Space>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/suppliers/edit/${id}`)}
          >
            Edit Supplier
          </Button>
        </div>
      </Card>

      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={supplier?.performance?.totalOrders || 0}
              prefix={<ShoppingOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Spent"
              value={supplier?.performance?.totalSpent || 0}
              prefix="Rs."
              precision={2}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="On-Time Delivery"
              value={supplier?.performance?.onTimeDelivery || 0}
              suffix="%"
              precision={1}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quality Rating"
              value={supplier?.performance?.qualityRating || 0}
              suffix="/100"
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card>
        <Tabs defaultActiveKey="1">
          {/* Basic Information Tab */}
          <TabPane 
            tab={<span><BankOutlined />Basic Information</span>} 
            key="1"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Supplier Code">
                    <Tag color="blue">{supplier?.supplierCode}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Company Name">
                    {supplier?.companyName}
                  </Descriptions.Item>
                  <Descriptions.Item label="Contact Person">
                    {supplier?.contactPerson?.name || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Designation">
                    {supplier?.contactPerson?.designation || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Categories">
                    {supplier?.categories?.map(cat => (
                      <Tag key={cat} color="blue">{cat}</Tag>
                    ))}
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Terms">
                    {getPaymentTermText(supplier?.paymentTerms)}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rating">
                    <Rate disabled defaultValue={supplier?.supplierRating} allowHalf />
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions bordered column={1}>
                  <Descriptions.Item label="Business Registration">
                    {supplier?.businessDetails?.registrationNumber || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Tax ID">
                    {supplier?.businessDetails?.taxId || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Business Type">
                    {supplier?.businessDetails?.businessType || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Established Year">
                    {supplier?.businessDetails?.establishedYear || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Added Date">
                    {moment(supplier?.createdAt).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Last Updated">
                    {moment(supplier?.updatedAt).format('YYYY-MM-DD')}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </TabPane>

          {/* Contact Information Tab */}
          <TabPane 
            tab={<span><PhoneOutlined />Contact Details</span>} 
            key="2"
          >
            <Row gutter={24}>
              <Col span={12}>
                <Descriptions bordered column={1} title="Contact Info">
                  <Descriptions.Item label="Phone">
                    <PhoneOutlined /> {supplier?.contactInfo?.phone || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Mobile">
                    {supplier?.contactInfo?.mobile || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <MailOutlined /> {supplier?.contactInfo?.email || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Website">
                    <GlobalOutlined /> {supplier?.contactInfo?.website || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Fax">
                    {supplier?.contactInfo?.fax || 'N/A'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
              <Col span={12}>
                <Descriptions bordered column={1} title="Address">
                  <Descriptions.Item label="Street">
                    {supplier?.address?.street || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="City">
                    {supplier?.address?.city || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="State">
                    {supplier?.address?.state || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Postal Code">
                    {supplier?.address?.postalCode || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Country">
                    {supplier?.address?.country || 'Sri Lanka'}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </TabPane>

          {/* Bank Details Tab */}
          <TabPane 
            tab={<span><BankOutlined />Bank Details</span>} 
            key="3"
          >
            <Descriptions bordered column={2}>
              <Descriptions.Item label="Bank Name">
                {supplier?.bankDetails?.bankName || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Branch">
                {supplier?.bankDetails?.branch || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Account Number">
                {supplier?.bankDetails?.accountNumber || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="Account Holder">
                {supplier?.bankDetails?.accountHolder || 'N/A'}
              </Descriptions.Item>
              <Descriptions.Item label="SWIFT Code">
                {supplier?.bankDetails?.swiftCode || 'N/A'}
              </Descriptions.Item>
            </Descriptions>
          </TabPane>

          {/* Recent Orders Tab */}
          <TabPane 
            tab={<span><ShoppingOutlined />Recent Orders</span>} 
            key="4"
          >
            <Table
              dataSource={recentOrders}
              columns={[
                {
                  title: 'PO Number',
                  dataIndex: 'poNumber',
                  key: 'poNumber',
                  render: (text) => <Tag color="blue">{text}</Tag>
                },
                {
                  title: 'Order Date',
                  dataIndex: 'orderDate',
                  key: 'date',
                  render: (date) => moment(date).format('YYYY-MM-DD')
                },
                {
                  title: 'Items',
                  dataIndex: 'items',
                  key: 'items',
                  render: (items) => items?.length || 0
                },
                {
                  title: 'Total',
                  dataIndex: 'grandTotal',
                  key: 'total',
                  render: (val) => `Rs. ${val?.toFixed(2)}`
                },
                {
                  title: 'Status',
                  dataIndex: 'status',
                  key: 'status',
                  render: (status) => {
                    const colors = {
                      completed: 'green',
                      pending: 'orange',
                      approved: 'blue',
                      cancelled: 'red'
                    };
                    return <Tag color={colors[status]}>{status}</Tag>;
                  }
                }
              ]}
              pagination={{ pageSize: 5 }}
            />
          </TabPane>

          {/* Notes Tab */}
          <TabPane 
            tab={<span><ClockCircleOutlined />Notes</span>} 
            key="5"
          >
            <Card>
              <p>{supplier?.notes || 'No notes available'}</p>
              <Divider />
              <Timeline>
                <Timeline.Item color="green">
                  <p>Supplier added by {supplier?.createdBy?.name}</p>
                  <p>{moment(supplier?.createdAt).format('YYYY-MM-DD HH:mm')}</p>
                </Timeline.Item>
                {supplier?.updatedAt && supplier?.updatedAt !== supplier?.createdAt && (
                  <Timeline.Item color="blue">
                    <p>Last updated</p>
                    <p>{moment(supplier?.updatedAt).format('YYYY-MM-DD HH:mm')}</p>
                  </Timeline.Item>
                )}
              </Timeline>
            </Card>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default SupplierDetails;

