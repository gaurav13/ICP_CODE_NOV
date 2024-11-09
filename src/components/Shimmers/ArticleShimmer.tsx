import ContentShimmer from 'react-content-shimmer';
const ArticleShimmer = ({SHWidth}:{SHWidth?:any}) => {
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
        <div className='mt-4 d-flex'>
            <ContentShimmer size={{ height: 7, width: 65 }} rounded={'1rem'} />

          </div>
        <div className=' mt-2 '>
          <ContentShimmer size={{ height: 387}} style={{width:"100%"}}/>
        </div>
        <div className='d-flex justify-content-between my-4'>
          <div className=' d-flex align-items-center'>
            <div>
            <ContentShimmer size={{ height: 7, width: 60 }}  style={{ marginBottom: '7px' }} rounded='2rem' />
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
            <ContentShimmer size={{ height: 25, width: 80 }} rounded='2rem'  style={{ marginRight: '7px' }}/>

            </div>
            <div>
            <ContentShimmer size={{ height: 25, width: 60 }} rounded='2rem'  style={{ marginRight: '7px' }} />

            </div>
            <div>
            <ContentShimmer size={{ height: 25, width: 80 }} rounded='2rem' />

            </div>
          </div>

        </div>
        <div className='d-flex my-4'>
          <div className=' d-flex justify-content-evenly w-100'>
          <div>
            <ContentShimmer size={{ height: 30, width: 100 }} rounded='2rem'  style={{ marginRight: '7px' }}/>

            </div>
            <div>
            <ContentShimmer size={{ height: 30, width: 80 }} rounded='2rem'  style={{ marginRight: '7px' }}/>

            </div>
            <div>
            <ContentShimmer size={{ height: 30, width: 100 }} rounded='2rem'  style={{ marginRight: '7px' }} />

            </div>
            <div>
            <ContentShimmer size={{ height: 30, width: 80 }} rounded='2rem' />

            </div>
          </div>

        </div>
        <ContentShimmer
          style={{ marginTop: '1rem' ,margin:'20px 0',width:"100%"}}
          rounded={'50px'}
          size={{ height: 88,  }}
        />
        <div className='w-100'>
          <div className=' d-flex w-100'>
          <div>
            <ContentShimmer size={{ height: 60, width: 60 }} rounded='100%'  style={{ marginRight: '10px' }}/>

            </div>
            <div className='w-100'>
              
              <ContentShimmer size={{ height: 60}} rounded='2rem'  style={{width:"100%"}} />

              

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
export default ArticleShimmer;

