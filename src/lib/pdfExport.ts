import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export async function generatePDF() {
  // Open export view in a hidden iframe
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.left = "-9999px";
  iframe.style.top = "0";
  iframe.style.width = "1200px";
  iframe.style.height = "10000px";
  iframe.style.border = "none";
  iframe.src = "/export";
  document.body.appendChild(iframe);

  // Wait for iframe to load
  await new Promise<void>((resolve) => {
    iframe.onload = () => {
      // Give recharts time to render
      setTimeout(resolve, 1500);
    };
  });

  const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
  const exportRoot = iframeDoc?.getElementById("export-root");
  if (!exportRoot) {
    document.body.removeChild(iframe);
    throw new Error("Export view failed to render");
  }

  const canvas = await html2canvas(exportRoot, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#0a0a0f",
    width: 1200,
    windowWidth: 1200,
  });

  document.body.removeChild(iframe);

  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const pageHeight = 297; // A4 height in mm

  const pdf = new jsPDF("p", "mm", "a4");
  let position = 0;

  while (position < imgHeight) {
    if (position > 0) pdf.addPage();

    pdf.addImage(
      canvas.toDataURL("image/png"),
      "PNG",
      0,
      -position,
      imgWidth,
      imgHeight
    );

    position += pageHeight;
  }

  pdf.save("lethal-plan-report.pdf");
}
