import ffi from 'ffi-napi';
import path from 'path';
import { fileURLToPath } from 'url';
import { promises as fs } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use the correct DLL path
const dllPath = path.join(__dirname, '../EncryptDecrypt.dll');
console.log(`DLL Path: ${dllPath}`);

let decryptText;

const loadDecryptModule = async () => {
  try {
    // Check if DLL file exists
    await fs.access(dllPath);
    console.log('DLL file exists.');

    // Load the DLL
    const jitSecurityDll = ffi.Library(dllPath, {
      'DecryptText': ['string', ['string']],
      'Decrypt': ['string', ['string', 'string']]
    });

    // Validate that function is loaded
    if (typeof jitSecurityDll.DecryptText === 'function') {
      decryptText = jitSecurityDll.DecryptText;
      console.log('DecryptText function loaded successfully.');

      // Test the DecryptText function
      const decrypted = decryptText('some encrypted text');
      console.log('Decrypted Text:', decrypted);
    } else {
      throw new Error('DecryptText function is not available in the DLL.');
    }
  } catch (error) {
    console.error('Error loading DLL:', error.message);
  }
};

// Initialize module
await loadDecryptModule();

export { decryptText };
