import { Skeleton } from "antd";

import "./styles.scss";

const SkeletonLoader = () => {
  return (
    <div className="skeletonContainer">
      <div className="gridContainer">
        {[1, 2, 3, 4].map((_, index) => (
          <div key={index} className="statSkeleton">
            <Skeleton style={{ height: 80, borderRadius: 10 }} />
          </div>
        ))}
      </div>

      <div className="barContainer">
        <Skeleton style={{ height: 250, borderRadius: 10 }} />
        <Skeleton style={{ height: 250, borderRadius: 10 }} />
      </div>

      <div className="lineContainer">
        <Skeleton style={{ height: 250, borderRadius: 10 }} />
        <Skeleton style={{ height: 250, borderRadius: 10 }} />
      </div>
    </div>
  );
};

export default SkeletonLoader;
