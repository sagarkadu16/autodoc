import React, { useEffect, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

const PDFThumbnail = ({ url }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const renderThumbnail = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);
        const viewport = page.getViewport({ scale: 0.3 });
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        await page.render({ canvasContext: context, viewport }).promise;
      } catch (err) {
        // Optionally handle error (e.g., show a placeholder)
        if (canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
      }
    };
    renderThumbnail();
  }, [url]);

  return (
    <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
      <div className="w-full h-full flex items-center justify-center p-2">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-contain rounded"
        />
      </div>
    </div>
  );
};

export default PDFThumbnail;
