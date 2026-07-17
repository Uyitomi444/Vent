import React from 'react';
import mascotPoses from '../assets/ABLE/mascot-poses.jpeg';

export type PoseType = 
  | 'waving' 
  | 'thumbsUp' 
  | 'jumping' 
  | 'sitting' 
  | 'cheering' 
  | 'armsCrossed';

interface MascotPoseProps {
  pose: PoseType;
  className?: string;
  style?: React.CSSProperties;
}

const POSE_POSITIONS: Record<PoseType, { x: string, y: string }> = {
  waving: { x: '0%', y: '0%' },
  thumbsUp: { x: '100%', y: '0%' },
  jumping: { x: '0%', y: '50%' },
  sitting: { x: '100%', y: '50%' },
  cheering: { x: '0%', y: '100%' },
  armsCrossed: { x: '100%', y: '100%' }
};

export default function MascotPose({ pose, className = '', style = {} }: MascotPoseProps) {
  const { x, y } = POSE_POSITIONS[pose];

  return (
    <div 
      className={`inline-block mix-blend-multiply ${className}`}
      style={{
        backgroundImage: `url(${mascotPoses})`,
        backgroundSize: '200% 300%',
        backgroundPosition: `${x} ${y}`,
        backgroundRepeat: 'no-repeat',
        ...style
      }}
    />
  );
}
