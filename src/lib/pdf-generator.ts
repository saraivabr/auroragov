export interface PDFDocumentData {
  titulo: string;
  tipo: string;
  conteudo: string;
  destinatario?: string;
  numeroDocumento?: string;
  data?: string;
  usuario?: string;
}

export async function generatePDF(data: PDFDocumentData): Promise<Blob> {
  const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 2.5cm;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .title {
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 10px;
        }
        .content {
            text-align: justify;
            white-space: pre-wrap;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${data.titulo.toUpperCase()}</div>
        <div>${data.tipo.toUpperCase()}</div>
        ${data.numeroDocumento ? `<div>Nº ${data.numeroDocumento}</div>` : ''}
    </div>
    <div class="content">${data.conteudo}</div>
    <div class="footer">
        <p>Documento gerado em ${data.data || new Date().toLocaleDateString('pt-BR')}</p>
        <p>Assistente Governamental IA - Sistema de Gestão Documental</p>
    </div>
</body>
</html>
  `;

  const blob = new Blob([content], { type: 'text/html' });
  return blob;
}

export function downloadPDF(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.html') ? filename : `${filename}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function exportDocumentToPDF(data: PDFDocumentData) {
  const blob = await generatePDF(data);
  const filename = `${data.tipo}_${data.numeroDocumento || 'documento'}_${new Date().toISOString().split('T')[0]}`;
  downloadPDF(blob, filename);
}

export async function printDocument(data: PDFDocumentData) {
  const content = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        @page {
            size: A4;
            margin: 2.5cm;
        }
        body {
            font-family: 'Times New Roman', Times, serif;
            font-size: 12pt;
            line-height: 1.5;
            color: #000;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .title {
            font-weight: bold;
            font-size: 14pt;
            margin-bottom: 10px;
        }
        .content {
            text-align: justify;
            white-space: pre-wrap;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${data.titulo.toUpperCase()}</div>
        <div>${data.tipo.toUpperCase()}</div>
        ${data.numeroDocumento ? `<div>Nº ${data.numeroDocumento}</div>` : ''}
    </div>
    <div class="content">${data.conteudo}</div>
    <div class="footer">
        <p>Documento gerado em ${data.data || new Date().toLocaleDateString('pt-BR')}</p>
        <p>Assistente Governamental IA - Sistema de Gestão Documental</p>
    </div>
</body>
</html>
  `;

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}
