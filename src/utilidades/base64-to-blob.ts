export const base64ToBlob = (base64String: string, options?: BlobPropertyBag | undefined) => {
  // Decode the base64 string
  const binaryString = atob(base64String);

  // Convert the binary string to a Uint8Array
  const byteArray = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    byteArray[i] = binaryString.charCodeAt(i);
  }

  // Create a Blob object from the Uint8Array
  return new Blob([byteArray], options);
};
