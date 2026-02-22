import { Box } from "@chakra-ui/react";

const RotatingIcon = ({ icon, index }) => (
  <Box
    key={index}
    position="absolute"
    w="90px"
    h="90px"
    top={icon.top}
    left={icon.left}
    bgImage={`url(${icon.url})`}
    bgRepeat="no-repeat"
    bgSize="cover"
    transform="translate(-50%, -50%)"
    animation="rotate2 180s linear infinite"
    transition="transform 1.3s"
    pointerEvents="auto"
  />
);

export default RotatingIcon;
