// utils/cloudinary.ts

export function getCloudinaryUrl(url: string, fileType: string): string {
    if (!url) return url;
    
    // If it's already a raw URL, return it
    if (url.includes('/raw/upload/')) return url;
    
    // If it's a PDF that was incorrectly uploaded as an image
    if (fileType.toLowerCase() === 'application/pdf' && url.includes('/image/upload/')) {
      const parts = url.split('/image/upload/');
      if (parts.length === 2) {
        const [base, path] = parts;
        // Remove any image transformations
        const cleanPath = path.split('/').pop();
        // Construct raw URL
        return `${base}/raw/upload/${cleanPath}`;
      }
    }
    
    return url;
  }
  
  export function isCloudinaryUrl(url: string): boolean {
    return url.includes('res.cloudinary.com');
  }
  
  export function getFileTypeFromUrl(url: string): string {
    const extension = url.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      default:
        return 'application/octet-stream';
    }
  }