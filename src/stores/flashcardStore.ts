import { create } from 'zustand'

export interface FlashcardState {
  rotation: {
    x: number
    y: number
    z: number
  }
  currentImageIndex: number
  blendFactor: number
  isGyroscopeEnabled: boolean
  isDragging: boolean
}

export interface ImageSet {
  leftImage: string
  rightImage: string
}

interface FlashcardStore extends FlashcardState {
  setRotation: (rotation: Partial<FlashcardState['rotation']>) => void
  setCurrentImageIndex: (index: number) => void
  setBlendFactor: (factor: number) => void
  setGyroscopeEnabled: (enabled: boolean) => void
  setIsDragging: (dragging: boolean) => void
  resetRotation: () => void
}

const useFlashcardStore = create<FlashcardStore>((set) => ({
  rotation: { x: 0, y: 0, z: 0 },
  currentImageIndex: 0,
  blendFactor: 0.5,
  isGyroscopeEnabled: false,
  isDragging: false,
  
  setRotation: (rotation) => set((state) => ({
    rotation: { ...state.rotation, ...rotation }
  })),
  
  setCurrentImageIndex: (index) => set({ currentImageIndex: index }),
  
  setBlendFactor: (factor) => set({ blendFactor: factor }),
  
  setGyroscopeEnabled: (enabled) => set({ isGyroscopeEnabled: enabled }),
  
  setIsDragging: (dragging) => set({ isDragging: dragging }),
  
  resetRotation: () => set({ rotation: { x: 0, y: 0, z: 0 } })
}))

export default useFlashcardStore