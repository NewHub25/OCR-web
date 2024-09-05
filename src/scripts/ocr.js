import { createWorker } from "tesseract.js";

document
  .getElementById("imageUploader")
  .addEventListener("change", function (event) {
    try {
      console.group("Change event has dispatched");
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          console.group("READER loading");
          const img = new Image();
          img.src = e.target.result;

          img.onload = async function () {
            console.group("img loading");
            const worker = await createWorker("eng", 1, {
              logger: (m) => console.log(m), // Add logger here
            });
            const ret = await worker.recognize(img);
            console.log(ret.data.text);
            const {
              data: { text },
            } = ret;
            document.getElementById("extractedText").innerText = text;
            document.getElementById("status").innerText =
              "Text extracted successfully!";
            await worker.terminate();
            console.groupEnd();
          };
          console.groupEnd();
        };
        reader.readAsDataURL(file);
      }
      console.groupEnd();
    } catch (error) {
      console.log(error.message);
    }
  });
