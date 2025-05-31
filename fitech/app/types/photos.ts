export type Photo = {
  id: number;
  userId: number;
  fileName: string;
  fileType: string;
  file_path: string;
  uploadedAt: [number, number, number, number, number, number];
};

export type SetProfilePhotoRequest = {
  photoId: number;
};
