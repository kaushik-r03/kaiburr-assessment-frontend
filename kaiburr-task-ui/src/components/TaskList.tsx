import React, { useState } from 'react';
import { 
  Table, 
  Space, 
  Button, 
  Popconfirm, 
  Tag, 
  Tooltip,
  Typography
} from 'antd';
import { 
  EditOutlined, 
  DeleteOutlined, 
  PlayCircleOutlined,
  HistoryOutlined,
  CodeOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Task } from '../types';

const { Text } = Typography;

interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onExecute: (taskId: string) => void;
  onViewHistory: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onEdit,
  onDelete,
  onExecute,
  onViewHistory
}) => {
  const [executingTasks, setExecutingTasks] = useState<Set<string>>(new Set());

  const handleExecute = async (taskId: string) => {
    setExecutingTasks(prev => new Set(prev).add(taskId));
    try {
      await onExecute(taskId);
    } finally {
      setExecutingTasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const columns: ColumnsType<Task> = [
    {
      title: 'Task Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      render: (name: string, record: Task) => (
        <Space direction="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            ID: {record.id}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      sorter: (a, b) => a.owner.localeCompare(b.owner),
      render: (owner: string) => (
        <Tag color="blue">{owner}</Tag>
      ),
    },
    {
      title: 'Command',
      dataIndex: 'command',
      key: 'command',
      render: (command: string) => (
        <Tooltip title={command}>
          <Text code style={{ maxWidth: '200px' }}>
            <CodeOutlined style={{ marginRight: 4 }} />
            {command.length > 50 ? `${command.substring(0, 50)}...` : command}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: 'Executions',
      key: 'executions',
      render: (_, record: Task) => {
        const executionCount = record.taskExecutions?.length || 0;
        const lastExecution = record.taskExecutions?.[record.taskExecutions.length - 1];
        
        return (
          <Space direction="vertical" size={0}>
            <Text>{executionCount} runs</Text>
            {lastExecution && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Last: {new Date(lastExecution.endTime).toLocaleDateString()}
              </Text>
            )}
          </Space>
        );
      },
      sorter: (a, b) => (a.taskExecutions?.length || 0) - (b.taskExecutions?.length || 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 200,
      render: (_, record: Task) => {
        const isExecuting = executingTasks.has(record.id);
        
        return (
          <Space size="small">
            <Tooltip title="Execute task">
              <Button
                type="primary"
                size="small"
                icon={<PlayCircleOutlined />}
                loading={isExecuting}
                onClick={() => handleExecute(record.id)}
                aria-label={`Execute task ${record.name}`}
              />
            </Tooltip>
            
            <Tooltip title="View execution history">
              <Button
                size="small"
                icon={<HistoryOutlined />}
                onClick={() => onViewHistory(record)}
                aria-label={`View history for ${record.name}`}
              />
            </Tooltip>
            
            <Tooltip title="Edit task">
              <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => onEdit(record)}
                aria-label={`Edit task ${record.name}`}
              />
            </Tooltip>
            
            <Tooltip title="Delete task">
              <Popconfirm
                title="Delete Task"
                description={`Are you sure you want to delete "${record.name}"?`}
                onConfirm={() => onDelete(record.id)}
                okText="Yes"
                cancelText="No"
                placement="topRight"
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  aria-label={`Delete task ${record.name}`}
                />
              </Popconfirm>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  return (
    <Table<Task>
      columns={columns}
      dataSource={tasks}
      rowKey="id"
      loading={loading}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} tasks`,
      }}
      scroll={{ x: 800 }}
      size="middle"
      locale={{
        emptyText: 'No tasks found. Create your first task to get started!',
      }}
    />
  );
};

export default TaskList;