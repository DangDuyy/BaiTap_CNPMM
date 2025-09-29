import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Image, Button, Space, Tag } from 'antd';
import { EyeOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from './util/axios.customize';
import { useAuth } from './context/auth.context';

const { Title, Text } = Typography;

const RecentlyViewed = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchRecentlyViewed = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/v1/api/recently-viewed');
        setProducts(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching recently viewed products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyViewed();
  }, [isAuthenticated]);

  if (!isAuthenticated || products.length === 0) return null;

  return (
    <Card 
      style={{ marginTop: 24 }}
      title={
        <Space>
          <ClockCircleOutlined />
          <span>Sản phẩm đã xem gần đây</span>
        </Space>
      }
      loading={loading}
    >
      <List
        grid={{ 
          gutter: 16, 
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 5
        }}
        dataSource={products.slice(0, 5)} // Chỉ hiển thị 5 sản phẩm gần nhất
        renderItem={item => {
          const discountedPrice = item.price * (1 - (item.promotion || 0) / 100);
          
          return (
            <List.Item>
              <Card
                hoverable
                size="small"
                cover={
                  <Image
                    alt={item.name}
                    src={item.images?.[0] || 'https://via.placeholder.com/200x150'}
                    style={{ height: 120, objectFit: 'cover' }}
                    preview={false}
                  />
                }
                onClick={() => navigate(`/product/${item._id}`)}
                bodyStyle={{ padding: 12 }}
              >
                <Card.Meta
                  title={
                    <Text ellipsis style={{ fontSize: 14 }}>
                      {item.name}
                    </Text>
                  }
                  description={
                    <Space direction="vertical" size={4} style={{ width: '100%' }}>
                      <Text strong style={{ color: '#ff4d4f', fontSize: 13 }}>
                        {discountedPrice.toLocaleString('vi-VN')}đ
                      </Text>
                      {item.promotion > 0 && (
                        <Tag size="small" color="red">-{item.promotion}%</Tag>
                      )}
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        <EyeOutlined /> {item.viewCount} lượt xem
                      </Text>
                    </Space>
                  }
                />
              </Card>
            </List.Item>
          );
        }}
      />
      
      {products.length > 5 && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button 
            type="link" 
            onClick={() => {
              // Có thể navigate đến trang riêng để xem tất cả sản phẩm đã xem
              console.log('View all recently viewed products');
            }}
          >
            Xem tất cả ({products.length} sản phẩm)
          </Button>
        </div>
      )}
    </Card>
  );
};

export default RecentlyViewed;