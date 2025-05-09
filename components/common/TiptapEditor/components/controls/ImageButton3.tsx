import React, { ChangeEvent, useRef } from "react";
import { uploadData, getUrl } from "aws-amplify/storage";
import MenuButton from "../MenuButton";
import { useEditorState } from "@tiptap/react";
import { useTiptapContext } from "../Provider";
import Dialog from "@/components/common/TiptapEditor/components/ui/Dialog";
import useModal from "@/components/common/TiptapEditor/hooks/useModal";
import MediaLibrary from "@/components/common/MediaLibrary";

const ImageButton = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { editor } = useTiptapContext();
  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      active: ctx.editor.isActive("image"),
      disabled: !ctx.editor.isEditable,
    }),
  });

  const { open, handleOpen, handleClose } = useModal();

  return (
    <>
      <MenuButton
        icon="Image"
        tooltip="Image"
        {...state}
        onClick={handleOpen}
      />
      <Dialog open={open} onOpenChange={handleClose}>
        <MediaLibrary
          onClose={handleClose}
          onInsert={(image) => {
            editor
              .chain()
              .focus()
              .insertImage({
                src: image.url,
                width: image.width,
                height: image.height,
              })
              .run();
            handleClose();
          }}
        />
      </Dialog>
    </>
  );
};

export default ImageButton;
