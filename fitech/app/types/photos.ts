export type Photo = {
  id: number;
  userId: number;
  fileName: string;
  fileType: string; // e.g. 'jpeg' | 'jpg'
  file_path: string;
  uploadedAt: [number, number, number, number, number, number]; // [YYYY, M, D, H, m, s]
};
