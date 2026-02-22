import { Box, Skeleton } from "@chakra-ui/react";

const GalleryCardSkeleton = () => (
  <Box>
    <Skeleton
      variant="shine"
      h={{ base: "160px", md: "480px" }}
      w={{ base: "100px", md: "300px" }}
      borderRadius="10px"
      css={{
        "--start-color": "rgba(75, 24, 72, 0.17)",
        "--end-color": "rgba(187, 200, 202, 0.17)",
      }}
    />
    <Skeleton
      variant="shine"
      h="20px"
      w={{ base: "70px", md: "200px" }}
      borderRadius="4px"
      mt="14px"
      mb="4px"
      mx="auto"
      css={{
        "--start-color": "rgba(75, 24, 72, 0.17)",
        "--end-color": "rgba(187, 200, 202, 0.17)",
      }}
    />
  </Box>
);
export default GalleryCardSkeleton;
