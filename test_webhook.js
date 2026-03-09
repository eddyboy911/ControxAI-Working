async function run() {
    const res = await fetch('https://dqwdgntcdmraczlcxilt.supabase.co/functions/v1/retell-webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            event: 'call_analyzed',
            data: {
                call_id: 'test_123',
                agent_id: 'agent_f9900d99628cad09475c36255b',
                cost: 0,
                start_timestamp: Date.now()
            }
        })
    });
    
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Body:", text);
}

run();
