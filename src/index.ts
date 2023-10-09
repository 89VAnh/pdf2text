import { Test } from "./extractor/Test";

let extractor = new Test("src/pdfs/1341.pdf");

// extractor.saveRawText("text");

extractor.getMetadata().then((x) => console.log(x));
