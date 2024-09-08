const algorithm = { name: "AES-GCM", length: 256 };

async function generateKey() {
  let storedKey = localStorage.getItem('aesKey');
  
  if (!storedKey) {
    const key = await crypto.subtle.generateKey(algorithm, true, ["encrypt", "decrypt"]);
    const exportedKey = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem('aesKey', JSON.stringify(exportedKey));
  }
}

async function getKey() {
  const storedKey = localStorage.getItem('aesKey');
  if (storedKey) {
    const importedKey = await crypto.subtle.importKey(
      'jwk',
      JSON.parse(storedKey),
      algorithm,
      true,
      ["encrypt", "decrypt"]
    );
    return importedKey;
  } else {
    throw new Error("Key not found in localStorage");
  }
}

async function encryptText() {
  const input = document.getElementById('inputText').value;
  if (!input) return;

  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const iv = crypto.getRandomValues(new Uint8Array(12));

  try {
    const key = await getKey();
    const encryptedData = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const encryptedArray = new Uint8Array(encryptedData);
    const result = btoa(String.fromCharCode(...iv, ...encryptedArray));
    document.getElementById('result').value = result;
  } catch (e) {
    document.getElementById('result').value = 'Encryption failed';
  }
  
  document.getElementById('inputText').value = '';
}

async function decryptText() {
  const input = document.getElementById('decryptInputText').value;
  if (!input) return;

  try {
    const encryptedArray = Uint8Array.from(atob(input), c => c.charCodeAt(0));
    const iv = encryptedArray.slice(0, 12);
    const data = encryptedArray.slice(12);

    const key = await getKey();
    const decryptedData = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      key,
      data
    );

    const decoder = new TextDecoder();
    const result = decoder.decode(decryptedData);
    document.getElementById('result').value = result;
  } catch (e) {
    document.getElementById('result').value = 'Decryption failed';
  }

  document.getElementById('decryptInputText').value = '';
}

function copyToClipboard() {
  const resultField = document.getElementById('result');
  if (!resultField.value) return;
  navigator.clipboard.writeText(resultField.value).then(function() {
    alert('Copied to clipboard: ' + resultField.value);
    resultField.value = '';
  });
}

function delayedRedirect() {
  const loadingMessage = document.getElementById('loadingMessage');
  loadingMessage.style.display = 'block'; // Show loading message
  setTimeout(function() {
    window.location.href = 'notes.html'; // URL of the second page
  }, 10000); // 10-second delay
}

document.getElementById('inputText').addEventListener('keydown', function(event) {
  if (event.key === "Enter") encryptText();
});

document.getElementById('decryptInputText').addEventListener('keydown', function(event) {
  if (event.key === "Enter") decryptText();
});

window.onload = generateKey;
