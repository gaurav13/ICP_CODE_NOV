import CommentBoxShimmer from '@/components/Shimmers/CommentBoxShimmer';
import CustomeShimmerSlider from '@/components/Shimmers/CustomeShimmer';
import { Col, Row } from 'react-bootstrap';
import ContentShimmer from 'react-content-shimmer';
const ArticleDetailShimmer = ({ SHWidth }: { SHWidth?: any }) => {
  return (
    <>
    <Row>
        <Col
          xxl={{ span: '4', order: 1 }}
          xl={{ span: '4', order: 1 }}
          lg={{ span: '12', order: 3 }}
          md={{ span: '12', order: 3 }}
          sm={{ span: '12', order: 3 }}
          xs={{ span: '12', order: 3 }}
        >
      <CommentBoxShimmer/>
      </Col>
      <Col
          xxl={{ span: '8', order: 2 }}
          xl={{ span: '8', order: 2 }}
          lg={{ span: '12', order: 2 }}
          md={{ span: '12', order: 2 }}
        >
      <div className='article-detail-pnl new '>
    <div className={`d-flex align-items-center p-2 ${SHWidth ? '' : ''}`}>
      <div className='w-100'>
        <div className=' mt-2 '>
          <ContentShimmer size={{ height: 387 }} style={{ width: '100%' }} />
        </div>
        <div className='d-flex justify-content-between my-4'>
          <div className=' d-flex align-items-center'>
            <div>
              <ContentShimmer
                size={{ height: 7, width: 60 }}
                style={{ marginBottom: '7px' }}
                rounded='2rem'
              />
              <ContentShimmer size={{ height: 7, width: 60 }} rounded='2rem' />
            </div>
          </div>
          <div className=' d-flex align-items-center'>
            <ContentShimmer size={{ height: 25, width: 60 }} rounded='2rem' />
          </div>
        </div>
        {/* a */}
        <div className='d-flex justify-content-end my-4'>
          <div className=' d-flex '>
            <div>
              <ContentShimmer
                size={{ height: 25, width: 80 }}
                rounded='2rem'
                style={{ marginRight: '7px' }}
              />
            </div>
            <div>
              <ContentShimmer
                size={{ height: 25, width: 60 }}
                rounded='2rem'
                style={{ marginRight: '7px' }}
              />
            </div>
            <div>
              <ContentShimmer size={{ height: 25, width: 80 }} rounded='2rem' />
            </div>
          </div>
        </div>
        <div className='d-flex my-4'>
          <div className=' d-flex justify-content-evenly w-100'>
            <div>
              <ContentShimmer
                size={{ height: 30, width: 100 }}
                rounded='2rem'
                style={{ marginRight: '7px' }}
              />
            </div>
            <div>
              <ContentShimmer
                size={{ height: 30, width: 80 }}
                rounded='2rem'
                style={{ marginRight: '7px' }}
              />
            </div>
            <div>
              <ContentShimmer
                size={{ height: 30, width: 100 }}
                rounded='2rem'
                style={{ marginRight: '7px' }}
              />
            </div>
            <div>
              <ContentShimmer size={{ height: 30, width: 80 }} rounded='2rem' />
            </div>
          </div>
        </div>
        <ContentShimmer
          style={{ marginTop: '1rem', margin: '20px 0', width: '100%' }}
          rounded={'50px'}
          size={{ height: 88 }}
        />
        <div className='w-100'>
          <div className=' d-flex w-100'>
            <div>
              <ContentShimmer
                size={{ height: 60, width: 60 }}
                rounded='100%'
                style={{ marginRight: '10px' }}
              />
            </div>
            <div className='w-100'>
              <ContentShimmer
                size={{ height: 60 }}
                rounded='2rem'
                style={{ width: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>
   
    </div>
    </div>
    </Col>
    </Row>
        
    </>
  );
};
export default ArticleDetailShimmer;
