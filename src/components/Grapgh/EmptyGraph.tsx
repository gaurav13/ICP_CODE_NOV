import Image from 'next/image';
import React from 'react'
import emptyImage from "@/assets/Img/emptyGraph.png"
export default function EmptyGraph() {
  return (
    <>
    <div>
     <Image src={emptyImage} alt='Graph'/>
    </div>
    </>
  
  )
}
