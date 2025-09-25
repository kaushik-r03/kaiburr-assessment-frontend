import React, { useState } from 'react';
import { Layout, Typography, Button, Space, Row, Col, Card, Statistic } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
  RocketOutlined,
  UserOutlined,
  CodeOutlined
} from '@ant-design/icons';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskExecutionModal from './components/TaskExecutionModal';
import SearchBar from './components/SearchBar';
import { useTasks } from './hooks/useTasks';
import { Task, CreateTaskRequest } from './types';
import './App.css';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const App: React.FC = () => {
  const {
    tasks,
    loading,
    searchTerm,
    setSearchTerm,
    createTask,
    updateTask,
    deleteTask,
    executeTask,
    refreshTasks,
  } = useTasks();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isExecutionModalVisible, setIsExecutionModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreateTask = () => {
setEditingTask(undefined); // Changed from null
setIsFormVisible(true);
};

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormVisible(true);
  };

  const handleFormSubmit = async (values: CreateTaskRequest): Promise<boolean> => {
    setFormLoading(true);
    try {
      let success: boolean;
      if (editingTask) {
        const updatedTask: Task = { ...editingTask, ...values };
        success = await updateTask(updatedTask);
      } else {
        success = await createTask(values);
      }
      return success;
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormCancel = () => {
setIsFormVisible(false);
setEditingTask(undefined); // Changed from null
};

  const handleViewHistory = (task: Task) => {
    setSelectedTask(task);
    setIsExecutionModalVisible(true);
  };

  const handleExecutionModalCancel = () => {
    setIsExecutionModalVisible(false);
    setSelectedTask(null);
  };

  const handleExecuteFromModal = async (taskId: string): Promise<boolean> => {
    const success = await executeTask(taskId);
    if (success && selectedTask) {
      const updated = tasks.find(t => t.id === taskId);
      if (updated) setSelectedTask(updated);
    }
    return success;
  };

  const totalTasks = tasks.length;
  const totalExecutions = tasks.reduce((sum, t) => sum + (t.taskExecutions?.length || 0), 0);
  const uniqueOwners = new Set(tasks.map(t => t.owner)).size;

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <div className="header-content">
          <Space align="center">
            <RocketOutlined className="app-icon" />
            <Title level={2} className="app-title" style={{ color: "#fff" }}>
              Task Manager
            </Title>
          </Space>
        </div>
      </Header>

      <Content className="app-content">
        <div className="content-container">
          <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="Total Tasks" value={totalTasks} prefix={<CodeOutlined />} valueStyle={{ color: '#1890ff' }} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="Total Executions" value={totalExecutions} prefix={<RocketOutlined />} valueStyle={{ color: '#52c41a' }} />
              </Card>
            </Col>
            <Col xs={24} sm={8}>
              <Card>
                <Statistic title="Unique Owners" value={uniqueOwners} prefix={<UserOutlined />} valueStyle={{ color: '#722ed1' }} />
              </Card>
            </Col>
          </Row>

          <Card style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle" gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <SearchBar value={searchTerm} onChange={setSearchTerm} loading={loading} placeholder="Search tasks by name..." />
              </Col>
              <Col xs={24} md={12} style={{ textAlign: 'right' }}>
                <Space>
                  <Button icon={<ReloadOutlined />} onClick={refreshTasks} loading={loading} aria-label="Refresh tasks">Refresh</Button>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateTask} size="large" aria-label="Create new task">Create Task</Button>
                </Space>
              </Col>
            </Row>
          </Card>

          <TaskList
            tasks={tasks}
            loading={loading}
            onEdit={handleEditTask}
            onDelete={deleteTask}
            onExecute={executeTask}
            onViewHistory={handleViewHistory}
          />
        </div>
      </Content>

      <TaskForm
        visible={isFormVisible}
        onCancel={handleFormCancel}
        onSubmit={handleFormSubmit}
        initialValues={editingTask}
        loading={formLoading}
      />

      <TaskExecutionModal
        visible={isExecutionModalVisible}
        onCancel={handleExecutionModalCancel}
        task={selectedTask}
        onExecute={handleExecuteFromModal}
      />
    </Layout>
  );
};

export default App;
