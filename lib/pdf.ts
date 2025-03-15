import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SavedPortrait } from '@/types/portrait';

export async function generatePortraitPDF(portrait: SavedPortrait, containerRef: HTMLElement) {
  if (!portrait || !containerRef) {
    throw new Error('Brak wymaganych danych do generowania PDF');
  }

  // Utwórz nowy dokument PDF w formacie A4
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Dodaj tło
  pdf.setFillColor(88, 28, 135); // Głęboki fiolet
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');
  
  // Dodaj gradient
  pdf.setFillColor(139, 92, 246); // Jasny fiolet
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  // Dodaj nagłówek
  pdf.setFontSize(24);
  pdf.setTextColor(255, 255, 255); // Biały
  pdf.text('Portret Duszy', pageWidth / 2, 20, { align: 'center' });
  
  // Dodaj dane osoby
  pdf.setFontSize(12);
  pdf.setTextColor(216, 180, 254); // Jasny fiolet
  const fullName = `${portrait.birthData?.firstName || ''} ${portrait.birthData?.lastName || ''}`.trim();
  pdf.text(fullName, pageWidth / 2, 30, { align: 'center' });

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
    pdf.setTextColor(216, 180, 254); // Jasny fiolet
    
    // Podziel tekst na linie
    const analysisText = `
Cel Duszy:
${portrait.analysis?.soulPurpose || 'Brak opisu celu duszy'}

${portrait.analysis?.treeOfLife ? `Drzewo Życia - Sefira ${portrait.analysis.treeOfLife.sefira || 'Nie określono'}:
${portrait.analysis.treeOfLife.description || 'Brak opisu'}` : ''}

${portrait.analysis?.lifeNumber ? `Liczba Życia: ${portrait.analysis.lifeNumber.number || 'Nie określono'}
${portrait.analysis.lifeNumber.meaning || 'Brak opisu'}` : ''}

${portrait.analysis?.passionPath ? `Ścieżka Pasji: ${portrait.analysis.passionPath.name || 'Nie określono'}
${portrait.analysis.passionPath.description || 'Brak opisu'}` : ''}

${portrait.analysis?.painPath ? `Ścieżka Bólu: ${portrait.analysis.painPath.name || 'Nie określono'}
${portrait.analysis.painPath.description || 'Brak opisu'}` : ''}

${portrait.analysis?.spiritAnimal ? `Zwierzę Duchowe: ${portrait.analysis.spiritAnimal.name || 'Nie określono'}
${portrait.analysis.spiritAnimal.description || 'Brak opisu'}` : ''}

${portrait.analysis?.guardianAngel ? `Anioł Stróż: ${portrait.analysis.guardianAngel.name || 'Nie określono'}
${portrait.analysis.guardianAngel.description || 'Brak opisu'}` : ''}

Boska Ochrona:
${portrait.analysis?.divineProtection || 'Brak opisu boskiej ochrony'}
    `.trim();

    const splitAnalysis = pdf.splitTextToSize(analysisText, pageWidth - 40);
    pdf.text(splitAnalysis, 20, textY);
    
    // Dodaj datę
    pdf.setFontSize(10);
    pdf.setTextColor(167, 139, 250); // Średni fiolet
    const creationDate = portrait.createdAt ? new Date(portrait.createdAt) : new Date();
    pdf.text(
      `Wygenerowano: ${creationDate.toLocaleDateString('pl-PL', {
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