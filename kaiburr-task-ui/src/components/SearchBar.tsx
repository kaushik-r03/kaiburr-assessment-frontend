import React from 'react';
import { Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search tasks by name...",
  loading = false
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      prefix={<SearchOutlined />}
      allowClear
      //loading={loading}
      size="large"
      style={{ maxWidth: 400 }}
      aria-label="Search tasks"
    />
  );
};

export default SearchBar;