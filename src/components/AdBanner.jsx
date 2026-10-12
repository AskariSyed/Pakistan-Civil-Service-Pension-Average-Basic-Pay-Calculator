import React, { useEffect, useRef } from 'react';

export default function AdBanner({
  slot,
  format = 'auto',
  responsive = 'true',
  style = { display: 'block', minHeight: '90px' },
  className = ''
}) {
  const adRef = useRef(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // Push ad request if AdSense is loaded and active
        window.adsbygoogle.push({});
      }
    } catch (e) {
      // Catch any AdSense runtime errors gracefully
      console.warn('AdSense notice:', e);
    }
  }, []);

  return (
    <div className={`ad-banner-container ${className}`} style={{ textAlign: 'center', margin: '20px 0' }}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-8497775989256159"
        data-ad-slot={slot || '1234567890'} // Replace with your Ad Unit Slot ID once created in AdSense
        data-ad-format={format}
        data-full-width-responsive={responsive}
      />
    </div>
  );
}
