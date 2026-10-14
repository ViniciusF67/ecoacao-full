import { api } from './api.js'

export async function enviarMensagemContato({ nome, email, assunto, mensagem }) {
  return api('/contato', { method: 'POST', body: { nome, email, assunto, mensagem } })
}
