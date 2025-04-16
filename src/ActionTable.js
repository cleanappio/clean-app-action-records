

/* import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Input, DatePicker, Checkbox, Form, message } from "antd";
import dayjs from "dayjs";

const ActionTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [form] = Form.useForm();

  // Fetch actions from server
  const fetchActions = async () => {
    try {
      const response = await fetch("http://dev.api.cleanapp.io:8080/get_actions");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setData(result.records || []);
    } catch (error) {
      message.error("Failed to fetch actions.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  // Validate unique name
  const isNameUnique = (name, excludeId = null) => {
    return !data.some((item) => item.name === name && item.id !== excludeId);
  };

  // Add a new action
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      if (!isNameUnique(values.name)) {
        message.error("An action with this name already exists.");
        return;
      }

      const newRecord = {
        version: "2.0",
        record: {
          name: values.name,
          is_active: values.is_active,
          expiration_date: dayjs(values.expiration_date).format("YYYY-MM-DD"),
        },
      };

      const response = await fetch("http://dev.api.cleanapp.io:8080/create_action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      setData((prevData) => [...prevData, result.record]);
      setIsModalVisible(false);
      message.success("Action added successfully.");
    } catch (error) {
      message.error("Failed to add action.");
      console.error(error);
    }
  };

  // Edit an existing action
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      if (!isNameUnique(values.name, currentRecord.id)) {
        message.error("An action with this name already exists.");
        return;
      }

      const updatedRecord = {
        version: "2.0",
        record: {
          ...currentRecord,
          name: values.name,
          is_active: values.is_active,
          expiration_date: dayjs(values.expiration_date).format("YYYY-MM-DD"),
        },
      };

      const response = await fetch("http://dev.api.cleanapp.io:8080/update_action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentRecord.id ? { ...item, ...updatedRecord.record } : item
        )
      );
      setIsEditModalVisible(false);
      message.success("Action updated successfully.");
    } catch (error) {
      message.error("Failed to update action.");
      console.error(error);
    }
  };

  // Delete an action
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this action?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await fetch("http://dev.api.cleanapp.io:8080/delete_action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ version: "2.0", record: { id } }),
          });

          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          setData((prevData) => prevData.filter((item) => item.id !== id));
          message.success("Action deleted successfully.");
        } catch (error) {
          message.error("Failed to delete action.");
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      sorter: (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      name: record.name,
      is_active: record.is_active,
      expiration_date: dayjs(record.expiration_date),
    });
    setIsEditModalVisible(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showAddModal}>
          Add Action
        </Button>
      </Space>
      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal
        title="Add Action"
        visible={isModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Expiration Date"
            name="expiration_date"
            rules={[{ required: true, message: "Please select the expiration date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Action"
        visible={isEditModalVisible}
        onOk={handleEdit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Expiration Date"
            name="expiration_date"
            rules={[{ required: true, message: "Please select the expiration date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActionTable;
*/



import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Input, DatePicker, Checkbox, Form, message } from "antd";
import dayjs from "dayjs";

const ActionTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [form] = Form.useForm();

  // Fetch actions from server
  const fetchActions = async () => {
    try {
      const response = await fetch("http://dev.api.cleanapp.io:8080/get_actions");
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      setData(result.records || []);
    } catch (error) {
      message.error("Failed to fetch actions.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchActions();
  }, []);

  // Validate unique name
  const isNameUnique = (name, excludeId = null) => {
    return !data.some((item) => item.name === name && item.id !== excludeId);
  };

  // Add a new action
  const handleAdd = async () => {
    try {
      const values = await form.validateFields();
      if (!isNameUnique(values.name)) {
        message.error("An action with this name already exists.");
        return;
      }

      const newRecord = {
        version: "2.0",
        record: {
          name: values.name,
          is_active: values.is_active,
          expiration_date: dayjs(values.expiration_date).format("YYYY-MM-DD"),
        },
      };

      const response = await fetch("http://dev.api.cleanapp.io:8080/create_action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecord),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      setData((prevData) => [...prevData, result.record]);
      setIsModalVisible(false);
      message.success("Action added successfully.");
    } catch (error) {
      message.error("Failed to add action.");
      console.error(error);
    }
  };

  // Edit an existing action
  const handleEdit = async () => {
    try {
      const values = await form.validateFields();
      if (!isNameUnique(values.name, currentRecord.id)) {
        message.error("An action with this name already exists.");
        return;
      }

      const updatedRecord = {
        version: "2.0",
        record: {
          ...currentRecord,
          name: values.name,
          is_active: values.is_active,
          expiration_date: dayjs(values.expiration_date).format("YYYY-MM-DD"),
        },
      };

      const response = await fetch("http://dev.api.cleanapp.io:8080/update_action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRecord),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentRecord.id ? { ...item, ...updatedRecord.record } : item
        )
      );
      setIsEditModalVisible(false);
      message.success("Action updated successfully.");
    } catch (error) {
      message.error("Failed to update action.");
      console.error(error);
    }
  };

  // Delete an action
  const handleDelete = (id) => {
    Modal.confirm({
      title: "Are you sure you want to delete this action?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const response = await fetch("http://dev.api.cleanapp.io:8080/delete_action", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ version: "2.0", record: { id } }),
          });

          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

          setData((prevData) => prevData.filter((item) => item.id !== id));
          message.success("Action deleted successfully.");
        } catch (error) {
          message.error("Failed to delete action.");
          console.error(error);
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: "ascend",
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive) => (isActive ? "Yes" : "No"),
    },
    {
      title: "Expiration Date",
      dataIndex: "expiration_date",
      key: "expiration_date",
      sorter: (a, b) => new Date(a.expiration_date) - new Date(b.expiration_date),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => showEditModal(record)}>
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (record) => {
    setCurrentRecord(record);
    form.setFieldsValue({
      name: record.name,
      is_active: record.is_active,
      expiration_date: dayjs(record.expiration_date),
    });
    setIsEditModalVisible(true);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showAddModal}>
          Add Action
        </Button>
      </Space>
      <Table dataSource={data} columns={columns} rowKey="id" />

      <Modal
        title="Add Action"
        visible={isModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Expiration Date"
            name="expiration_date"
            rules={[{ required: true, message: "Please select the expiration date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit Action"
        visible={isEditModalVisible}
        onOk={handleEdit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Name" name="name" rules={[{ required: true, message: "Please enter the name" }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Active" name="is_active" valuePropName="checked">
            <Checkbox />
          </Form.Item>
          <Form.Item
            label="Expiration Date"
            name="expiration_date"
            rules={[{ required: true, message: "Please select the expiration date" }]}
          >
            <DatePicker />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActionTable;