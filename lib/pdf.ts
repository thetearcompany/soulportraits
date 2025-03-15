import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SavedPortrait } from '@/types/portrait';

export async function generatePortraitPDF(portrait: SavedPortrait, containerRef: HTMLElement) {
  // Utwórz nowy dokument PDF w formacie A4
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Dodaj nagłówek
  pdf.setFontSize(24);
  pdf.setTextColor(75, 85, 99); // text-gray-600
  pdf.text('Portret Duszy', pageWidth / 2, 20, { align: 'center' });
  
  // Dodaj dane osoby
  pdf.setFontSize(12);
  pdf.setTextColor(79, 70, 229); // text-indigo-600
  pdf.text(`${portrait.birthData.firstName} ${portrait.birthData.lastName}`, pageWidth / 2, 30, { align: 'center' });

  try {
    // Konwertuj kontener na canvas
    const canvas = await html2canvas(containerRef, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Konwertuj canvas na obrazek
    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    // Oblicz wymiary obrazka, zachowując proporcje
    const imgWidth = pageWidth - 40; // marginesy 20mm z każdej strony
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Dodaj obrazek
    pdf.addImage(imgData, 'JPEG', 20, 40, imgWidth, imgHeight);
    
    // Dodaj analizę
    const textY = imgHeight + 60;
    pdf.setFontSize(12);
    pdf.setTextColor(55, 65, 81); // text-gray-700
    
    // Podziel tekst na linie
    const analysisText = `
Cel Duszy:
${portrait.analysis.soulPurpose}

Drzewo Życia - Sefira ${portrait.analysis.treeOfLife.sefira}:
${portrait.analysis.treeOfLife.description}

Liczba Życia: ${portrait.analysis.lifeNumber.number}
${portrait.analysis.lifeNumber.meaning}

Ścieżka Pasji: ${portrait.analysis.passionPath.name}
${portrait.analysis.passionPath.description}

Ścieżka Bólu: ${portrait.analysis.painPath.name}
${portrait.analysis.painPath.description}

Zwierzę Duchowe: ${portrait.analysis.spiritAnimal.name}
${portrait.analysis.spiritAnimal.description}

Boska Ochrona:
${portrait.analysis.divineProtection}
    `.trim();

    const splitAnalysis = pdf.splitTextToSize(analysisText, pageWidth - 40);
    pdf.text(splitAnalysis, 20, textY);
    
    // Dodaj datę
    pdf.setFontSize(10);
    pdf.setTextColor(107, 114, 128); // text-gray-500
    pdf.text(
      `Wygenerowano: ${new Date(portrait.createdAt).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`,
      20,
      pageHeight - 20
    );

    // Zapisz PDF
    pdf.save('portret-duszy.pdf');
  } catch (error) {
    console.error('Błąd podczas generowania PDF:', error);
    throw error;
  }
} 