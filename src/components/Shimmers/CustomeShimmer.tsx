import ContentShimmer from 'react-content-shimmer'
const CustomeShimmerSlider = () => {
  return (
    <div className="p-2 d-flex align-items-center">
    <div>
      <div className="d-flex align-items-center">
        <ContentShimmer size={{ height: 185, width: 365  }}  />
       
      </div>
      <ContentShimmer style={{ marginTop: "1rem" }} rounded={"10px"} size={{ height: 15, width: 365 }} />
      <ContentShimmer style={{ marginTop: "1rem" }} rounded={"10px"} size={{ height: 15, width: 365 }} />
      <div className="mt-2 d-flex justify-content-between">
    <div className=" d-flex align-items-center">
        <ContentShimmer size={{ height: 25, width: 150  }} rounded="2rem" />
        </div>
        <div className=" d-flex align-items-center">
        <ContentShimmer size={{ height: 25, width: 60  }} rounded="2rem" />
       
      </div>
      </div>
    </div>
   
  </div>
  )
};
export default CustomeShimmerSlider;