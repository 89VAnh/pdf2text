import { PdfExtractor } from "./PDFExtractor";

export class Test extends PdfExtractor {
  private docLines: Promise<any[] | null>;
  constructor(fileName: string) {
    super(fileName);
    this.docLines = this.getDocLines();
  }

  // ************* 1 ******************
  // protected override renderPage(pageData: any): string {
  //   let render_options = {
  //     normalizeWhitespace: false,
  //     disableCombineTextItems: false,
  //   };
  //   let renderText = (textContent: any) => {
  //     let text = "";
  //     let items: any[] = [];

  //     textContent.items.forEach((item: any) => {
  //       items.push({
  //         str: item.str,
  //         x: item.transform[4],
  //         y: Math.floor(item.transform[5] / 4),
  //       });
  //     });

  //     let textMap: Map<number, any[]> = new Map<number, any[]>();
  //     for (let item of items) {
  //       let itemMap = textMap.get(item.y);
  //       if (itemMap) {
  //         itemMap.push(item);
  //       } else {
  //         textMap.set(item.y, [item]);
  //       }
  //     }
  //     textMap = new Map(Array.from(textMap).sort((x, y) => y[0] - x[0]));
  //     for (let value of textMap.values()) {
  //       text +=
  //         value
  //           ?.sort((x, y) => x.x - y.x)
  //           .map((x) => x.str)
  //           .join("#") + "\n";
  //     }
  //     return text;
  //   };
  //   return pageData.getTextContent(render_options).then(renderText);
  // }

  // *********** 2 ***********
  // protected override renderPage(pageData: any): string {
  //   let render_options = {
  //     normalizeWhitespace: true,
  //     disableCombineTextItems: false,
  //   };

  //   let renderText = (textContent: any) => {
  //     let text = "";
  //     let items: any[] = [];

  //     textContent.items.forEach((item: any) => {
  //       items.push({
  //         str: item.str,
  //         x: item.transform[4],
  //         y: Math.floor(item.transform[5] / 16),
  //       });
  //     });

  //     let textMap: Map<number, string> = new Map();

  //     let tmpText = "",
  //       lastX = -1,
  //       lastY = -1;
  //     let maxY = -1;
  //     for (let item of items) {
  //       if (lastY == item.y || lastY == -1) {
  //         tmpText += "#" + item.str;
  //       } else {
  //         if (
  //           (lastX == item.x && Math.abs(lastY - item.y) <= 28) ||
  //           lastX == -1
  //         ) {
  //           tmpText += "\n" + item.str;
  //           maxY = item.y > maxY ? item.y : maxY;
  //         } else {
  //           if (maxY == -1) maxY = item.y;
  //           if (textMap.get(maxY)) {
  //             textMap.set(maxY, textMap.get(maxY) + "\n" + tmpText);
  //           } else textMap.set(maxY, tmpText);
  //           tmpText = item.str;
  //           maxY = item.y;
  //         }
  //       }
  //       lastY = item.y;
  //       lastX = item.x;
  //     }
  //     if (tmpText) {
  //       if (textMap.get(maxY)) {
  //         textMap.set(maxY, textMap.get(maxY) + "\n" + tmpText);
  //       } else textMap.set(maxY, tmpText);
  //     }

  //     textMap = new Map(Array.from(textMap).sort((x, y) => y[0] - x[0]));

  //     for (let value of textMap.values()) {
  //       text += value + "\n";
  //     }
  //     return text;
  //   };

  //   return pageData.getTextContent(render_options).then(renderText);
  // }

  // *********** 3 ***********
  // protected override renderPage(pageData: any): string {
  //   let render_options = {
  //     normalizeWhitespace: false,
  //     disableCombineTextItems: false,
  //   };

  //   let renderText = (textContent: any) => {
  //     let lastY,
  //       text = "";
  //     for (let item of textContent.items) {
  //       if (lastY == item.transform[5] || !lastY) {
  //         text += "#" + item.str;
  //       } else {
  //         text += "\n" + item.str + "#";
  //       }
  //       lastY = item.transform[5];
  //     }
  //     return text;
  //   };

  //   return pageData.getTextContent(render_options).then(renderText);
  // }
}
