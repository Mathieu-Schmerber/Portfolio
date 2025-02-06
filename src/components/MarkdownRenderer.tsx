import React, { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Typography, Table, Button, Divider, Card} from 'antd';
import { LinkOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

type MarkdownRendererProps = {
    children: string;
};

const components = {
    h1: ({ children }: { children: ReactNode }) => (
        <Title level={3} style={{ textAlign: 'center' }}>
            {children}
        </Title>
    ),    h2: ({ children }: { children: ReactNode }) => <Title level={4}>{children}</Title>,
    p: ({ children }: { children: ReactNode }) => <Paragraph style={{ marginBottom: '0.5em' }}>{children}</Paragraph>,
    table: () => (
        <Table
            bordered
            dataSource={[
                { key: 1, name: 'John', age: 32, address: 'London' },
                { key: 2, name: 'Jane', age: 29, address: 'Paris' },
            ]}
            columns={[
                { title: 'Name', dataIndex: 'name', key: 'name' },
                { title: 'Age', dataIndex: 'age', key: 'age' },
                { title: 'Address', dataIndex: 'address', key: 'address' },
            ]}
            pagination={false}
        />
    ),
    a: ({ href, children }: { href?: string; children: ReactNode }) => (
        <Button type="link" href={href} target="_blank" icon={<LinkOutlined />}>
            {children}
        </Button>
    ),
    ul: ({ children }: { children: ReactNode }) => <ul style={{ paddingLeft: 24 }}>{children}</ul>,
    li: ({ children }: { children: ReactNode }) => <li style={{ paddingBottom: 4 }}>{children}</li>,
    hr: () => <Divider/>
};

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ children }) => {
    return (
        <div style={{ padding: 24 }}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
                {children}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;