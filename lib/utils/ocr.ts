export async function extractTextFromPDF(file: File): Promise<string> {
    if (typeof window === 'undefined') return '';

    // Import pdfjs dynamically
    const pdfjs = await import('pdfjs-dist');
    // Set worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');
        fullText += pageText + '\n';
    }

    return fullText;
}

export async function extractTextFromImage(file: File): Promise<string> {
    if (typeof window === 'undefined') return '';

    const Tesseract = await import('tesseract.js');
    const { data: { text } } = await Tesseract.recognize(file, 'ind', {
        logger: m => console.log(m)
    });
    return text;
}

export async function extractTextFromFile(file: File): Promise<string> {
    if (file.type === 'application/pdf') {
        return extractTextFromPDF(file);
    } else if (file.type.startsWith('image/')) {
        return extractTextFromImage(file);
    }
    throw new Error('Format file tidak didukung');
}
