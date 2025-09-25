// src/components/TaskExecutionModal.tsx
import React from 'react';
import { Modal, Timeline, Typography, Card, Empty, Space, Button } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  ReloadOutlined 
} from '@ant-design/icons';
import { Task, TaskExecution } from '../types';

const { Title, Text, Paragraph } = Typography;

interface TaskExecutionModalProps {
  visible: boolean;
  onCancel: () => void;
  task: Task | null;
  onExecute?: (taskId: string) => Promise<boolean>;
  executeLoading?: boolean;
}

const TaskExecutionModal: React.FC<TaskExecutionModalProps> = ({
  visible,
  onCancel,
  task,
  onExecute,
  executeLoading = false
}) => {
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  const calculateDuration = (startTime: string, endTime: string): string => {
    try {
      const start = new Date(startTime).getTime();
      const end = new Date(endTime).getTime();
      const duration = end - start;
      
      if (duration < 1000) {
        return `${duration}ms`;
      } else if (duration < 60000) {
        return `${(duration / 1000).toFixed(2)}s`;
      } else {
        const minutes = Math.floor(duration / 60000);
        const seconds = ((duration % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
      }
    } catch (error) {
      return 'Unknown';
    }
  };

  const handleExecute = async () => {
    if (task && onExecute) {
      await onExecute(task.id);
    }
  };

  const renderTimelineItems = () => {
    if (!task?.taskExecutions || task.taskExecutions.length === 0) {
      return [];
    }

    return task.taskExecutions
      .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
      .map((execution: TaskExecution, index: number) => ({
        dot: execution.output.includes('error') || execution.output.includes('Error') 
          ? <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          : <CheckCircleOutlined style={{ color: '#52c41a' }} />,
        children: (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div>
                <Text strong>Started:</Text> {formatDateTime(execution.startTime)}
              </div>
              <div>
                <Text strong>Completed:</Text> {formatDateTime(execution.endTime)}
              </div>
              <div>
                <Text strong>Duration:</Text> {calculateDuration(execution.startTime, execution.endTime)}
              </div>
              <div>
                <Text strong>Output:</Text>
                <Paragraph
                  code
                  copyable
                  style={{ 
                    marginTop: 8, 
                    backgroundColor: '#f6f8fa',
                    padding: '8px',
                    borderRadius: '4px',
                    whiteSpace: 'pre-wrap',
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  {execution.output}
                </Paragraph>
              </div>
            </Space>
          </Card>
        ),
      }));
  };

  return (
    <Modal
      title={
        <Space>
          <ClockCircleOutlined />
          Task Execution History
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={800}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Close
        </Button>,
        ...(onExecute ? [
          <Button
            key="execute"
            type="primary"
            icon={<ReloadOutlined />}
            loading={executeLoading}
            onClick={handleExecute}
            disabled={!task}
          >
            Execute Task
          </Button>
        ] : [])
      ]}
    >
      {task ? (
        <div>
          <Card style={{ marginBottom: 16 }}>
            <Title level={5}>Task Details</Title>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <div><Text strong>Name:</Text> {task.name}</div>
              <div><Text strong>Owner:</Text> {task.owner}</div>
              <div><Text strong>Command:</Text> <Text code>{task.command}</Text></div>
              <div>
                <Text strong>Total Executions:</Text> {task.taskExecutions?.length || 0}
              </div>
            </Space>
          </Card>

          {task.taskExecutions && task.taskExecutions.length > 0 ? (
            <div>
              <Title level={5}>Execution History</Title>
              <Timeline
                items={renderTimelineItems()}
                mode="left"
                style={{ marginTop: 16 }}
              />
            </div>
          ) : (
            <Empty
              description="No executions yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button 
                type="primary" 
                onClick={handleExecute}
                loading={executeLoading}
                disabled={!onExecute}
              >
                Execute Task Now
              </Button>
            </Empty>
          )}
        </div>
      ) : (
        <Empty description="No task selected" />
      )}
    </Modal>
  );
};

export default TaskExecutionModal;