import ContentShimmer from 'react-content-shimmer';
const AuthHomeSide1 = () => {
  return (
    <div className={`d-flex mb-2`}>
      <div className='w-100'>
        <div className='d-flex'>
          <ContentShimmer size={{ height: 30, width: 30 }} rounded={'10px'} />
          <div className='ms-2 d-flex align-items-center'>
            <ContentShimmer
              style={{ marginTop: '0.3rem' }}
              rounded={'2px'}
              size={{ height: 15, width: 50 }}
            />
          </div>
        </div>
        <div className='d-flex justify-content-between my-3'>
          <ContentShimmer
            style={{ marginTop: '0.3rem' }}
            rounded={'2px'}
            size={{ height: 15, width: 70 }}
          />

          <ContentShimmer
            style={{ marginTop: '0.3rem' }}
            rounded={'2px'}
            size={{ height: 15, width: 70 }}
          />
        </div>
        {/* events */}
        

        <div className='d-flex  my-3'>
          <ContentShimmer
            style={{ marginTop: '0.3rem' }}
            rounded={'2px'}
            size={{ height: 100 }}
          />
          <div className='d-flex flex-column justify-content-evenly ms-2'>
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
          </div>
        </div>

        <div className='d-flex  my-3'>
          <ContentShimmer
            style={{ marginTop: '0.3rem' }}
            rounded={'2px'}
            size={{ height: 100 }}
          />
          <div className='d-flex flex-column justify-content-evenly ms-2'>
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
          </div>
        </div>

        <div className='d-flex  my-3'>
          <ContentShimmer
            style={{ marginTop: '0.3rem' }}
            rounded={'2px'}
            size={{ height: 100 }}
          />
          <div className='d-flex flex-column justify-content-evenly ms-2'>
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
            <ContentShimmer
              style={{ marginTop: '0.1rem' }}
              rounded={'2px'}
              size={{ height: 8 }}
            />
          </div>
        </div>
        {/* events end */}
        <div className='d-flex justify-content-between my-3'>
        <div className='d-flex'>
          <ContentShimmer size={{ height: 30, width: 30 }} rounded={'10px'} />
          <div className='ms-2 d-flex align-items-center'>
            <ContentShimmer
              style={{ marginTop: '0.3rem' }}
              rounded={'2px'}
              size={{ height: 15, width: 50 }}
            />
          </div>
        </div>

        <div className='d-flex align-items-center'>
            <ContentShimmer
              rounded={'100%'}
              size={{ height: 15, width: 15 }}
            />
          </div>
        </div>



        <div className=' mt-4 w-100'>
          <ContentShimmer size={{ height: 50 }} style={{width:"100%"}}/>
        </div>
        <div className=' mt-4 w-100'>
          <ContentShimmer size={{ height: 8,width:60}}/>
        </div>
        <div className=' mt-4 w-100'>
          <ContentShimmer size={{ height: 400 }} style={{width:"100%"}}/>
        </div>
        {/* a */}

     
          </div>
        </div>

  );
};
export default AuthHomeSide1;
