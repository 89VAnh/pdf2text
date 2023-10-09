import * as fs from "fs";
import { PDFDocument, PDFPage } from "pdf-lib";
import PdfParse from "pdf-parse";

export interface IExtractable {
  extractInfo(): any;
  extractBuyer(): any;
  extractSeller(): any;
  extractTable(): any;
  getResult(): any;
}

export class PdfExtractor {
  private fileName: string;
  private extracted: any;

  constructor(fileName: string) {
    this.fileName = fileName;
  }

  async getDocInfo() {
    let fileBuff = await fs.readFileSync(this.fileName);
    let parser = await PdfParse(fileBuff);
    let pdfInfo = parser.info;
    if (pdfInfo) return pdfInfo;
    let docLines = await this.getDocLines();

    return null;
  }

  async getMetadata() {
    let fileBuff = await fs.readFileSync(this.fileName);
    let parser = await PdfParse(fileBuff);
    return parser.metadata;
  }

  protected renderPage(pageData: any): string {
    let render_options = {
      normalizeWhitespace: false,
      disableCombineTextItems: false,
    };
    let renderText = (textContent: any) => {
      let regex = /^[\d,.]+$/;
      let lastY,
        text = "";
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          if (regex.test(item.str)) {
            text += "#" + item.str + "#";
          } else if (item.str.endsWith(" ")) text += item.str;
          else text += item.str + "#";
        } else {
          if (regex.test(item.str)) text += "\n#" + item.str + "#";
          else text += "\n" + item.str;
        }
        lastY = item.transform[5];
      }
      return text;
    };
    return pageData.getTextContent(render_options).then(renderText);
  }

  protected async getDocLines() {
    try {
      let data = this.extracted ? this.extracted : await this.extractPDF();
      let textPageArr: string[] = data.textPages;
      let result: any[] = [];
      for (let textPage of textPageArr) {
        result.push(textPage.split("\n"));
      }
      return result;
    } catch (e: any) {
      console.log(e);
      return null;
    }
  }

  protected async getPageBuffer(document: PDFDocument, pageNum: number) {
    try {
      let newDoc = await PDFDocument.create();
      let [page] = await newDoc.copyPages(document, [pageNum]);
      newDoc.addPage(page);
      let buffArr = await newDoc.save();
      let buff = Buffer.from(buffArr);
      return buff;
    } catch (err: any) {
      console.log(err);
      return null;
    }
  }

  protected async getTextInPages(document: PDFDocument) {
    let pageText: string[] = [];
    for (let pageNum = 0; pageNum < document.getPageCount(); pageNum++) {
      let pageBuff = await this.getPageBuffer(document, pageNum);
      if (!pageBuff) continue;
      let parser = await PdfParse(pageBuff, {
        pagerender: await this.renderPage,
      });
      pageText.push(parser.text);
    }
    return pageText;
  }

  async extractPDF() {
    try {
      let fileContent = await fs.readFileSync(this.fileName);
      let pdfDoc = await PDFDocument.load(fileContent);
      let pageTextArr = await this.getTextInPages(pdfDoc);
      let docInfo = await this.getDocInfo();
      this.extracted = {
        textPages: pageTextArr,
        supplier: docInfo,
      };
      return this.extracted;
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async saveRaw(fileName: string) {
    try {
      let data = this.extracted ? this.extracted : await this.extractPDF();
      await fs.writeFileSync(fileName, JSON.stringify(data));
    } catch (e: any) {
      console.log(e);
    }
  }

  async saveRawText(fileName: string) {
    try {
      let data: any = this.extracted ? this.extracted : await this.extractPDF();
      let textArray = data.textPages;

      for (let i = 0; i < textArray.length; i++) {
        await fs.writeFileSync(`${fileName}-${i}.txt`, textArray[i]);
      }
    } catch (e: any) {
      console.log(e);
    }
  }
}
