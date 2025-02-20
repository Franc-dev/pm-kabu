import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import { logger } from '@/lib/logger';
import toast from 'react-hot-toast';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

// Define prop types
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
  const [numPages, setNumPages] = useState<number | null | undefined>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null | undefined>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen || !documentUrl) return;

    const loadPDF = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch the PDF as an array buffer
        const response = await fetch(documentUrl);
        if (!response.ok) throw new Error('Failed to fetch PDF');
        
        const arrayBuffer = await response.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        
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

  const renderPage = async (pdf: pdfjsLib.PDFDocumentProxy, pageNumber: number) => {
    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext('2d');
        if (context) {
          const viewport = page.getViewport({ scale: 1.5 });
          canvas.height = viewport.height;
          canvas.width = viewport.width;

          await page.render({
            canvasContext: context,
            viewport: viewport
          }).promise;
        } else {
          console.error('Failed to get 2D context');
          setError('Failed to render page: context is null');
        }
      } else {
        console.error('Canvas is null');
        setError('Failed to render page');
      }
    } catch (err) {
      console.error('Error rendering page:', err);
      setError('Failed to render page');
    }
  };

  const changePage = async (delta: number) => {
    if (numPages === null || numPages === undefined) return;
    const newPage = currentPage + delta;
    if (newPage > 0 && newPage <= numPages) {
      setCurrentPage(newPage);
    }
  };
  const handleDownload = async (doc: Document) => {
    try {
      // Fetch the file
      const response = await fetch(documentUrl)
      const blob = await response.blob()
  
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob)
  
      // Create a temporary link element
      const link = document.createElement('a')
      link.href = url
      link.download = doc.title || 'document.pdf' // Use document title or fallback
  
      // Append to body, click, and cleanup
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
  
    } catch (error) {
      logger.error("Error downloading document", { error, documentId: doc.URL })
      toast.error("Failed to download document")
    }
  }
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
                  onClick={() => handleDownload(document)}
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
          {numPages !== null && numPages !== undefined && numPages > 1 && (
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