import React from "react";
import { line, curveBasis, symbolTriangle } from "d3-shape";

type PointElement = (
  center: [number, number],
  i: number,
  points: [number, number][]
) => React.ReactNode;

function defaultPointElement(
  center: [number, number],
  i: number
): React.ReactNode {
  return (
    <circle
      cx={center[0]}
      cy={center[1]}
      r="2"
      fill="black"
      stroke="black"
      strokeWidth="2"
      key={i}
    />
  );
}

export type CurveProps = {
  data: [number, number][];
  path: string;
  showPoints?: boolean;
  pointElement?: PointElement;
} & React.SVGProps<SVGPathElement>;

export function Curve({
  path,
  data,
  pointElement = defaultPointElement,
  showPoints = true,
  ...props
}: CurveProps) {
  return (
    <>
      <defs>
        <marker
          id="head"
          orient="auto"
          markerWidth="10"
          markerHeight="8"
          refX="0"
          refY="3.5"
          markerUnits="userSpaceOnUse"
          stroke={props.stroke}
        >
          <polyline
            points="1 1, 9 5, 1 7"
            vectorEffect="non-scaling-stroke"
            stroke={props.stroke}
            fill="transparent"
            strokeWidth="2"
          />
        </marker>
      </defs>

      <path
        d={path}
        stroke="black"
        fill="transparent"
        {...props}
        marker-end="url(#head)"
        strokeDasharray="11,5"
      />

      {showPoints &&
        data.map((p, i) => (
          <circle
            cx={p[0]}
            cy={p[1]}
            r="2"
            stroke={props.stroke ?? "black"}
            strokeWidth="2"
            key={i}
          />
        ))}
    </>
  );
}

type Props = {
  data: [number, number][];
} & Omit<CurveProps, "path">;

export function BasisCurve({ data, ...props }: Props) {
  const d = line().curve(curveBasis)(data) || "";

  return <Curve path={d} data={data} {...props} />;
}
