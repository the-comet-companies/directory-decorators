/**
 * Upload a file to Supabase Storage via the /api/upload endpoint.
 * Returns the public URL of the uploaded image.
 */
export async function uploadImage(file: File, folder: string = 'general'): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Upload failed')
  return data.url
}
