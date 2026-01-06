// Supabase Edge Function - Evolution Webhook Handler (DEBUG VERSION)
// This version logs EVERYTHING and tries to save any message

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const payload = await req.json()

        // DEBUG: Log EVERYTHING
        console.log('=================================')
        console.log('📦 FULL PAYLOAD RECEIVED:')
        console.log(JSON.stringify(payload, null, 2))
        console.log('=================================')

        // Try to extract event from multiple possible locations
        const event = (payload.event || payload.action || payload.type || 'unknown').toString().toLowerCase()
        console.log(`🎯 Detected event: ${event}`)

        // Try to find message data in ANY location
        let messageData = null
        let remoteJid = null
        let textContent = ''
        let pushName = ''
        let isFromMe = false

        // Strategy 1: payload.data.message (Evolution v2 standard)
        if (payload.data?.message) {
            messageData = payload.data.message
            console.log('📍 Found message at: payload.data.message')
        }
        // Strategy 2: payload.data array (some versions send array)
        else if (Array.isArray(payload.data) && payload.data.length > 0) {
            messageData = payload.data[0]
            console.log('📍 Found message at: payload.data[0]')
        }
        // Strategy 3: payload.message direct
        else if (payload.message) {
            messageData = payload.message
            console.log('📍 Found message at: payload.message')
        }
        // Strategy 4: payload.data direct (if it has key)
        else if (payload.data?.key) {
            messageData = payload.data
            console.log('📍 Found message at: payload.data (has key)')
        }

        if (messageData) {
            console.log('📨 Message data:', JSON.stringify(messageData, null, 2))

            // Extract remoteJid
            remoteJid = messageData.key?.remoteJid || messageData.remoteJid || messageData.from || null
            console.log(`📞 RemoteJid: ${remoteJid}`)

            // Skip groups
            if (remoteJid && (remoteJid.includes('@g.us') || remoteJid.includes('@broadcast'))) {
                console.log(`⏭️ Skipping group: ${remoteJid}`)
                return new Response(JSON.stringify({ received: true, skipped: 'group' }), { headers: corsHeaders })
            }

            // Extract text
            if (typeof messageData.message === 'string') {
                textContent = messageData.message
            } else if (messageData.message) {
                textContent = messageData.message.conversation ||
                    messageData.message.extendedTextMessage?.text ||
                    messageData.message.imageMessage?.caption ||
                    ''
            } else if (messageData.content) {
                textContent = messageData.content
            } else if (messageData.text) {
                textContent = messageData.text
            }
            console.log(`💬 Text content: "${textContent}"`)

            // Extract sender info
            pushName = messageData.pushName || messageData.key?.participant || (remoteJid ? remoteJid.split('@')[0] : 'Unknown')
            isFromMe = messageData.key?.fromMe || messageData.fromMe || false
            console.log(`👤 PushName: ${pushName}, FromMe: ${isFromMe}`)

            // --- SAVE TO DATABASE ---
            if (remoteJid) {
                console.log('💾 Attempting to save to database...')

                // 1. Upsert chat
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
                    console.error('❌ Chat upsert error:', chatError)
                    return new Response(JSON.stringify({ error: 'chat_upsert_failed', details: chatError }), {
                        status: 500, headers: corsHeaders
                    })
                }

                console.log(`✅ Chat saved/updated: ${chatData?.id}`)

                // 2. Insert message
                if (textContent && chatData?.id) {
                    const { error: msgError } = await supabase
                        .from('messages')
                        .insert({
                            chat_id: chatData.id,
                            sender: isFromMe ? 'agent' : 'user',
                            text: textContent,
                            created_at: new Date().toISOString()
                        })

                    if (msgError) {
                        console.error('❌ Message insert error:', msgError)
                    } else {
                        console.log('✅ Message saved!')
                    }
                }

                return new Response(JSON.stringify({
                    received: true,
                    saved: true,
                    chatId: chatData?.id,
                    hasText: !!textContent
                }), { headers: corsHeaders })
            }
        } else {
            console.log('⚠️ No message data found in payload')
        }

        // If we get here, we received something but couldn't process it
        return new Response(JSON.stringify({
            received: true,
            processed: false,
            event: event,
            reason: 'no_message_data_found'
        }), { headers: corsHeaders })

    } catch (error) {
        console.error('❌ Webhook error:', error)
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500, headers: corsHeaders
        })
    }
})
