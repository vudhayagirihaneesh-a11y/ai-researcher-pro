const net = require('net'); 
const client = new net.Socket(); 
client.connect(6543, 'aws-0-ap-southeast-1.pooler.supabase.com', () => { 
  console.log('Connected!'); 
  client.destroy(); 
}); 
client.on('error', (err) => console.log('Error:', err.message));
