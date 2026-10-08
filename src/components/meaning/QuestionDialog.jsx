import { useEffect, useState } from "react";
import {
  Button,
  CloseButton,
  Dialog,
  Portal,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { MAX_QUESTION_LENGTH } from "../../shared/constants/api.js";

const glow =
  "0 0 8px 2px #1900ff, 0 0 18px 4px #070e72, inset 0 0 8px 2px #1900ff, inset 0 0 14px 4px #070e72";
const strongGlow =
  "0 0 14px 4px #1900ff, 0 0 30px 8px #070e72, inset 0 0 14px 4px #1900ff, inset 0 0 24px 8px #070e72";

/**
 * Lets the querent ask the cards their own question before the AI reading.
 * An empty question gives a general reading of the spread.
 */
const QuestionDialog = ({ open, onClose, onSubmit }) => {
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (open) setQuestion("");
  }, [open]);

  const submit = () => onSubmit(question.trim());

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(event) => !event.open && onClose()}
      placement="center"
      motionPreset="scale"
    >
      <Portal>
        <Dialog.Backdrop bg="rgba(0, 0, 10, 0.7)" backdropFilter="blur(4px)" />
        <Dialog.Positioner px="16px">
          <Dialog.Content
            bg="rgba(0, 0, 0, 0.85)"
            color="#4fc3f7"
            border="1px solid #1565c0"
            borderRadius="24px"
            boxShadow={glow}
            maxW="520px"
            w="100%"
          >
            <Dialog.Header justifyContent="center" pt="28px">
              <Dialog.Title
                fontSize={{ base: "xl", md: "2xl" }}
                fontWeight="black"
                textAlign="center"
                textShadow="0 0 10px rgba(79, 195, 247, 0.6)"
              >
                Ask the cards
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body>
              <Textarea
                autoFocus
                value={question}
                onChange={(event) =>
                  setQuestion(event.target.value.slice(0, MAX_QUESTION_LENGTH))
                }
                onKeyDown={handleKeyDown}
                maxLength={MAX_QUESTION_LENGTH}
                rows={4}
                resize="none"
                placeholder="What do you want to know? Leave it empty for a general reading."
                fontFamily="Georgia, 'Times New Roman', serif"
                fontSize="16px"
                color="white"
                bg="rgba(7, 14, 114, 0.25)"
                border="1px solid #1565c0"
                borderRadius="16px"
                _placeholder={{ color: "rgba(79, 195, 247, 0.6)" }}
                _focusVisible={{
                  borderColor: "#4fc3f7",
                  boxShadow: "0 0 10px 2px #1900ff",
                  outline: "none",
                }}
              />
              <Text mt="6px" fontSize="xs" textAlign="right" opacity={0.7}>
                {question.length}/{MAX_QUESTION_LENGTH}
              </Text>
            </Dialog.Body>

            <Dialog.Footer justifyContent="center" pb="28px">
              <Button
                onClick={submit}
                bg="#000"
                color="#4fc3f7"
                border="1px solid #1565c0"
                borderRadius="full"
                px="28px"
                fontWeight="bold"
                boxShadow={glow}
                transition="box-shadow 0.3s"
                _hover={{ boxShadow: strongGlow }}
              >
                {question.trim() ? "Ask" : "Read the cards"}
              </Button>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" color="#4fc3f7" _hover={{ bg: "transparent", color: "white" }} />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default QuestionDialog;
