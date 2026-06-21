import path from 'path';
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf.mjs';

export async function pdfParse(school: string, year: number, difficulty: "novice" | "intermediate" | "advanced", pdfBuffer?: ArrayBuffer): Promise<any> {
    let pdfDocument: PDFJS.PDFDocumentProxy | null = null;

    if (pdfBuffer) {
        const loadingTask = PDFJS.getDocument({ data: pdfBuffer });
        pdfDocument = await loadingTask.promise;
    }

    const loadingTask = PDFJS.getDocument({url: `https://www.certamenlibrary.org/static/rounds/${school}/${school}_${difficulty}_${year}.pdf`, standardFontDataUrl: undefined});
    pdfDocument = await loadingTask.promise;

    let fullText = '';

    if (pdfDocument) {
        for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
            const page = await pdfDocument.getPage(pageNum);
            const pageText = await extractTextFromPage(page);
            fullText += pageText;
        }
    }

    return fullText
}

async function extractTextFromPage(page: PDFJS.PDFPageProxy): Promise<string> {
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(' ');
}