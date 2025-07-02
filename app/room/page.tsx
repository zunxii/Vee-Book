import BrandList from '@/components/Brandlist'
import VideoList from '@/components/VideoList'
import React from 'react'

const page = ({ params }: { params: { id: string } }) => {
  const brandId = params.id;
  return (
    <div>
      <VideoList
      brandId={brandId}
      />
    </div>
  )
}

export default page
