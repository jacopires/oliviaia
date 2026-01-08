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

        // Busca no payload.data e variantes
        if (payload.data) {
            if (Array.isArray(payload.data)) {
                messageData = payload.data[0]
            } else if (payload.data.records && Array.isArray(payload.data.records)) {
                messageData = payload.data.records[0] // Formato paginado/search
            } else {
                messageData = payload.data
            }
        } else if (payload.event === 'messages.upsert' && payload.data) {
            messageData = payload.data;
        } else {
            // Tentar usar o payload raiz como messageData se nada mais bater
            messageData = payload;
        }

        console.log('📨 messageData found:', !!messageData)

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

            // FILTRO 2: Ignorar broadcasts, newsletters e GRUPOS
            if (remoteJid && (remoteJid.includes('@broadcast') || remoteJid.includes('@newsletter') || remoteJid.includes('@g.us'))) {
                console.log('⏭️ Ignorando broadcast/newsletter/grupo:', remoteJid)
                return new Response(JSON.stringify({
                    received: true,
                    skipped: 'broadcast_newsletter_group'
                }), { headers: corsHeaders })
            }

            // Detectar tipo de chat (agora só individual deve passar, mas mantemos lógica defensiva)
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

            // Se tem remoteJid, tentar extrair texto e ID
            if (remoteJid) {
                const providerMessageId = messageData.key?.id || messageData.id || null;
                console.log('🆔 provider_message_id:', providerMessageId);

                // Tentar extrair mídia (Base64 ou URL)
                let mediaUrl = null;
                let mediaType = null;
                const msg = messageData.message;

                if (msg) {
                    if (msg.imageMessage) {
                        mediaType = 'image';
                        textContent = msg.imageMessage.caption || textContent || '[Imagem]';
                        // Prioridade: Base64 no payload raiz > Base64 na msg > URL
                        const b64 = messageData.base64 || msg.imageMessage.jpegThumbnail; // Thumb é muito pequeno, mas fallback
                        if (messageData.base64) {
                            mediaUrl = `data:${msg.imageMessage.mimetype || 'image/jpeg'};base64,${messageData.base64}`;
                        } else if (msg.imageMessage.url) {
                            // Evolution URLs podem precisar de auth, mas salvamos o que vier
                            mediaUrl = msg.imageMessage.url;
                        }
                    } else if (msg.audioMessage) {
                        mediaType = 'audio';
                        textContent = '[Áudio]';
                        if (messageData.base64) {
                            mediaUrl = `data:${msg.audioMessage.mimetype || 'audio/mp4'};base64,${messageData.base64}`;
                        } else if (msg.audioMessage.url) {
                            mediaUrl = msg.audioMessage.url;
                        }
                    } else if (msg.videoMessage) {
                        mediaType = 'video';
                        textContent = msg.videoMessage.caption || textContent || '[Vídeo]';
                        if (messageData.base64) {
                            mediaUrl = `data:${msg.videoMessage.mimetype || 'video/mp4'};base64,${messageData.base64}`;
                        } else if (msg.videoMessage.url) {
                            mediaUrl = msg.videoMessage.url;
                        }
                    } else if (msg.stickerMessage) {
                        mediaType = 'image'; // Tratamos sticker como imagem por enquanto
                        textContent = '[Sticker]';
                        if (messageData.base64) {
                            mediaUrl = `data:${msg.stickerMessage.mimetype || 'image/webp'};base64,${messageData.base64}`;
                        } else if (msg.stickerMessage.url) {
                            mediaUrl = msg.stickerMessage.url;
                        }
                    } else if (msg.documentMessage) {
                        mediaType = 'document';
                        textContent = msg.documentMessage.fileName || msg.documentMessage.caption || '[Documento]';
                        if (messageData.base64) {
                            mediaUrl = `data:${msg.documentMessage.mimetype || 'application/pdf'};base64,${messageData.base64}`;
                        } else if (msg.documentMessage.url) {
                            mediaUrl = msg.documentMessage.url;
                        }
                    }
                }

                console.log('💬 textContent:', textContent)
                console.log('🖼️ mediaType:', mediaType)
                console.log('👤 pushName:', pushName)

                // Determinar sender (quem enviou)
                const isFromMe = messageData.key?.fromMe || false;
                const sender = isFromMe ? 'agent' : 'user';

                // Determinar timestamp (data real da mensagem ou agora)
                const messageTimestamp = messageData.messageTimestamp
                    ? new Date(Number(messageData.messageTimestamp) * 1000)
                    : new Date();

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
                                last_message_at: messageTimestamp.toISOString(), // TIMESTAMP REAL
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
                                name: pushName, // Aqui usamos o pushName ou 'Unknown'
                                last_message_at: messageTimestamp.toISOString(), // TIMESTAMP REAL
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

                    // 2. Se tiver texto ou mídia, inserir mensagem
                    if ((textContent || mediaUrl) && chatData?.id) {
                        const messagePayload = {
                            chat_id: chatData.id,
                            sender: sender,
                            text: textContent,
                            media_url: mediaUrl,
                            media_type: mediaType,
                            created_at: messageTimestamp.toISOString(),
                            provider_message_id: providerMessageId
                        };

                        let msgError = null;

                        // Se tiver provider_message_id, usar UPSERT para evitar duplicatas
                        if (providerMessageId) {
                            const { error } = await supabase
                                .from('messages')
                                .upsert(messagePayload, { onConflict: 'provider_message_id' })
                            msgError = error;
                        } else {
                            // Se não tiver ID (mensagem de sistema ou bot), usar INSERT simples
                            // Removemos provider_message_id do payload se for null/undefined para evitar erro de constraint
                            if (!messagePayload.provider_message_id) delete messagePayload.provider_message_id;

                            const { error } = await supabase
                                .from('messages')
                                .insert(messagePayload)
                            msgError = error;
                        }

                        if (msgError) console.error('❌ Msg save error:', msgError)
                        else console.log(`💾 Mensagem salva (${sender}):`, providerMessageId || 'NO-ID')
                    } else {
                        console.log('⚠️ Sem conteúdo para salvar (nem texto, nem mídia)')
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
