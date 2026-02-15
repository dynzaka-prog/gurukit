import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

export async function exportSoalToDocx(data: any) {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: "DAFTAR SOAL",
                    heading: HeadingLevel.HEADING_1,
                    alignment: AlignmentType.CENTER,
                }),
                new Paragraph({
                    text: `${data.metadata.mapel} - ${data.metadata.materi}`,
                    alignment: AlignmentType.CENTER,
                    spacing: { after: 400 },
                }),
                ...data.soal.flatMap((s: any, i: number) => [
                    new Paragraph({
                        children: [
                            new TextRun({ text: `${i + 1}. `, bold: true }),
                            new TextRun(s.soal),
                        ],
                        spacing: { before: 200 },
                    }),
                    ...(s.opsi ? Object.entries(s.opsi).map(([key, val]) =>
                        new Paragraph({
                            text: `${key.toUpperCase()}. ${val}`,
                            indent: { left: 720 },
                        })
                    ) : []),
                    new Paragraph({
                        children: [
                            new TextRun({ text: "Kunci Jawaban: ", bold: true }),
                            new TextRun(s.kunci_jawaban.toUpperCase()),
                        ],
                        spacing: { before: 100, after: 200 },
                    }),
                ]),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Soal_${data.metadata.mapel}_${Date.now()}.docx`);
}

export async function exportModulToDocx(content: string) {
    // Simple markdown to docx conversion logic
    // For now, we'll treat it as a single block of text or split by lines
    const lines = content.split('\n');

    const doc = new Document({
        sections: [{
            properties: {},
            children: lines.map(line => {
                if (line.startsWith('# ')) {
                    return new Paragraph({ text: line.replace('# ', ''), heading: HeadingLevel.HEADING_1 });
                }
                if (line.startsWith('## ')) {
                    return new Paragraph({ text: line.replace('## ', ''), heading: HeadingLevel.HEADING_2 });
                }
                return new Paragraph({ text: line });
            }),
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Modul_Ajar_${Date.now()}.docx`);
}
