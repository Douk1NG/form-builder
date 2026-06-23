import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { createFormDocumentSlice, type FormDocumentSlice } from './slices/FormDocuments'
import { createCanvasItemsSlice, type CanvasItemsSlice } from './slices/CanvasItems'
import { createBuilderUiSlice, type BuilderUiSlice } from './slices/BuilderUI'
import { formBuilderPersistConfig } from './BuilderPersistence'

export type FormBuilderState = FormDocumentSlice & CanvasItemsSlice & BuilderUiSlice

export const useFormBuilderStore = create<FormBuilderState>()(
  persist(
    (...args) => ({
      ...createFormDocumentSlice(...args),
      ...createCanvasItemsSlice(...args),
      ...createBuilderUiSlice(...args),
    }),
    formBuilderPersistConfig
  )
)