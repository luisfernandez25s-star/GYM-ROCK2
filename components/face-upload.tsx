'use client'

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, Upload, Loader2, CheckCircle2, XCircle, RefreshCw, User } from 'lucide-react'
import { toast } from 'sonner'

interface FaceUploadProps {
  userId: string
  currentPhoto?: string
  onPhotoUploaded?: (url: string) => void
}

export function FaceUpload({ userId, currentPhoto, onPhotoUploaded }: FaceUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null)
  const [file, setFile] = useState<File | null>(null)
  const [faceDetected, setFaceDetected] = useState<boolean | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const analyzeFace = useCallback(async (imageFile: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new window.Image()
      img.crossOrigin = 'anonymous'
      img.onload = async () => {
        // Method 1: Try native FaceDetector API (Chrome/Edge)
        if ('FaceDetector' in window) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const detector = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 5 })
            const faces = await detector.detect(img)
            resolve(faces.length > 0)
            return
          } catch {
            // Fall through to heuristic
          }
        }

        // Method 2: Canvas-based heuristic - check skin tone ratio
        const canvas = canvasRef.current
        if (!canvas) { resolve(false); return }
        
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(false); return }

        // Resize to small for performance
        const size = 200
        canvas.width = size
        canvas.height = size
        ctx.drawImage(img, 0, 0, size, size)
        
        const imageData = ctx.getImageData(0, 0, size, size)
        const data = imageData.data
        
        let skinPixels = 0
        const totalPixels = size * size
        
        // Analyze center region where face typically is
        const startX = Math.floor(size * 0.2)
        const endX = Math.floor(size * 0.8)
        const startY = Math.floor(size * 0.1)
        const endY = Math.floor(size * 0.7)
        let regionPixels = 0
        
        for (let y = startY; y < endY; y++) {
          for (let x = startX; x < endX; x++) {
            const i = (y * size + x) * 4
            const r = data[i]
            const g = data[i + 1]
            const b = data[i + 2]
            
            regionPixels++
            
            // Skin tone detection (works across multiple skin tones)
            if (r > 60 && g > 40 && b > 20 &&
                r > g && r > b &&
                Math.abs(r - g) > 15 &&
                r - b > 15 &&
                r < 255 && g < 240 && b < 230) {
              skinPixels++
            }
          }
        }
        
        const skinRatio = skinPixels / regionPixels
        
        // Check if image is not too uniform (plain color)
        let variance = 0
        const sampleSize = Math.min(1000, totalPixels)
        const step = Math.floor(totalPixels / sampleSize)
        const values: number[] = []
        
        for (let i = 0; i < data.length; i += step * 4) {
          values.push((data[i] + data[i + 1] + data[i + 2]) / 3)
        }
        
        const mean = values.reduce((a, b) => a + b, 0) / values.length
        variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length
        
        // Needs skin-like pixels (12%+) AND some variance (not a solid color)
        const hasLikelyFace = skinRatio > 0.12 && variance > 200
        resolve(hasLikelyFace)
      }
      img.onerror = () => resolve(false)
      img.src = URL.createObjectURL(imageFile)
    })
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Reset state
    setFaceDetected(null)
    setErrorMsg('')
    setFile(null)

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(selectedFile.type)) {
      setErrorMsg('Formato no soportado. Usa JPG, PNG o WebP')
      return
    }

    // Validate size
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg('La imagen no debe superar 5MB')
      return
    }

    // Show preview
    const url = URL.createObjectURL(selectedFile)
    setPreview(url)

    // Analyze for face
    setIsAnalyzing(true)
    try {
      const detected = await analyzeFace(selectedFile)
      setFaceDetected(detected)
      if (detected) {
        setFile(selectedFile)
      } else {
        setErrorMsg('No se detecto un rostro en la imagen. Asegurate de que tu cara sea visible y este bien iluminada.')
      }
    } catch {
      setFaceDetected(false)
      setErrorMsg('Error al analizar la imagen')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleUpload = async () => {
    if (!file || !faceDetected) return

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('photo', file)
      formData.append('userId', userId)
      formData.append('hasFace', 'true')

      const res = await fetch('/api/face-upload', {
        method: 'POST',
        body: formData
      })
      const data = await res.json()

      if (data.success) {
        toast.success('Foto de rostro guardada exitosamente')
        onPhotoUploaded?.(data.photoUrl)
      } else {
        toast.error(data.error || 'Error al guardar foto')
      }
    } catch {
      toast.error('Error de conexion')
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setPreview(currentPhoto || null)
    setFile(null)
    setFaceDetected(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-4">
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Preview Area */}
      <div className="relative w-full aspect-square max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted/30">
        {preview ? (
          <img src={preview} alt="Vista previa" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
            <User className="h-16 w-16 mb-2 opacity-30" />
            <p className="text-sm">Sin foto</p>
          </div>
        )}

        {/* Face detection overlay */}
        {isAnalyzing && (
          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-white animate-spin mb-2" />
            <p className="text-white text-sm font-medium">Analizando rostro...</p>
          </div>
        )}

        {faceDetected === true && !isAnalyzing && (
          <div className="absolute top-2 right-2">
            <div className="bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Rostro detectado
            </div>
          </div>
        )}

        {faceDetected === false && !isAnalyzing && (
          <div className="absolute top-2 right-2">
            <div className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
              <XCircle className="h-3 w-3" /> Sin rostro
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-xs text-red-400 flex items-start gap-2">
            <XCircle className="h-4 w-4 shrink-0 mt-0.5" />
            {errorMsg}
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="p-3 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs font-semibold mb-1">Consejos para una buena foto:</p>
        <ul className="text-xs text-muted-foreground space-y-0.5">
          <li>{"- Mira directamente a la camara"}</li>
          <li>{"- Buena iluminacion, sin sombras en la cara"}</li>
          <li>{"- Fondo limpio, sin objetos"}</li>
          <li>{"- Sin lentes de sol ni gorras"}</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
        
        {!file ? (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Analizando...</>
            ) : (
              <><Camera className="mr-2 h-4 w-4" />Seleccionar foto</>
            )}
          </Button>
        ) : (
          <>
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isUploading}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Cambiar
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleUpload}
              disabled={isUploading || !faceDetected}
            >
              {isUploading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Guardando...</>
              ) : (
                <><Upload className="mr-2 h-4 w-4" />Guardar foto</>
              )}
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
