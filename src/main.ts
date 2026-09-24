import { Buffer } from 'buffer'
import './styles.css'
import 'highlight.js/styles/github.css'

;(globalThis as typeof globalThis & { Buffer: typeof Buffer }).Buffer = Buffer

void import('./bootstrap')
