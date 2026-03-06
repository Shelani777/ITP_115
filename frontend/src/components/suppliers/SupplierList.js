import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Input,
  Space,
  Tag,
  Rate,
  Card,
  Select,
  message,
  Modal,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExportOutlined
} from '@ant-design/icons';
import { supplierService } from '../../services/supplierService';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Option } = Select;
const { confirm } = Modal;

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    rating: ''
  });

  const navigate = useNavigate();

  // Load suppliers
  const loadSuppliers = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pagination.pageSize,
        search: searchText,
        ...filters
      };
      
      const response = await supplierService.getSuppliers(params);
      setSuppliers(response.data);
      setPagination({
        ...pagination,
        current: page,
        total: response.pagination.total
      });
    } catch (error) {
      message.error('Failed to load suppliers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  }, [filters]);

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    loadSuppliers(1);
  };

  // Handle delete
  const handleDelete = (id, name) => {
    confirm({
      title: `Delete Supplier ${name}?`,
      content: 'This action cannot be undone.',
      okText: 'Yes, Delete',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await supplierService.deleteSupplier(id);
          message.success('Supplier deleted successfully');
          loadSuppliers(pagination.current);
        } catch (error) {
          message.error('Failed to delete supplier');
        }
      }
    });
  };

  // Table columns
  const columns = [
    {
      title: 'Supplier Code',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      render: (text) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      sorter: true
    },
    {
      title: 'Contact Person',
      key: 'contactPerson',
      render: (_, record) => (
        <div>
          <div>{record.contactPerson?.name}</div>
          <small>{record.contactPerson?.phone}</small>
        </div>
      )
    },
    {
      title: 'Rating',
      dataIndex: 'supplierRating',
      key: 'rating',
      render: (rating) => <Rate disabled defaultValue={rating} allowHalf />
    },
    {
      title: 'Categories',
      key: 'categories',
      render: (_, record) => (
        <>
          {record.categories?.map(cat => (
            <Tag key={cat} color="green">{cat}</Tag>
          ))}
        </>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const colors = {
          active: 'green',
          inactive: 'red',
          blacklisted: 'darkred',
          pending: 'orange'
        };
        return (
          <Tag color={colors[status]}>
            {status?.toUpperCase()}
          </Tag>
        );
      }
    },
    {
      title: 'Total Orders',
      dataIndex: ['performance', 'totalOrders'],
      key: 'totalOrders',
      render: (val) => val || 0
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="View Details">
            <Button 
              icon={<EyeOutlined />} 
              size="small"
              onClick={() => navigate(`/suppliers/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Edit">
            <Button 
              icon={<EditOutlined />} 
              size="small"
              onClick={() => navigate(`/suppliers/edit/${record._id}`)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              icon={<DeleteOutlined />} 
              size="small" 
              danger
              onClick={() => handleDelete(record._id, record.companyName)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <Card 
      title="Supplier Management" 
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => navigate('/suppliers/new')}
        >
          Add New Supplier
        </Button>
      }
    >
      {/* Filters */}
      <Space style={{ marginBottom: 16 }} wrap>
        <Input
          placeholder="Search suppliers..."
          prefix={<SearchOutlined />}
          style={{ width: 250 }}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={() => handleSearch(searchText)}
        />
        
        <Select
          placeholder="Filter by Status"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => setFilters({...filters, status: value})}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
          <Option value="pending">Pending</Option>
          <Option value="blacklisted">Blacklisted</Option>
        </Select>

        <Select
          placeholder="Filter by Rating"
          style={{ width: 150 }}
          allowClear
          onChange={(value) => setFilters({...filters, rating: value})}
        >
          <Option value="5">5 Stars</Option>
          <Option value="4">4+ Stars</Option>
          <Option value="3">3+ Stars</Option>
        </Select>

        <Button icon={<ExportOutlined />}>Export</Button>
      </Space>

      {/* Suppliers Table */}
      <Table
        columns={columns}
        dataSource={suppliers}
        rowKey="_id"
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          onChange: (page) => loadSuppliers(page)
        }}
      />
    </Card>
  );
};

export default SupplierList;
