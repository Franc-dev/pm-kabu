/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Document {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    fileType: string;
    size: number;
    status: string;
    uploaderId: string;
    projectId: string;
    verifierId: string | null;
    createdAt: string;
    updatedAt: string;
    metadata: any | null;
  }