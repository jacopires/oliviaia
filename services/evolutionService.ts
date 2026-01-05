import { supabase } from './supabase';

const EVOLUTION_API_URL = import.meta.env.VITE_EVOLUTION_API_URL || 'https://pisomsales-evolution.cloudfy.live';
const EVOLUTION_API_KEY = import.meta.env.VITE_EVOLUTION_API_KEY || 'K9gxpvHgat4DteNDO8mgazC1lrW2ZKFv';

// Headers padrão para reutilização
const getHeaders = () => ({
    'apikey': EVOLUTION_API_KEY,
    'Content-Type': 'application/json'
});

/**
 * Envia mensagem de texto simples
 */
export const sendTextMessage = async (instanceName: string, remoteJid: string, text: string) => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) throw new Error("Credenciais da API ausentes");

    // Ajuste do remoteJid se necessário (Evolution geralmente aceita com ou sem sufixo, mas o DTO pede 'number')
    const body = {
        number: remoteJid,
        text: text,
        delay: 1200,
        linkPreview: true
    };

    const response = await fetch(`${EVOLUTION_API_URL}/message/sendText/${instanceName}`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro API: ${response.status}`);
    }

    return await response.json();
};

/**
 * Busca foto de perfil
 */
export const fetchProfilePicture = async (instanceName: string, remoteJid: string): Promise<string | null> => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) return null;

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfilePictureUrl/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ number: remoteJid })
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.profilePictureUrl || data.picture || data.url || null;
    } catch (error) {
        return null;
    }
};

/**
 * Busca nome do contato (PushName)
 */
export const fetchContactName = async (instanceName: string, remoteJid: string): Promise<string | null> => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) return null;

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/chat/fetchProfile/${instanceName}`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ number: remoteJid })
        });

        if (!response.ok) return null;
        const data = await response.json();
        return data.name || data.pushName || data.notify || data.verifiedName || null;
    } catch (error) {
        return null;
    }
};

/**
 * Atualiza Foto e tenta recuperar Nome Real
 */
export const updateChatProfile = async (instanceName: string, chatId: string, remoteJid: string): Promise<{ success: boolean, name?: string, avatar?: string }> => {
    const [avatarUrl, contactName] = await Promise.all([
        fetchProfilePicture(instanceName, remoteJid),
        fetchContactName(instanceName, remoteJid)
    ]);

    const updates: any = {};
    if (avatarUrl) updates.avatar_url = avatarUrl;

    // Só atualiza o nome se o usuário não tiver definido um manualmente (opcional, aqui forçamos a atualização para 'resetar')
    // Ou retornamos para o front decidir

    if (Object.keys(updates).length > 0) {
        await supabase.from('chats').update(updates).eq('id', chatId);
    }

    return {
        success: true,
        name: contactName || undefined,
        avatar: avatarUrl || undefined
    };
};

// ... (Mantenha o syncChatsFromEvolution igual ao arquivo original)
export const syncChatsFromEvolution = async (instanceName: string): Promise<number> => {
    if (!EVOLUTION_API_URL || !EVOLUTION_API_KEY) {
        throw new Error("Configurações da API Evolution ausentes.");
    }

    try {
        const response = await fetch(`${EVOLUTION_API_URL}/chat/findChats/${instanceName}`, {
            method: 'GET',
            headers: getHeaders()
        });

        if (!response.ok) {
            // Fallback para POST se o GET falhar (algumas versões da API)
            if (response.status === 404 || response.status === 405) {
                const resPost = await fetch(`${EVOLUTION_API_URL}/chat/findChats/${instanceName}`, {
                    method: 'POST',
                    headers: getHeaders(),
                    body: JSON.stringify({ where: {} })
                });
                if (!resPost.ok) throw new Error(`Erro ao buscar chats (POST): ${resPost.statusText}`);
                return await processChatsResponse(resPost, instanceName);
            }
            throw new Error(`Erro na API Evolution: ${response.status} ${response.statusText}`);
        }

        return await processChatsResponse(response, instanceName);

    } catch (error) {
        console.error("Sync Error:", error);
        throw error;
    }
};

async function processChatsResponse(response: Response, instanceName: string): Promise<number> {
    const data = await response.json();
    const chats = Array.isArray(data) ? data : (data.data || data.return || []);
    if (!Array.isArray(chats)) return 0;

    let count = 0;
    for (const chat of chats) {
        const remoteJid = chat.id || chat.remoteJid;
        if (!remoteJid || typeof remoteJid !== 'string' || !remoteJid.endsWith('@s.whatsapp.net')) continue;

        const phoneNumber = remoteJid.split('@')[0];
        // Nota: Não chamamos fetchContactName aqui para cada um para não estourar rate limit no loop
        // Usamos o que vem no payload inicial se tiver, ou o número
        const name = chat.name || chat.pushName || chat.verifiedName || phoneNumber;
        const avatarUrl = chat.profilePictureUrl || chat.profilePicThumb || null;

        const chatPayload = {
            whatsapp_id: remoteJid,
            name: name,
            avatar_url: avatarUrl,
            status: 'Novo Lead',
            last_message_at: new Date().toISOString()
        };

        const { error } = await supabase.from('chats').upsert(chatPayload, { onConflict: 'whatsapp_id' });
        if (!error) count++;
    }
    return count;
}