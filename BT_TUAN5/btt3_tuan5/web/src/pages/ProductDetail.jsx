import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  Button,
  Typography,
  Statistic,
  List,
  Rate,
  message,
  Form,
  Input,
  Spin,
  Divider,
  Avatar,
  Badge,
  Tag,
  Space,
  Image
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  EyeOutlined,
  ShoppingOutlined,
  CommentOutlined,
  UserOutlined,
  CalendarOutlined,
  StarFilled
} from '@ant-design/icons';
import axios from '../components/util/axios.customize';
import { useAuth } from '../components/context/auth.context';
import RecentlyViewed from '../components/RecentlyViewed';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [form] = Form.useForm();

  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);

 useEffect(() => {
  const fetchProductDetails = async () => {
    try {
      console.log('Fetching product with ID:', id);

      // Lấy chi tiết sản phẩm
      const productRes = await axios.get(`/v1/api/products/${id}`);
      console.log('Product response:', productRes.data);

      // Kiểm tra dữ liệu sản phẩm - Bỏ kiểm tra success
      if (!productRes.data?.data) {
        message.error('Không tìm thấy thông tin sản phẩm');
        navigate('/product');
        return;
      }

      setProduct(productRes.data.data);

      // Lấy sản phẩm tương tự và bình luận
      const [similarRes, commentsRes] = await Promise.all([
        axios.get(`/v1/api/products/${id}/similar`),
        axios.get(`/v1/api/products/${id}/comments`)
      ]);

      setSimilarProducts(similarRes.data?.data || []);
      setComments(commentsRes.data?.data || []);

      // Kiểm tra yêu thích
      if (isAuthenticated) {
        try {
          const favoritesRes = await axios.get('/v1/api/favorites');
          console.log('Favorites response:', favoritesRes.data);

          // Kiểm tra sản phẩm có trong danh sách yêu thích
          const favorites = favoritesRes.data?.data || [];
          const isFav = favorites.some(fav => {
            const favProductId = fav.product?._id || fav.product;
            return favProductId === id;
          });

          setIsFavorite(isFav);
        } catch (favError) {
          console.error('Lỗi khi kiểm tra yêu thích:', favError);
        }
      }

    } catch (error) {
      console.error('Lỗi chi tiết:', error);
      message.error('Không thể tải thông tin sản phẩm');
      navigate('/product');
    } finally {
      setLoading(false);
    }
  };

  if (id) {
    fetchProductDetails();
  }
}, [id, isAuthenticated, navigate]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để thêm vào yêu thích');
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await axios.delete(`/v1/api/favorites/${id}`);
        message.success('Đã xóa khỏi danh sách yêu thích');
      } else {
        await axios.post('/v1/api/favorites', { productId: id });
        message.success('Đã thêm vào danh sách yêu thích');
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error('Lỗi favorite:', error);
      message.error('Không thể cập nhật trạng thái yêu thích');
    }
  };

  const handleSubmitComment = async (values) => {
    if (!isAuthenticated) {
      message.warning('Vui lòng đăng nhập để bình luận');
      navigate('/login');
      return;
    }

    try {
      setSubmittingComment(true);
      await axios.post('/v1/api/comments', {
        productId: id,
        content: values.content,
        rating: values.rating
      });

      message.success('Đã thêm bình luận');
      form.resetFields();
      
      // Reload comments
      const commentsRes = await axios.get(`/v1/api/products/${id}/comments`);
      setComments(commentsRes.data?.data || []);

    } catch (error) {
      console.error('Lỗi bình luận:', error);
      message.error('Không thể thêm bình luận');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ textAlign: 'center', padding: 50 }}>
        <Title level={3}>Không tìm thấy sản phẩm</Title>
        <Button type="primary" onClick={() => navigate('/product')}>
          Quay lại danh sách sản phẩm
        </Button>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - (product.promotion || 0) / 100);

  return (
    <div style={{ padding: 24, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Row gutter={[24, 24]}>
        {/* Main Product Information */}
        <Col xs={24} lg={16}>
          <Card style={{ marginBottom: 24 }}>
            <Row gutter={24}>
              <Col xs={24} md={10}>
                <Image
                  width="100%"
                  height={400}
                  src={product.images?.[0] || 'https://via.placeholder.com/400x400'}
                  alt={product.name}
                  style={{ objectFit: 'cover', borderRadius: 8 }}
                />
              </Col>
              <Col xs={24} md={14}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div>
                    <Title level={2} style={{ marginBottom: 8 }}>
                      {product.name}
                    </Title>
                    <Tag color="blue">{product.category}</Tag>
                  </div>

                  <div>
                    <Space align="baseline">
                      <Text strong style={{ fontSize: 28, color: '#ff4d4f' }}>
                        {discountedPrice.toLocaleString('vi-VN')}đ
                      </Text>
                      {product.promotion > 0 && (
                        <>
                          <Text 
                            delete 
                            style={{ fontSize: 18, color: '#999' }}
                          >
                            {product.price.toLocaleString('vi-VN')}đ
                          </Text>
                          <Badge 
                            count={`-${product.promotion}%`} 
                            style={{ backgroundColor: '#ff4d4f' }}
                          />
                        </>
                      )}
                    </Space>
                  </div>

                  {/* Product Stats */}
                  <Row gutter={16} style={{ marginTop: 20 }}>
                    <Col span={8}>
                      <Statistic
                        title="Lượt xem"
                        value={product.viewCount}
                        prefix={<EyeOutlined style={{ color: '#1890ff' }} />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Đã mua"
                        value={product.purchaseCount}
                        prefix={<ShoppingOutlined style={{ color: '#52c41a' }} />}
                      />
                    </Col>
                    <Col span={8}>
                      <Statistic
                        title="Bình luận"
                        value={product.commentCount}
                        prefix={<CommentOutlined style={{ color: '#faad14' }} />}
                      />
                    </Col>
                  </Row>

                  {/* Action Buttons */}
                  <Space size="middle" style={{ marginTop: 30 }}>
                    <Button
                      type={isFavorite ? 'primary' : 'default'}
                      icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                      onClick={handleFavoriteClick}
                      size="large"
                      danger={isFavorite}
                    >
                      {isFavorite ? 'Đã yêu thích' : 'Thêm vào yêu thích'}
                    </Button>
                    <Button 
                      type="primary" 
                      size="large"
                      style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    >
                      Thêm vào giỏ hàng
                    </Button>
                  </Space>

                  {/* Description */}
                  {product.description && (
                    <div style={{ marginTop: 30 }}>
                      <Title level={4}>Mô tả sản phẩm</Title>
                      <Paragraph>{product.description}</Paragraph>
                    </div>
                  )}
                </Space>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Similar Products Sidebar */}
        <Col xs={24} lg={8}>
          <Card title={
            <Space>
              <ShoppingOutlined />
              <span>Sản phẩm tương tự</span>
            </Space>
          }>
            {similarProducts.length > 0 ? (
              <List
                dataSource={similarProducts}
                renderItem={item => (
                  <List.Item style={{ padding: '12px 0' }}>
                    <List.Item.Meta
                      avatar={
                        <Image
                          width={60}
                          height={60}
                          src={item.images?.[0] || 'https://via.placeholder.com/60x60'}
                          style={{ borderRadius: 8, objectFit: 'cover' }}
                        />
                      }
                      title={
                        <Button 
                          type="link" 
                          onClick={() => navigate(`/product/${item._id}`)}
                          style={{ padding: 0, height: 'auto', textAlign: 'left' }}
                        >
                          {item.name}
                        </Button>
                      }
                      description={
                        <Space direction="vertical" size={4}>
                          <Text strong style={{ color: '#ff4d4f' }}>
                            {(item.price * (1 - (item.promotion || 0) / 100)).toLocaleString('vi-VN')}đ
                          </Text>
                          {item.promotion > 0 && (
                            <Tag size="small" color="red">-{item.promotion}%</Tag>
                          )}
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Text type="secondary">Không có sản phẩm tương tự</Text>
            )}
          </Card>
        </Col>

        {/* Comments Section */}
        <Col span={24}>
          <Card title={
            <Space>
              <CommentOutlined />
              <span>Đánh giá và bình luận ({comments.length})</span>
            </Space>
          }>
            {/* Add Comment Form */}
            {isAuthenticated ? (
              <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#fafafa', borderRadius: 8 }}>
                <Title level={5}>Viết đánh giá của bạn</Title>
                <Form form={form} onFinish={handleSubmitComment} layout="vertical">
                  <Form.Item 
                    name="rating" 
                    label="Đánh giá"
                    rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
                  >
                    <Rate />
                  </Form.Item>
                  <Form.Item 
                    name="content" 
                    label="Nội dung bình luận"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                  >
                    <Input.TextArea 
                      rows={4} 
                      placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      loading={submittingComment}
                    >
                      Gửi đánh giá
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            ) : (
              <div style={{ textAlign: 'center', margin: '20px 0' }}>
                <Text type="secondary">
                  <Button type="link" onClick={() => navigate('/login')}>
                    Đăng nhập
                  </Button> 
                  để viết đánh giá
                </Text>
              </div>
            )}

            <Divider />

            {/* Comments List */}
            {comments.length > 0 ? (
              <List
                dataSource={comments}
                renderItem={comment => (
                  <List.Item style={{ padding: '16px 0', borderBottom: '1px solid #f0f0f0' }}>
                    <List.Item.Meta
                      avatar={<Avatar icon={<UserOutlined />} />}
                      title={
                        <Space>
                          <Text strong>{comment.user?.name || 'Người dùng'}</Text>
                          <Rate disabled defaultValue={comment.rating} size="small" />
                        </Space>
                      }
                      description={
                        <Space direction="vertical" size={8}>
                          <Text>{comment.content}</Text>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            <CalendarOutlined /> {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                          </Text>
                        </Space>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: 40 }}>
                <CommentOutlined style={{ fontSize: 48, color: '#d9d9d9' }} />
                <div style={{ marginTop: 16 }}>
                  <Text type="secondary">Chưa có đánh giá nào cho sản phẩm này</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>
      
      {/* Recently Viewed Products */}
      <RecentlyViewed />
    </div>
  );
};

export default ProductDetail;