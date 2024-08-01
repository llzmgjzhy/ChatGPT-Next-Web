import Image from "next/image";

interface MedImindLogoProps {
  size: number;
  color?: "white" | "black" | "primary" | "accent";
}

export const MedImindLogo = ({
  size,
  color = "white",
}: MedImindLogoProps): JSX.Element => {
  const src = "/medimind_medium.webp";

  const filter = color === "black" ? "invert(1)" : "none";

  return (
    <div style={{ borderRadius: "1rem", overflow: "hidden" }}>
      <Image
        src={src}
        alt="PKU-MedIMind Logo"
        width={size}
        height={size}
        style={{ filter }}
      />
    </div>
  );
};
