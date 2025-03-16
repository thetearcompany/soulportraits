import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { SavedPortrait } from '@/types/portrait';

async function getImageAsBase64(imageUrl: string): Promise<string> {
  try {
    // Najpierw próbujemy pobrać obraz bezpośrednio
    const response = await fetch(imageUrl, {
      mode: 'cors',
      credentials: 'same-origin'
    });
    
    if (!response.ok) {
      throw new Error('Nie udało się pobrać obrazu');
    }
    
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Błąd podczas pobierania obrazu:', error);
    // Jeśli nie udało się pobrać obrazu, zwróć placeholder
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
  }
}

export async function generatePortraitPDF(portrait: SavedPortrait, containerRef: HTMLElement) {
  if (!portrait || !containerRef) {
    throw new Error('Brak wymaganych danych do wygenerowania PDF');
  }

  try {
    // Pobierz obraz jako base64 przed generowaniem PDF
    const imageBase64 = await getImageAsBase64(portrait.imageUrl || '');

    // Stwórz nowy element z czystym HTML i CSS
    const pdfContainer = document.createElement('div');
    pdfContainer.style.cssText = `
      width: 800px;
      padding: 40px;
      background-color: #FFFFFF;
      font-family: Arial, sans-serif;
    `;

    // Dodaj zawartość HTML używając base64 obrazu
    pdfContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #000000; font-size: 24px; margin-bottom: 20px;">
          Kabalistyczny Portret Duszy
        </h1>
        <div style="margin-bottom: 20px;">
          <img src="${imageBase64}" 
               style="max-width: 400px; height: auto;" 
          />
        </div>
        <div style="margin-bottom: 10px; font-size: 18px; color: #000000;">
          ${portrait.birthData.firstName} ${portrait.birthData.lastName}
        </div>
        <div style="color: #000000; font-size: 14px;">
          Data urodzenia: ${portrait.birthData.birthDate}
        </div>
        <div style="color: #000000; font-size: 14px;">
          Miejsce urodzenia: ${portrait.birthData.birthPlace}
        </div>
      </div>

      <div style="margin-top: 30px; color: #000000;">
        <h2 style="color: #000000; font-size: 20px; margin-bottom: 15px;">
          Cel Duszy
        </h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">
          ${portrait.analysis.soulPurpose}
        </p>

        ${portrait.analysis.treeOfLife ? `
          <h2 style="color: #000000; font-size: 20px; margin-bottom: 15px;">
            Drzewo Życia - Sefira ${portrait.analysis.treeOfLife.sefira}
          </h2>
          <p style="margin-bottom: 20px; line-height: 1.6;">
            ${portrait.analysis.treeOfLife.description}
          </p>
        ` : ''}

        ${portrait.analysis.spiritAnimal ? `
          <h2 style="color: #000000; font-size: 20px; margin-bottom: 15px;">
            Zwierzę Duchowe
          </h2>
          <p style="margin-bottom: 10px;">
            <strong>${portrait.analysis.spiritAnimal.name}</strong>
          </p>
          <p style="margin-bottom: 20px; line-height: 1.6;">
            ${portrait.analysis.spiritAnimal.description}
          </p>
        ` : ''}

        ${portrait.analysis.guardianAngel ? `
          <h2 style="color: #000000; font-size: 20px; margin-bottom: 15px;">
            Anioł Stróż
          </h2>
          <p style="margin-bottom: 10px;">
            <strong>${portrait.analysis.guardianAngel.name}</strong>
          </p>
          <p style="margin-bottom: 20px; line-height: 1.6;">
            ${portrait.analysis.guardianAngel.description}
          </p>
        ` : ''}

        <h2 style="color: #000000; font-size: 20px; margin-bottom: 15px;">
          Boska Ochrona
        </h2>
        <p style="margin-bottom: 20px; line-height: 1.6;">
          ${portrait.analysis.divineProtection}
        </p>
      </div>
    `;

    // Dodaj tymczasowo do dokumentu w ukrytym kontenerze
    const hiddenContainer = document.createElement('div');
    hiddenContainer.style.position = 'absolute';
    hiddenContainer.style.left = '-9999px';
    hiddenContainer.appendChild(pdfContainer);
    document.body.appendChild(hiddenContainer);

    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      allowTaint: true,
      foreignObjectRendering: false
    });

    // Usuń tymczasowy kontener
    document.body.removeChild(hiddenContainer);

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgData = canvas.toDataURL('image/jpeg', 1.0);
    
    // Oblicz wymiary z zachowaniem proporcji
    const imgWidth = pageWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    let remainingHeight = imgHeight;
    let currentPosition = 0;
    
    while (remainingHeight > 0) {
      const heightOnThisPage = Math.min(remainingHeight, pageHeight - 20);
      
      pdf.addImage(
        imgData,
        'JPEG',
        10,
        10,
        imgWidth,
        imgHeight,
        '',
        'FAST',
        0,
        -currentPosition
      );
      
      remainingHeight -= heightOnThisPage;
      currentPosition += heightOnThisPage;
      
      if (remainingHeight > 0) {
        pdf.addPage();
      }
    }

    pdf.save(`portret-duszy-${portrait.birthData.firstName}-${portrait.birthData.lastName}.pdf`);
  } catch (error) {
    console.error('Błąd podczas generowania PDF:', error);
    throw error;
  }
} 