import React from 'react';
import { Card, Tag, Rate, Space, Tooltip } from 'antd';
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const SupplierCard = ({ supplier }) => {
  const navigate = useNavigate();

  const statusColors = {
    active: 'green',
    inactive: 'red',
    blacklisted: 'darkred',
    pending: 'orange'
  };

  return (
    <Card
      hoverable
      style={{ marginBottom: 16 }}
      onClick={() => navigate(`/suppliers/${supplier._id}`)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
        <div>
          <h3>{supplier.companyName}</h3>
          <Tag color={statusColors[supplier.status]}>
            {supplier.status?.toUpperCase()}
          </Tag>
        </div>
        <Rate disabled defaultValue={supplier.supplierRating} allowHalf />
      </div>

      <div style={{ marginTop: 12 }}>
        <div><PhoneOutlined /> {supplier.contactInfo?.phone || 'N/A'}</div>
        <div><MailOutlined /> {supplier.contactInfo?.email || 'N/A'}</div>
        <div><EnvironmentOutlined /> {supplier.address?.city || 'N/A'}</div>
      </div>

      <div style={{ marginTop: 12 }}>
        {supplier.categories?.map(cat => (
          <Tag key={cat} color="blue">{cat}</Tag>
        ))}
      </div>

      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between' }}>
        <Tooltip title="Total Orders">
          <Space>
            <ShoppingOutlined />
            <span>{supplier.performance?.totalOrders || 0}</span>
          </Space>
        </Tooltip>
        <Tooltip title="On-Time Delivery">
          <span>{supplier.performance?.onTimeDelivery || 0}%</span>
        </Tooltip>
      </div>
    </Card>
  );
};

export default SupplierCard;
