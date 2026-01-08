// @ts-nocheck
// VERSÃO ULTRA SIMPLIFICADA - SALVA TUDO QUE CHEGAR
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const payload = await req.json()

        console.log('📦 RAW PAYLOAD:', JSON.stringify(payload, null, 2))

        // ESTRATÉGIA RADICAL: Tentar pegar mensagem de QUALQUER lugar
        let messageData = null
        let remoteJid = null
        let textContent = ''
        let pushName = 'Unknown'

        // Busca no payload.data (padrão Evolution v2)
        if (payload.data) {
            // Se data é array
            if (Array.isArray(payload.data)) {
                messageData = payload.data[0]
            } else {
                messageData = payload.data
            }
        }

        console.log('� messageData found:', !!messageData)

        if (messageData) {
            // Extrair remoteJid de QUALQUER lugar
            remoteJid = messageData.key?.remoteJid ||
                messageData.remoteJid ||
                messageData.from ||
                messageData.chatId ||
                null

            console.log('📞 remoteJid:', remoteJid)

            // FILTRO 0: Verificar addressingMode (se for "lid", ignorar)
            const addressingMode = messageData.key?.addressingMode
            if (addressingMode === 'lid') {
                console.log('⏭️ Ignorando addressingMode lid')
                return new Response(JSON.stringify({
                    received: true,
                    skipped: 'lid_addressing_mode'
                }), { headers: corsHeaders })
            }

            // FILTRO 1: Validar formato do remoteJid
            // Deve conter @ para ser válido (ex: 5511999999999@s.whatsapp.net)
            // Se for apenas números, é provável que seja um lid ou ID inválido
            // @lid = Local ID (não é um contato real do WhatsApp)
            if (remoteJid && (!remoteJid.includes('@') || remoteJid.includes('@lid'))) {
                console.log('⏭️ Ignorando ID numérico ou lid:', remoteJid)
                return new Response(JSON.stringify({
                    received: true,
                    skipped: 'invalid_id_format'
                }), { headers: corsHeaders })
            }

            // FILTRO 2: Ignorar broadcasts e newsletters (grupos são permitidos)
            if (remoteJid && (remoteJid.includes('@broadcast') || remoteJid.includes('@newsletter'))) {
                console.log('⏭️ Ignorando broadcast/newsletter:', remoteJid)
                return new Response(JSON.stringify({
                    received: true,
                    skipped: 'broadcast_or_newsletter'
                }), { headers: corsHeaders })
            }

            // Detectar tipo de chat
            const chatType = remoteJid && remoteJid.includes('@g.us') ? 'group' : 'individual'
            console.log('📋 Tipo de chat:', chatType)

            // Normalizar remoteJid removendo sufixos numéricos (ex: 5517992236075:24@s.whatsapp.net → 5517992236075@s.whatsapp.net)
            // Isso previne duplicatas quando a API envia o mesmo número com sufixos diferentes
            if (remoteJid && remoteJid.includes(':')) {
                const parts = remoteJid.split('@')
                if (parts.length === 2) {
                    const numberPart = parts[0].split(':')[0]  // Remove :24, :45, etc.
                    remoteJid = `${numberPart}@${parts[1]}`
                    console.log('🔧 remoteJid normalizado:', remoteJid)
                }
            }

            // Se tem remoteJid, tentar extrair texto
            if (remoteJid) {
                // Texto pode estar em vários lugares
                if (messageData.message?.conversation) {
                    textContent = messageData.message.conversation
                } else if (messageData.message?.extendedTextMessage?.text) {
                    textContent = messageData.message.extendedTextMessage.text
                } else if (messageData.text) {
                    textContent = messageData.text
                } else if (messageData.content) {
                    textContent = messageData.content
                } else if (typeof messageData.message === 'string') {
                    textContent = messageData.message
                }

                // Nome do contato - NÃO usar número como fallback
                pushName = messageData.pushName ||
                    messageData.name ||
                    messageData.notifyName ||
                    messageData.verifiedName ||
                    'Contato sem nome'

                // Se o "nome" for só números ou contiver ':', substituir por fallback
                if (/^\d+$/.test(pushName) || pushName.includes(':') || pushName.includes('@')) {
                    pushName = 'Contato sem nome'
                }

                console.log('💬 textContent:', textContent)
                console.log('👤 pushName:', pushName)

                // SALVAR DIRETO - Preservar nomes existentes
                if (remoteJid) {
                    // 1. Verificar se o chat já existe
                    const { data: existingChat } = await supabase
                        .from('chats')
                        .select('id, name')
                        .eq('whatsapp_id', remoteJid)
                        .single()

                    let chatData

                    if (existingChat) {
                        // Chat já existe: apenas atualizar timestamp, NÃO sobrescrever nome
                        console.log(`♻️  Chat existente, mantendo nome: "${existingChat.name}"`)
                        const { data, error } = await supabase
                            .from('chats')
                            .update({
                                last_message_at: new Date().toISOString(),
                                status: 'Ativo',
                                type: chatType
                            })
                            .eq('whatsapp_id', remoteJid)
                            .select('id')
                            .single()

                        if (error) {
                            console.error('❌ Chat update error:', error)
                            return new Response(JSON.stringify({
                                error: 'chat_update_failed',
                                details: error.message
                            }), { status: 500, headers: corsHeaders })
                        }
                        chatData = data
                    } else {
                        // Chat novo: criar com pushName
                        console.log(`✨ Novo chat, definindo nome: "${pushName}"`)
                        const { data, error } = await supabase
                            .from('chats')
                            .insert({
                                whatsapp_id: remoteJid,
                                name: pushName,
                                last_message_at: new Date().toISOString(),
                                status: 'Ativo',
                                type: chatType
                            })
                            .select('id')
                            .single()

                        if (error) {
                            console.error('❌ Chat insert error:', error)
                            return new Response(JSON.stringify({
                                error: 'chat_insert_failed',
                                details: error.message
                            }), { status: 500, headers: corsHeaders })
                        }
                        chatData = data
                    }

                    console.log('✅ Chat upserted:', chatData.id)

                    // 2. Se tiver texto, inserir mensagem
                    if (textContent && chatData?.id) {
                        const isFromMe = messageData.key?.fromMe || messageData.fromMe || false

                        const { error: msgError } = await supabase
                            .from('messages')
                            .insert({
                                chat_id: chatData.id,
                                sender: isFromMe ? 'agent' : 'user',
                                text: textContent
                            })

                        if (msgError) {
                            console.error('❌ Message error:', msgError)
                        } else {
                            console.log('✅ Message inserted!')
                        }
                    } else {
                        console.log('⚠️ No text content to save')
                    }

                    return new Response(JSON.stringify({
                        success: true,
                        chatId: chatData.id,
                        hasText: !!textContent
                    }), { headers: corsHeaders })
                }
            } else {
                console.log('⚠️ No remoteJid found')
            }
        } else {
            console.log('⚠️ No message data found')
        }

        return new Response(JSON.stringify({
            received: true,
            processed: false,
            reason: 'no_message_or_jid'
        }), { headers: corsHeaders })

    } catch (error) {
        console.error('❌ Error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500, headers: corsHeaders
        })
    }
})
