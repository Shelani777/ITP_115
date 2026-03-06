import React, { useState, useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Card,
  Row,
  Col,
  Select,
  Rate,
  Tabs,
  message,
  Space,
  Divider
} from 'antd';
import {
  SaveOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  PhoneOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { supplierService } from '../../services/supplierService';

const { Option } = Select;
const { TabPane } = Tabs;
const { TextArea } = Input;

const SupplierForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [supplierRating, setSupplierRating] = useState(3);
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadSupplier();
    }
  }, [id]);

  const loadSupplier = async () => {
    try {
      const response = await supplierService.getSupplier(id);
      const supplier = response.data.supplier;
      form.setFieldsValue(supplier);
      setSupplierRating(supplier.supplierRating);
    } catch (error) {
      message.error('Failed to load supplier');
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      values.supplierRating = supplierRating;
      
      if (isEditMode) {
        await supplierService.updateSupplier(id, values);
        message.success('Supplier updated successfully');
      } else {
        await supplierService.createSupplier(values);
        message.success('Supplier created successfully');
      }
      navigate('/suppliers');
    } catch (error) {
      message.error(isEditMode ? 'Failed to update supplier' : 'Failed to create supplier');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={isEditMode ? 'Edit Supplier' : 'Add New Supplier'}
      extra={
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/suppliers')}>
          Back to List
        </Button>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: 'active',
          paymentTerms: '30_days'
        }}
      >
        <Tabs defaultActiveKey="1">
          {/* Basic Information Tab */}
          <TabPane tab="Basic Information" key="1">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="companyName"
                  label="Company Name"
                  rules={[{ required: true, message: 'Please enter company name' }]}
                >
                  <Input placeholder="Enter company name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="supplierCode"
                  label="Supplier Code"
                  rules={[{ required: true, message: 'Please enter supplier code' }]}
                >
                  <Input placeholder="e.g., SUP001" disabled={isEditMode} />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['contactPerson', 'name']}
                  label="Contact Person Name"
                >
                  <Input placeholder="Full name" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['contactPerson', 'designation']}
                  label="Designation"
                >
                  <Input placeholder="e.g., Manager" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['contactPerson', 'email']}
                  label="Contact Email"
                >
                  <Input type="email" placeholder="[email protected]" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="Status"
                >
                  <Select>
                    <Option value="active">Active</Option>
                    <Option value="inactive">Inactive</Option>
                    <Option value="pending">Pending</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Supplier Rating">
                  <Rate 
                    value={supplierRating} 
                    onChange={setSupplierRating}
                    allowHalf
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="categories"
              label="Categories"
            >
              <Select mode="multiple" placeholder="Select categories">
                <Option value="spare_parts">Spare Parts</Option>
                <Option value="oils_lubricants">Oils & Lubricants</Option>
                <Option value="tools">Tools</Option>
                <Option value="batteries">Batteries</Option>
                <Option value="tyres">Tyres</Option>
                <Option value="accessories">Accessories</Option>
              </Select>
            </Form.Item>
          </TabPane>

          {/* Contact Details Tab */}
          <TabPane tab="Contact Details" key="2">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['contactInfo', 'phone']}
                  label="Phone"
                >
                  <Input prefix={<PhoneOutlined />} placeholder="Landline" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['contactInfo', 'mobile']}
                  label="Mobile"
                >
                  <Input placeholder="Mobile number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['contactInfo', 'email']}
                  label="Email"
                >
                  <Input type="email" placeholder="[email protected]" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['contactInfo', 'website']}
                  label="Website"
                >
                  <Input placeholder="https://..." />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['contactInfo', 'fax']}
                  label="Fax"
                >
                  <Input placeholder="Fax number" />
                </Form.Item>
              </Col>
            </Row>

            <Divider orientation="left">Address</Divider>
            
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['address', 'street']}
                  label="Street Address"
                >
                  <Input placeholder="Street address" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['address', 'city']}
                  label="City"
                >
                  <Input placeholder="City" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['address', 'state']}
                  label="State/Province"
                >
                  <Input placeholder="State" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['address', 'postalCode']}
                  label="Postal Code"
                >
                  <Input placeholder="Postal code" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['address', 'country']}
                  label="Country"
                  initialValue="Sri Lanka"
                >
                  <Input placeholder="Country" />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>

          {/* Business Details Tab */}
          <TabPane tab="Business Details" key="3">
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name={['businessDetails', 'registrationNumber']}
                  label="Business Registration No"
                >
                  <Input placeholder="Registration number" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['businessDetails', 'taxId']}
                  label="Tax ID/VAT No"
                >
                  <Input placeholder="Tax ID" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name={['businessDetails', 'establishedYear']}
                  label="Established Year"
                >
                  <Input type="number" placeholder="YYYY" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name={['businessDetails', 'businessType']}
              label="Business Type"
            >
              <Select placeholder="Select business type">
                <Option value="manufacturer">Manufacturer</Option>
                <Option value="distributor">Distributor</Option>
                <Option value="wholesaler">Wholesaler</Option>
                <Option value="retailer">Retailer</Option>
                <Option value="importer">Importer</Option>
              </Select>
            </Form.Item>

            <Divider orientation="left">Payment Terms</Divider>
            
            <Form.Item
              name="paymentTerms"
              label="Payment Terms"
            >
              <Select>
                <Option value="immediate">Immediate</Option>
                <Option value="7_days">7 Days</Option>
                <Option value="15_days">15 Days</Option>
                <Option value="30_days">30 Days</Option>
                <Option value="45_days">45 Days</Option>
                <Option value="60_days">60 Days</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="notes"
              label="Additional Notes"
            >
              <TextArea rows={4} placeholder="Any additional information..." />
            </Form.Item>
          </TabPane>

          {/* Bank Details Tab */}
          <TabPane tab="Bank Details" key="4">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'bankName']}
                  label="Bank Name"
                >
                  <Input placeholder="Bank name" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'branch']}
                  label="Branch"
                >
                  <Input placeholder="Branch name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'accountNumber']}
                  label="Account Number"
                >
                  <Input placeholder="Account number" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'accountHolder']}
                  label="Account Holder Name"
                >
                  <Input placeholder="Account holder name" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name={['bankDetails', 'swiftCode']}
                  label="SWIFT Code"
                >
                  <Input placeholder="SWIFT code" />
                </Form.Item>
              </Col>
            </Row>
          </TabPane>
        </Tabs>

        <Divider />

        <Form.Item>
          <Space>
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />}
              loading={loading}
            >
              {isEditMode ? 'Update Supplier' : 'Save Supplier'}
            </Button>
            <Button onClick={() => navigate('/suppliers')}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default SupplierForm;

