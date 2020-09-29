<template>
  <div id="froalaEditor">
    <froala
      id="edit"
      :tag="'textarea'"
      :config="config"
      v-model="model"
    ></froala>
  </div>
</template>

<script>
import VueFroala from "vue-froala-wysiwyg";
import { getBase64 } from "../../utils/helpers";
import Request from "../../services/base";

export default {
  name: "froalaEditor",
  props: {
    value: String
  },
  mounted() {
    this.model = this.value;
  },
  data() {
    const self = this;
    return {
      model: this.value,
      config: {
        imageMaxSize: 5 * 1024 * 1024,
        imageEditButtons: [
          "imageReplace",
          "imageAlign",
          "imageRemove",
          "|",
          "imageLink",
          "linkOpen",
          "linkEdit",
          "linkRemove",
          "-",
          "imageDisplay",
          "imageStyle",
          "imageAlt",
          "imageSize"
        ],
        // Allow to upload PNG and JPG.
        imageAllowedTypes: ["jpeg", "jpg", "png"],
        placeholder: "Edit Me",
        events: {
          contentChanged: function() {
            self.$emit("change", self.model);
          },
          "image.beforeUpload": async function(images) {
            const newImg = [];
            images.forEach(img => {
              newImg.push(img);
            });

            const newImages = newImg.map(async file => {
              const base64file = await getBase64(file);
              return Request({
                url: "/articles/upload/image",
                method: "POST",
                data: { file: base64file, fileName: file.name }
              }).then(res => res.data.data.url);
            });
            const resImage = await Promise.all(newImages);
            this.image.insert(resImage, null, null, this.image.get());
          }
        }
      }
    };
  }
};
</script>
