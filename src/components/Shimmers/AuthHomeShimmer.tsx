import ArticleShimmer from '@/components/Shimmers/ArticleShimmer';
import AuthHomeSide1 from '@/components/Shimmers/AuthHomeSide1';
import { Col, Row } from 'react-bootstrap';
import ContentShimmer from 'react-content-shimmer';
const AuthHomeShimmer = () => {
  return (
    <Row className='d-flex w-100'>
      <Col sm="12" xl="4" className='order_2'>
        <AuthHomeSide1 />
      </Col>
      <Col sm="12"  xl="8">
        <ArticleShimmer SHWidth={100} />
      </Col>
    </Row>
  );
};
export default AuthHomeShimmer;
