// UI Components
import { Skeleton } from 'antd';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

const AssetDetailsSkeleton = () => {
  const router = useRouter();

  return (
    <div className="main-container" style={{ padding: '16px' }}>
      <button className="back-button" onClick={() => router.back()} style={{ marginBottom: '16px' }}>
        <ChevronLeft className="icon" />
        Back
      </button>
      <div className="container" style={{ display: 'flex', flexDirection: 'row', gap: '24px' }}>
        <div className="left-section" style={{ width: '40%', height: 'fit-content' }}>
          <div className="images-section">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              {Array(4)
                .fill(0)
                .map((_, i) => (
                  <Skeleton.Node key={i} active style={{ width: '100px', height: '100%' }} />
                ))}
            </div>
            <Skeleton.Node active style={{ width: '100%', flex: '1', height: '100%' }} />
          </div>

          <div className="action-buttons">
            <Skeleton.Button active style={{ width: '100%' }} />

            <Skeleton.Button active size="large" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="right-section" style={{ width: '60%', overflowX: 'hidden' }}>
          <div className="info">
            <div
              className="status-section"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Skeleton.Button active size="small" style={{ width: '100px' }} />
                <Skeleton.Button active size="small" style={{ width: '80px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Skeleton.Button active size="small" style={{ width: '80px' }} />
                <Skeleton.Button active size="small" style={{ width: '80px' }} />
              </div>
            </div>
            <Skeleton.Input active size="large" style={{ width: '120px' }} />
            <Skeleton.Input active size="large" style={{ width: '80%' }} />

            <div className="description">
              <Skeleton.Node style={{ height: '120px', width: '100%' }} active />
            </div>
            <Skeleton.Button active size="small" style={{ width: '50%' }} />
          </div>

          <div className="d-flex justify-space-between width-100">
            <Skeleton.Button size="large" active style={{ width: '450px', height: '40px' }} />
            <Skeleton.Button size="large" active style={{ width: '450px', height: '40px' }} />
          </div>
          <div className="border-primary-1 radius-8 d-flex align-center flex-column gap-4 p-y-10">
            <div>
              <Skeleton.Avatar active size="large" />
            </div>
            <div>
              <Skeleton.Node active style={{ width: '600px', height: '50px' }} />
            </div>
            <div>
              <Skeleton.Button active size="large" />
            </div>
          </div>

          <div>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} style={{ marginBottom: '24px' }}>
                  <div className="border-primary-1 radius-8 d-flex align-center justify-space-between">
                    <Skeleton.Node active style={{ width: '95%', height: '50px' }} />
                    <ChevronDown className="m-r-10" />
                  </div>

                  <div
                    style={{
                      padding: '15px',
                      border: '1px solid #f0f0f0',
                      borderRadius: '0 0 8px 8px',
                      marginTop: '-1px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Skeleton.Node active style={{ width: '300px', height: '60px' }} />
                    <Skeleton.Node active style={{ width: '300px', height: '60px' }} />
                  </div>
                </div>
              ))}
          </div>
          <div className="location" style={{ borderRadius: '8px' }}>
            <Skeleton.Node active style={{ width: '100%', height: '180px' }} />
          </div>

          <div className="seller-section">
            <Skeleton.Input active size="default" style={{ width: '100px', marginBottom: '15px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div>
                <Skeleton.Avatar active size="large" shape="circle" />
              </div>
              <div className="d-flex flex-column">
                <Skeleton.Input active size="small" style={{ width: '150px', marginBottom: '8px' }} />
                <Skeleton.Input active size="small" style={{ width: '120px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetDetailsSkeleton;
