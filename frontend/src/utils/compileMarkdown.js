import { createElement } from 'react'
import marksy from 'marksy'

const compile = elements => marksy({ createElement, elements })

const compileMarkdown = elements => markdown => compile(elements)(markdown).tree

export default compileMarkdown
