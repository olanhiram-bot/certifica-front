export interface TextoFijoLink {
  texto: string
  url: string
  name?: string
}

export interface TextoFijoCheckbox {
  id: string
  texto: string
  modelValue: boolean
}

export interface TextoFijoProps {
  titulo: string
  contenido: string
  contenidoHtml?: string
  links?: TextoFijoLink[]
  checkbox?: TextoFijoCheckbox
}
