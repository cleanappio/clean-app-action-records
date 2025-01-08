/* import React from "react";

const Table = () => {
  const data = [
    {
      id: "1",
      name: "Action 1",
      is_active: true,
      expiration_date: "2024-12-31",
    },
    {
      id: "2",
      name: "Action 2",
      is_active: false,
      expiration_date: "2025-01-15",
    },
    {
      id: "3",
      name: "Action 3",
      is_active: true,
      expiration_date: "2023-11-20",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <table style={{ border: "1px solid black", width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Is Active</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((record) => (
            <tr key={record.id}>
              <td style={{ border: "1px solid black", padding: "8px" }}>{record.id}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>{record.name}</td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {record.is_active ? "Yes" : "No"}
              </td>
              <td style={{ border: "1px solid black", padding: "8px" }}>
                {record.expiration_date}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
*/

/* import React from "react";
 import { Table } from "antd";

const ActionTable = () => {
 
  const data = [
    {
      id: "1",
      name: "Action 1",
      is_active: true,
      expiration_date: "2024-12-31",
    },
    {
      id: "2",
      name: "Action 2",
      is_active: false,
      expiration_date: "2025-01-15",
    },
    {
      id: "3",
      name: "Action 3",
      is_active: true,
      expiration_date: "2023-11-20",
    },
  ];

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
    },
  ];

  return <Table dataSource={data} columns={columns} rowKey="id" />;
};

export default ActionTable;
*/
// import ReactDOM from "react-dom";
/*import React, { useState } from "react";


import { Table, Button, Space, message } from "antd";

const ActionTable = () => {
  const [data, setData] = useState([
    {
      id: "1",
      name: "Action A",
      is_active: true,
      expiration_date: "2024-12-31",
    },
    {
      id: "2",
      name: "Action B",
      is_active: false,
      expiration_date: "2025-01-15",
    },
  ]);

  // Function to add a new record
  const addRecord = () => {
    const newRecord = {
      id: (data.length + 1).toString(),
      name: `Action ${String.fromCharCode(65 + data.length)}`,
      is_active: Math.random() > 0.5,
      expiration_date: "2026-01-01",
    };
    setData([...data, newRecord]);
    message.success("New record added!");
  };

  // Function to delete the last record
  const deleteRecord = () => {
    if (data.length === 0) {
      message.warning("No records to delete!");
      return;
    }
    const updatedData = data.slice(0, -1);
    setData(updatedData);
    message.success("Last record deleted!");
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
    },
  ];

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={addRecord}>
          Add Record
        </Button>
        <Button type="danger" onClick={deleteRecord}>
          Delete Last Record
        </Button>
      </Space>
      <Table dataSource={data} columns={columns} rowKey="id" />
    </div>
  );
};

export default ActionTable;

*/

/*
import React, { useState } from "react";
import { Table, Button, Space, Modal, Input, DatePicker, Checkbox, Form, message } from "antd";
import dayjs from "dayjs"; // Optional: You can also remove this if unnecessary.

const ActionTable = () => {
  const [data, setData] = useState([
    {
      id: "1",
      name: "Action A",
      is_active: true,
      expiration_date: "2024-12-31",
    },
    {
      id: "2",
      name: "Action B",
      is_active: false,
      expiration_date: "2025-01-15",
    },
  ]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [form] = Form.useForm();

  // Add Record Modal Handlers
  const showAddModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    form.validateFields().then((values) => {
      const newRecord = {
        id: values.id,
        name: values.name,
        is_active: values.is_active,
        expiration_date: values.expiration_date.toISOString().split("T")[0], // Format DatePicker value to YYYY-MM-DD
      };
      setData([...data, newRecord]);
      setIsModalVisible(false);
      message.success("Record added successfully!");
    });
  };

  // Edit Record Modal Handlers
  const showEditModal = (record) => {
    setCurrentRecord(record);
    setIsEditModalVisible(true);
  };

  const handleEdit = () => {
    form.validateFields().then((values) => {
      const updatedRecord = {
        ...currentRecord,
        ...values,
        expiration_date: values.expiration_date.toISOString().split("T")[0], // Format DatePicker value to YYYY-MM-DD
      };
      const updatedData = data.map((item) =>
        item.id === currentRecord.id ? updatedRecord : item
      );
      setData(updatedData);
      setIsEditModalVisible(false);
      setCurrentRecord(null);
      message.success("Record updated successfully!");
    });
  };

  // Delete Record Handler
  const handleDelete = (id) => {
    const updatedData = data.filter((item) => item.id !== id);
    setData(updatedData);
    message.success("Record deleted successfully!");
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

  

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showAddModal}>
          Add Record
        </Button>
      </Space>
      <Table dataSource={data} columns={columns} rowKey="id" />

      
      <Modal
        title="Add Record"
        visible={isModalVisible}
        onOk={handleAdd}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="ID"
            name="id"
            rules={[{ required: true, message: "Please enter the ID" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
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
        title="Edit Record"
        visible={isEditModalVisible}
        onOk={handleEdit}
        onCancel={() => setIsEditModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="ID"
            name="id"
            rules={[{ required: true, message: "Please enter the ID" }]}
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
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
import dayjs from "dayjs"; // Use moment if your project is configured for it.





const ActionTable = () => {
  const [data, setData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);

  const [form] = Form.useForm();

  // Fetch data from the server


  const fetchActions = async () => {
    try {
      const response = await fetch("http://dev.api.cleanapp.io:8080/get_actions", { method: "GET" });
      //console.log(await response.text());
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      //console.log(result);
      setData(result.records); // Assuming the response is an array of actions
    } catch (error) {
      message.error("Failed to fetch actions!");
      console.error(error);
    }

  }



  useEffect(() => {
    fetchActions();
  }, []);

  // Add a new action
  const handleAdd = async () => {
    form.validateFields().then(async (values) => {
      try {
        const newRecord = {
          version: "2.0",
          record: {
            id: '',
            name: values.name,
            is_active: values.is_active,
            expiration_date: values.expiration_date.toISOString().split("T")[0]
          }

        };

        const response = await fetch("http://dev.api.cleanapp.io:8080/create_action", { //create_action
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRecord),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);

        }
        const res = await response.json();
        setData((prevData) => [...prevData, res.record]);
        setIsModalVisible(false);
        message.success("Action added successfully!");
      } catch (error) {
        message.error("Failed to add action!");
        console.error(error);
      }
    });
  };

  // Edit an existing action
  const handleEdit = async () => {
    form.validateFields().then(async (values) => {
      try {
        const intern = {
          ...currentRecord,
          ...values,
          expiration_date: values.expiration_date.toISOString().split("T")[0],
        };
        const updatedRecord = {
          version: "2.0",
          record: intern,
        };

        const response = await fetch("http://dev.api.cleanapp.io:8080/update_action", { //update_action
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedRecord),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        setData((prevData) =>
          prevData.map((item) => (item.id === currentRecord.id ? intern : item))
        );
        setIsEditModalVisible(false);
        message.success("Action updated successfully!");
      } catch (error) {
        message.error("Failed to update action!");
        console.error(error);
      }
    });
  };

  

  /* const handleDelete = async (id) => {
    try {
      const deletePayload = {
        version: "2.0", // Include version if the server requires it
        record: { id }, // Wrap the id in a record object
      };
  
      const response = await fetch("http://dev.api.cleanapp.io:8080/delete_action", {
        method: "POST", // Confirm with the API if POST is correct for deletion
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(deletePayload),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      // Update the table data by filtering out the deleted record
      setData((prevData) => prevData.filter((item) => item.id !== id));
      message.success("Action deleted successfully!");
    } catch (error) {
      message.error("Failed to delete action!");
      console.error(error);
    }
  };
  */
  const { confirm } = Modal;

  const handleDelete = (id) => {
    confirm({
      title: "Are you sure you want to delete this action?",
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          const deletePayload = {
            version: "2.0", // Include version if the server requires it
            record: { id }, // Wrap the id in a record object
          };
  
          const response = await fetch("http://dev.api.cleanapp.io:8080/delete_action", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(deletePayload),
          });
  
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
  
          setData((prevData) => prevData.filter((item) => item.id !== id));
          message.success("Action deleted successfully!");
        } catch (error) {
          message.error("Failed to delete action!");
          console.error(error);
        }
      },
      onCancel() {
        console.log("Delete canceled");
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
      //title: "Name",
      //dataIndex: "name",
      //key: "name",

      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
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
      ...record,
      expiration_date: dayjs(record.expiration_date), // Convert date string to dayjs/moment object
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
          <Form.Item label="ID" name="id" rules={[{ required: true, message: "Please enter the ID" }]}>
            <Input />
          </Form.Item>
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
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>
          <Form.Item label="Name" name="name">
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



