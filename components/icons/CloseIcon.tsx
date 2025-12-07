import IconBase from "./IconBase";

export default function CloseIcon({
  mini = false,
  color = "white",
}: {
  mini?: boolean;
  color?: string;
}) {
  return (
    <IconBase
      paths={["M4,4L20,20", "M4,20L20,4"]}
      mini={mini}
      color={color}
      outline
    />
  );
}
