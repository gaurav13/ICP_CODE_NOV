import ContentShimmer from 'react-content-shimmer';
const ArticleHeaderShimmer = ({SHWidth}:{SHWidth?:any}) => {
  return (
    <div className={`d-flex align-items-center p-2 ${SHWidth?"w-100":""}`}>
      <div className='w-100'>
        <div className='d-flex justify-content-between'>
          <div className='d-flex'>
            <ContentShimmer size={{ height: 60, width: 60 }} rounded={'100%'} />
            <div className='ms-1'>
           
              <ContentShimmer
                  style={{ marginTop: '1rem' }}
                rounded={'10px'}
                size={{ height: 6, width: 30 }}
              />
              <ContentShimmer
                style={{ marginTop: '0.5rem' }}
                rounded={'10px'}
                size={{ height: 6, width: 50 }}
              />
            </div>
          </div>
          <div className='d-flex'>
            <ContentShimmer size={{ height: 60, width: 60 }} rounded={'100%'} />
            <div className='ms-1'>
           
              <ContentShimmer
                  style={{ marginTop: '1rem' }}
                rounded={'10px'}
                size={{ height: 6, width: 30 }}
              />
              <ContentShimmer
                style={{ marginTop: '0.5rem' }}
                rounded={'10px'}
                size={{ height: 6, width: 50 }}
              />
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
export default ArticleHeaderShimmer;

