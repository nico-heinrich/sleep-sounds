import IconBase from "./IconBase";

export default function InfinityIcon({
  mini = false,
  color = "white",
}: {
  mini?: boolean;
  color?: string;
}) {
  return (
    <IconBase
      paths={[
        "M12,12C12,12 9.564,16.25 6.25,16.25C3.352,16.25 1,14.346 1,12C1,9.654 3.352,7.75 6.25,7.75C9.564,7.75 12,12 12,12C12,12 14.436,16.25 17.75,16.25C20.648,16.25 23,14.346 23,12C23,9.654 20.648,7.75 17.75,7.75C14.436,7.75 12.186,11.988 12,12Z",
      ]}
      mini={mini}
      color={color}
      outline
    />
  );
}
