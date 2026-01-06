# Configuração do Webhook - Evolution API + Supabase

## 1. Deploy da Edge Function

```bash
# Na pasta do projeto
supabase functions deploy evolution-webhook
```

## 2. Obter a URL do Webhook

Após o deploy, sua URL será:
```
https://<seu-projeto>.supabase.co/functions/v1/evolution-webhook
```

## 3. Configurar Webhook na Evolution API

Acesse a Evolution API e configure o webhook para sua instância:

### Via API:
```bash
curl -X POST "https://sua-evolution-api/webhook/set/SUA_INSTANCIA" \
  -H "apikey: SUA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "webhook": {
      "enabled": true,
      "url": "https://seu-projeto.supabase.co/functions/v1/evolution-webhook",
      "events": ["messages.upsert", "connection.update"]
    }
  }'
```

### Via Painel Evolution:
1. Acesse o Dashboard da Evolution API
2. Vá em **Configurations** > **Webhooks**
3. Ative o webhook
4. Cole a URL do Supabase
5. Selecione os eventos: `messages.upsert`, `connection.update`

## 4. Eventos Suportados

| Evento | Descrição |
|--------|-----------|
| `messages.upsert` | Mensagem recebida/enviada |
| `connection.update` | Status da conexão |

## 5. Como Funciona

1. **Mensagem Recebida** → Evolution envia webhook → Edge Function processa
2. **Edge Function** → Cria/atualiza chat + insere mensagem no Supabase
3. **Realtime** → Frontend recebe atualização via Supabase Realtime
4. **UI** → Chat aparece automaticamente na lista

## 6. Testando

Envie uma mensagem para o WhatsApp conectado. O chat deve aparecer automaticamente na lista de conversas.

## 7. Logs

Para ver os logs da Edge Function:
```bash
supabase functions logs evolution-webhook
```
