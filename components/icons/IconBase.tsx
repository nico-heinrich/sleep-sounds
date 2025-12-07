import Svg, { Path } from "react-native-svg";

export default function IconBase({
  mini = false,
  color = "white",
  paths,
  outline = false,
}: {
  mini?: boolean;
  color?: string;
  paths: string[];
  outline?: boolean;
}) {
  const size = mini ? 14 : 28;

  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fillRule="evenodd"
      clipRule="evenodd"
      strokeLinejoin="round"
      strokeMiterlimit="2"
      strokeWidth="1.5"
    >
      {paths.map((d, index) => (
        <Path
          key={index}
          d={d}
          fill={outline ? "none" : color}
          stroke={outline ? color : "none"}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </Svg>
  );
}
