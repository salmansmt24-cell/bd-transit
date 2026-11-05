import {randomBytes,scryptSync} from 'node:crypto';
import {createInterface} from 'node:readline';
const rl=createInterface({input:process.stdin,output:process.stdout});
rl.question('Choose a strong admin password: ',password=>{rl.close();if(password.length<12){console.error('Use at least 12 characters');process.exitCode=1;return}const salt=randomBytes(16).toString('hex');console.log('ADMIN_PASSWORD_HASH='+salt+':'+scryptSync(password,salt,32).toString('hex'));console.log('ADMIN_SESSION_SECRET='+randomBytes(32).toString('hex'))});
