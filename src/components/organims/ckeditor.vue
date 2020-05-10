<template>
  <div id="my-ckeditor">
    <ckeditor
      :editor="editor"
      v-model="editorData"
      :config="editorConfig"
    ></ckeditor>
  </div>
</template>

<script>
// ⚠️ NOTE: We don't use @ckeditor/ckeditor5-build-classic any more!
// Since we're building CKEditor from source, we use the source version of ClassicEditor.
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";

import EssentialsPlugin from "@ckeditor/ckeditor5-essentials/src/essentials";
import BoldPlugin from "@ckeditor/ckeditor5-basic-styles/src/bold";
import ItalicPlugin from "@ckeditor/ckeditor5-basic-styles/src/italic";
import LinkPlugin from "@ckeditor/ckeditor5-link/src/link";
import ParagraphPlugin from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import CKFinder from "@ckeditor/ckeditor5-ckfinder/src/ckfinder";

const uploadUrl = process.env.VUE_APP_API_URL + "/articles/upload/image";

export default {
  name: "my-ckeditor",
  data() {
    return {
      editor: ClassicEditor,
      editorData: "<p>Content of the editor.</p>",
      editorConfig: {
        plugins: [
          EssentialsPlugin,
          BoldPlugin,
          ItalicPlugin,
          LinkPlugin,
          ParagraphPlugin,
          Image,
          ImageToolbar,
          ImageCaption,
          ImageStyle,
          ImageResize,
        ],
        ckfinder: {
          uploadUrl,
          options: {
            resourceType: "Images",
            openerMethod: "popup",
          },
        },
        toolbar: {
          items: [
            "bold",
            "italic",
            "link",
            "undo",
            "redo",
            "imageUpload",
            "imageTextAlternative",
            "imageStyle:full",
            "imageStyle:side",
          ],
        },
      },
    };
  },
};
</script>
