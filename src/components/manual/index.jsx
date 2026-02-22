import { motion } from "framer-motion";
import {
  Box,
  VStack,
  Text,
  Button,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setManualIsVisible } from "../../redux/slices/uiSlice.ts";
import { glowShadow } from "../../shared/styles/shadows.js";

const MotionBox = motion(Box);

const Glow = ({ children, color = "white" }) => (
  <Box as="span" color={color} textShadow={glowShadow}>
    {children}
  </Box>
);

const Manual = () => {
  const dispatch = useDispatch();
  const isDesktop = useBreakpointValue({ base: false, lg: true });

  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      position="fixed"
      inset="0"
      zIndex={15}
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="rgba(255,255,255,0.05)"
      backdropFilter="blur(8px) brightness(0.3)"
      fontWeight="700"
    >
      <MotionBox
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 1 }}
        onClick={(e) => e.stopPropagation()}
        w={{ base: "90%", md: "500px" }}
        p={{ base: "10px", md: "40px" }}
        textAlign="center"
        color="white"
      >
        <VStack spacing={8}>
          <Text
            fontSize="32px"
            letterSpacing="4px"
            textShadow="0 0 20px rgba(255,255,255,0.5)"
          >
            ManUaL
          </Text>

          <VStack
            spacing={5}
            lineHeight="1.6"
            textShadow="0 0 20px rgba(255,255,255,0.5)"
          >
            <Text>
              To begin your divination, select the number of cards. On the next
              page, press <Glow>"see your fortune"</Glow> and choose the area of
              life you seek guidance about.
            </Text>
            <Text>
              Optionally, you can choose to use only the{" "}
              <Glow>Major Arcana</Glow>.
            </Text>
            <Text>
              To open the menu, simply tap the <Glow>galaxy</Glow>.
            </Text>
            <Text>
              You can also{isDesktop && " adjust the music volume, mute it, or"}{" "}
              switch between{" "}
              <Box
                as="span"
                textShadow="0 0 6px rgba(255,255,255,0.9), 0 0 12px rgba(255,255,255,0.8), 0 0 24px rgba(255,255,255,0.6)"
              >
                light
              </Box>{" "}
              and <Glow color="black">dark</Glow> themes.
            </Text>
            <Text mt="20px" textShadow={glowShadow} color="rgb(0,0,0)">
              The full deck is still taking shape. For now, only the Major
              Arcana pictures are available.
            </Text>
          </VStack>

          <Button
            mt="20px"
            variant="ghost"
            color="white"
            border="1px solid rgba(255, 255, 255, 0.3)"
            borderRadius="0"
            letterSpacing="2px"
            _hover={{
              bg: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.8)",
              boxShadow: "0 0 15px rgba(255,255,255,0.3)",
            }}
            onClick={() => dispatch(setManualIsVisible(false))}
          >
            <Text py="10px">Let's do some magic</Text>
          </Button>
        </VStack>
      </MotionBox>
    </MotionBox>
  );
};

export default Manual;
