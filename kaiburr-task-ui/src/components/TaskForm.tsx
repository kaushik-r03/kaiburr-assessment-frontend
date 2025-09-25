import React, { useEffect } from 'react';
import { Modal, Form, Input, Button, Space } from 'antd';
import { Task, CreateTaskRequest } from '../types';

interface TaskFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateTaskRequest) => Promise<boolean>;
  initialValues?: Task;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  loading = false
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue({
        name: initialValues.name,
        owner: initialValues.owner,
        command: initialValues.command,
      });
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = async (values: CreateTaskRequest) => {
    const success = await onSubmit(values);
    if (success) {
      form.resetFields();
      onCancel();
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={initialValues ? 'Edit Task' : 'Create New Task'}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      destroyOnClose
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Task Name"
          name="name"
          rules={[
            { required: true, message: 'Please enter task name!' },
            { min: 2, message: 'Task name must be at least 2 characters!' },
            { max: 100, message: 'Task name must be less than 100 characters!' }
          ]}
        >
          <Input
            placeholder="Enter task name"
            maxLength={100}
          />
        </Form.Item>

        <Form.Item
          label="Owner"
          name="owner"
          rules={[
            { required: true, message: 'Please enter owner name!' },
            { min: 2, message: 'Owner name must be at least 2 characters!' },
            { max: 50, message: 'Owner name must be less than 50 characters!' }
          ]}
        >
          <Input
            placeholder="Enter owner name"
            maxLength={50}
          />
        </Form.Item>

        <Form.Item
          label="Shell Command"
          name="command"
          rules={[
            { required: true, message: 'Please enter shell command!' },
            { min: 1, message: 'Command cannot be empty!' },
            { max: 500, message: 'Command must be less than 500 characters!' }
          ]}
        >
          <Input.TextArea
            placeholder="Enter shell command (e.g., echo Hello World)"
            rows={4}
            maxLength={500}
          />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button onClick={handleCancel} disabled={loading}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              {initialValues ? 'Update Task' : 'Create Task'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;