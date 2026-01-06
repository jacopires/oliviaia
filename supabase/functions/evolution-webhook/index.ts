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

            // FILTRO: Ignorar grupos, broadcasts e newsletters
            if (remoteJid && (remoteJid.includes('@g.us') || remoteJid.includes('@broadcast') || remoteJid.includes('@newsletter'))) {
                console.log('⏭️ Ignorando grupo/broadcast:', remoteJid)
                return new Response(JSON.stringify({
                    received: true,
                    skipped: 'group_or_broadcast'
                }), { headers: corsHeaders })
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

                // Nome do contato
                pushName = messageData.pushName ||
                    messageData.name ||
                    (remoteJid ? remoteJid.split('@')[0] : 'Unknown')

                console.log('💬 textContent:', textContent)
                console.log('👤 pushName:', pushName)

                // SALVAR DIRETO - SEM FILTROS
                if (remoteJid) {
                    // 1. Criar/atualizar chat
                    const { data: chatData, error: chatError } = await supabase
                        .from('chats')
                        .upsert({
                            whatsapp_id: remoteJid,
                            name: pushName,
                            last_message_at: new Date().toISOString(),
                            status: 'Ativo'
                        }, { onConflict: 'whatsapp_id' })
                        .select('id')
                        .single()

                    if (chatError) {
                        console.error('❌ Chat error:', chatError)
                        return new Response(JSON.stringify({
                            error: 'chat_failed',
                            details: chatError.message
                        }), { status: 500, headers: corsHeaders })
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
