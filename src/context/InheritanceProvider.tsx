import { createContext, useContext, type ReactNode } from 'react'

type InheritanceContextType = {
    onChange: (name?: string, value?: unknown) => void
    getFieldValue: (name: string) => unknown
}

const InheritanceContext = createContext<InheritanceContextType | undefined>(undefined)

export const useInheritanceContext = () => {
    const context = useContext(InheritanceContext)
    if (!context) {
        throw new Error('useInheritanceContext must be used within an InheritanceProvider')
    }
    return context
}

type InheritanceProviderProps = {
    children: ReactNode
    onChange: (name?: string, value?: unknown) => void
    getFieldValue: (name: string) => unknown
}

export const InheritanceProvider = ({ children, onChange, getFieldValue }: InheritanceProviderProps) => {
    return (
        <InheritanceContext.Provider value={{ onChange, getFieldValue }}>
            {children}
        </InheritanceContext.Provider>
    )
}
