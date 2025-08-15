declare module 'react-hook-form' {
  import * as React from 'react'
  export interface FieldValues {
    [key: string]: any
  }
  export type FieldPath<TFieldValues extends FieldValues = FieldValues> = keyof TFieldValues & string
  export interface ControllerProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
    name: TName
    render: (props: { field: any }) => React.ReactElement
  }
  export const Controller: React.FC<any>
  export const FormProvider: React.FC<any>
  export function useFormContext(): {
    getFieldState: (name: any, formState: any) => any
    formState: any
  }
}
