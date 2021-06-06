import React from "react";
import { line, curveBasis } from "d3-shape";

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
      <path d={path} stroke="black" fill="transparent" {...props} />
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
