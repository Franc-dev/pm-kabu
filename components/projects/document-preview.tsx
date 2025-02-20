/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { logger } from '@/lib/logger';
import toast from 'react-hot-toast';

// We'll load PDF.js only on the client side
let pdfjsLib: any = null;

// PDF.js loading function
async function loadPdfJs() {
  if (typeof window === 'undefined') return null;
  
  const pdfjs = await import('pdfjs-dist');
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  return pdfjs;
}

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentUrl: string;
  documentTitle: string;
}

export default function DocumentPreviewModal({ 
  isOpen, 
  onClose, 
  documentUrl, 
  documentTitle 
}: DocumentPreviewModalProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Initialize PDF.js when the component mounts
    loadPdfJs().then(pdfjs => {
      pdfjsLib = pdfjs;
    });
  }, []);

  useEffect(() => {
    if (!isOpen || !documentUrl || !pdfjsLib) return;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const loadingTask = pdfjsLib.getDocument(documentUrl);
        const pdf = await loadingTask.promise;
        
        setNumPages(pdf.numPages);
        await renderPage(pdf, 1);
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError('Failed to load PDF. Please try downloading it instead.');
        setLoading(false);
      }
    };

    loadPDF();
  }, [isOpen, documentUrl, currentPage]);

  const renderPage = async (pdf: any, pageNumber: number) => {
    if (!canvasRef.current || !pdfjsLib) return;

    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Failed to get 2D context');
      }

      // Calculate scale to fit the viewport while maintaining aspect ratio
      const viewport = page.getViewport({ scale: 1.0 });
      const containerWidth = canvas.parentElement?.clientWidth ?? 800;
      const scale = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale });

      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      await page.render({
        canvasContext: context,
        viewport: scaledViewport
      }).promise;
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render page');
    }
  };

  const changePage = async (delta: number) => {
    if (!numPages) return;
    
    const newPage = currentPage + delta;
    if (newPage > 0 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(documentUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = documentTitle || 'document.pdf';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      logger.error("Error downloading document", { error, documentUrl });
      toast.error("Failed to download document");
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-lg w-full max-w-6xl h-[90vh] overflow-hidden shadow-xl relative flex flex-col"
        >
          {/* Header */}
          <div className="border-b p-4 flex justify-between items-center bg-white">
            <h3 className="text-lg font-medium">{documentTitle}</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="Download"
              >
                <Download className="h-5 w-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Document viewer */}
          <div className="flex-1 overflow-auto bg-gray-100 relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-500 text-center p-4 bg-white rounded-lg shadow">
                  {error}
                </div>
              </div>
            )}

            <div className="flex justify-center p-4">
              <canvas ref={canvasRef} className="shadow-lg" />
            </div>
          </div>

          {/* Footer with pagination */}
          {numPages !== null && numPages > 1 && (
            <div className="border-t p-4 flex justify-center items-center space-x-4 bg-white">
              <button
                onClick={() => changePage(-1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-full ${currentPage === 1 ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm">
                Page {currentPage} of {numPages}
              </span>
              <button
                onClick={() => changePage(1)}
                disabled={currentPage === numPages}
                className={`p-2 rounded-full ${currentPage === numPages ? 'text-gray-400' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}