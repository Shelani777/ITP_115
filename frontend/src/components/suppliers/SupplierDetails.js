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
  Divider
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  BankOutlined,
  ShoppingOutlined
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

  if (loading) {
    return <Card loading={true} />;
  }

  return (
    <Card
      title={
        <Space>
          <Avatar icon={<BankOutlined />} />
          <span>{supplier?.companyName}</span>
          <Tag color={supplier?.status === 'active' ? 'green' : 'red'}>
            {supplier?.status?.toUpperCase()}
          </Tag>
        </Space>
      }
      extra={
        <Space>
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/suppliers')}
          >
            Back
          </Button>
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => navigate(`/suppliers/edit/${id}`)}
          >
            Edit
          </Button>
        </Space>
      }
    >
      {/* Summary Statistics */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Orders"
              value={supplier?.performance?.totalOrders || 0}
              prefix={<ShoppingOutlined />}
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
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Quality Rating"
              value={supplier?.performance?.qualityRating || 0}
              suffix="/100"
            />
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1">
        {/* Basic Information */}
        <TabPane tab="Basic Information" key="1">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Supplier Code">
              <Tag color="blue">{supplier?.supplierCode}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Rating">
              <Rate disabled defaultValue={supplier?.supplierRating} allowHalf />
            </Descriptions.Item>
            <Descriptions.Item label="Contact Person">
              {supplier?.contactPerson?.name}
            </Descriptions.Item>
            <Descriptions.Item label="Designation">
              {supplier?.contactPerson?.designation}
            </Descriptions.Item>
            <Descriptions.Item label="Categories">
              {supplier?.categories?.map(cat => (
                <Tag key={cat} color="blue">{cat}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Payment Terms">
              {supplier?.paymentTerms?.replace('_', ' ')}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        {/* Contact Information */}
        <TabPane tab="Contact Information" key="2">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Phone">
              <PhoneOutlined /> {supplier?.contactInfo?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Mobile">
              {supplier?.contactInfo?.mobile}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <MailOutlined /> {supplier?.contactInfo?.email}
            </Descriptions.Item>
            <Descriptions.Item label="Website">
              <GlobalOutlined /> {supplier?.contactInfo?.website}
            </Descriptions.Item>
            <Descriptions.Item label="Address" span={2}>
              {supplier?.address?.street}, {supplier?.address?.city}, {' '}
              {supplier?.address?.state} - {supplier?.address?.postalCode}, {' '}
              {supplier?.address?.country}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        {/* Business Details */}
        <TabPane tab="Business Details" key="3">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Registration No">
              {supplier?.businessDetails?.registrationNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Tax ID">
              {supplier?.businessDetails?.taxId}
            </Descriptions.Item>
            <Descriptions.Item label="Business Type">
              {supplier?.businessDetails?.businessType}
            </Descriptions.Item>
            <Descriptions.Item label="Established">
              {supplier?.businessDetails?.establishedYear}
            </Descriptions.Item>
            <Descriptions.Item label="Notes" span={2}>
              {supplier?.notes || 'No notes available'}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        {/* Bank Details */}
        <TabPane tab="Bank Details" key="4">
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Bank Name">
              {supplier?.bankDetails?.bankName}
            </Descriptions.Item>
            <Descriptions.Item label="Branch">
              {supplier?.bankDetails?.branch}
            </Descriptions.Item>
            <Descriptions.Item label="Account Number">
              {supplier?.bankDetails?.accountNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Account Holder">
              {supplier?.bankDetails?.accountHolder}
            </Descriptions.Item>
            <Descriptions.Item label="SWIFT Code">
              {supplier?.bankDetails?.swiftCode}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>

        {/* Recent Orders */}
        <TabPane tab="Recent Orders" key="5">
          <Table
            dataSource={recentOrders}
            columns={[
              {
                title: 'PO Number',
                dataIndex: 'poNumber',
                key: 'poNumber'
              },
              {
                title: 'Date',
                dataIndex: 'createdAt',
                key: 'date',
                render: (date) => moment(date).format('YYYY-MM-DD')
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
                render: (status) => (
                  <Tag color={
                    status === 'completed' ? 'green' : 
                    status === 'pending' ? 'orange' : 'blue'
                  }>
                    {status}
                  </Tag>
                )
              }
            ]}
            pagination={false}
          />
        </TabPane>
      </Tabs>
    </Card>
  );
};

export default SupplierDetails;

