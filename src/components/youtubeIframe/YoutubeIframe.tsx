import React from 'react'

export default React.memo(function YoutubeIframe({
  iframe
}:{iframe:any}) {
  return (
    <div
    dangerouslySetInnerHTML={{ __html: iframe }}
    style={{ height: '100%', width: '100%' }}
  />
  )
})
