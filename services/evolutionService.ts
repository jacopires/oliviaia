import { supabase } from './supabase';

// Sanitização Automática: Remove barra no final da URL se houver
const RAW_URL = import.meta.env.VITE_EVOLUTION_API_URL || '';
const EVOLUTION_API_URL = RAW_URL.replace(/\/$/, ''); 
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY;

const getHeaders = () => ({
  'apikey': EVOLUTION_API_KEY,
  'Content-Type': 'application/json'
});

/**
 * Envia mensagem de texto (BLINDADO)
 */
export const sendTextMessage = async (instanceName: string, remoteJid: string, text: string) => {
  if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
    console.error("❌ ERRO CRÍTICO: Credenciais .env ausentes!");
    throw new Error("Configuração .env incompleta");
  }

  // Garante formato do número
  const cleanJid = remoteJid.includes('@') ? remoteJid : `${remoteJid}@s.whatsapp.net`;
  
  const url = `${EVOLUTION_API_URL}/message/sendText/${instanceName}`;
  const body = {
    number: cleanJid,
    text: text,
    delay: 1200,
    linkPreview: true
  };

  console.log(`🚀 [Evolution] Enviando para: ${url}`);
  console.log(`📦 [Evolution] Payload:`, body);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ [Evolution] Erro API (${response.status}):`, errorText);
      throw new Error(`Erro API ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log(`✅ [Evolution] Sucesso:`, data);
    return data;
  } catch (error: any) {
    console.error(`❌ [Evolution] Falha na requisição:`, error);
    throw error;
  }
};

/**
 * Atualiza Perfil (Nome + Foto)
 */
export const updateChatProfile = async (instanceName: string, chatId: string, remoteJid: string) => {
    if (!EVOLUTION_API_URL) return { success: false };

    try {
        console.log(`🔄 [Evolution] Buscando perfil para: ${remoteJid}`);
        
        // 1. Busca Foto
        const resPic = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfilePictureUrl/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ number: remoteJid })
        });
        const dataPic = await resPic.json().catch(() => ({}));
        const avatarUrl = dataPic.profilePictureUrl || dataPic.url || null;

        // 2. Busca Nome
        const resName = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfile/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ number: remoteJid })
        });
        const dataName = await resName.json().catch(() => ({}));
        const name = dataName.name || dataName.pushName || dataName.notify || null;

        // 3. Atualiza Banco
        const updates: any = {};
        if (avatarUrl) updates.avatar_url = avatarUrl;
        
        if (Object.keys(updates).length > 0) {
            await supabase.from('chats').update(updates).eq('id', chatId);
        }

        return { success: true, name, avatar: avatarUrl };
    } catch (error) {
        console.error("Erro ao atualizar perfil:", error);
        return { success: false };
    }
};

/**
 * Sincronização Server-Side
 */
export const syncChatsFromEvolution = async (instanceName: string): Promise<number> => {
    // Mantém compatibilidade com código anterior, mas logs adicionados
    console.log("🔄 Iniciando sincronização...");
    const url = `${EVOLUTION_API_URL}/chat/findChats/${instanceName}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: getHeaders()
    });

    if (!response.ok) {
        // Fallback POST se GET falhar
        const resPost = await fetch(url, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ where: {} })
        });
        if (!resPost.ok) throw new Error(`Erro Sync: ${resPost.status}`);
        return await processChatsResponse(resPost);
    }

    return await processChatsResponse(response);
};

async function processChatsResponse(response: Response): Promise<number> {
    const data = await response.json();
    const chats = Array.isArray(data) ? data : (data.data || []);
    let count = 0;

    for (const chat of chats) {
        const remoteJid = chat.id || chat.remoteJid;
        if (!remoteJid || !remoteJid.includes('@')) continue;

        const { error } = await supabase.from('chats').upsert({
            whatsapp_id: remoteJid,
            name: chat.name || chat.pushName || remoteJid.split('@')[0],
            avatar_url: chat.profilePictureUrl || null,
            last_message_at: new Date().toISOString()
        }, { onConflict: 'whatsapp_id' });

        if (!error) count++;
    }
    return count;
}