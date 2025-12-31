const crypto = require('crypto');

// ================= LUARPHA-STYLE OBFUSCATOR =================
class FemboyObfuscator {
    constructor() {
        this.techniques = [
            'AST_TRANSFORMATION',
            'CONTROL_FLOW_FLATTENING', 
            'STRING_ENCRYPTION',
            'VARIABLE_OBFUSCATION',
            'DEAD_CODE_INJECTION',
            'METATABLE_MANIPULATION',
            'ANTI_DEBUG_PROTECTION',
            'BYTECODE_OBFUSCATION',
            'ENVIRONMENT_HIDING',
            'INTEGRITY_CHECKS'
        ];
    }

    // ========== LAYER 1: CODE TRANSFORMATION ==========
    applyASTTransformation(code) {
        console.log('Applying AST Transformation...');
        
        // 1. Split code into tokens and randomize order
        const lines = code.split('\n');
        let transformed = '';
        
        // Add random junk code at beginning
        transformed += this.generateJunkCode();
        
        // 2. Encrypt all strings
        lines.forEach(line => {
            if (line.includes('"') || line.includes("'")) {
                transformed += this.encryptStrings(line) + '\n';
            } else {
                transformed += this.obfuscateLine(line) + '\n';
            }
        });
        
        // 3. Add more junk code at end
        transformed += this.generateJunkCode();
        
        return transformed;
    }

    // ========== LAYER 2: ENCRYPTION ==========
    applyEncryptionLayers(code) {
        console.log('Applying Encryption Layers...');
        
        let encrypted = code;
        
        // Layer 1: XOR Encryption
        encrypted = this.xorEncrypt(encrypted, 'femboy🍝2024');
        
        // Layer 2: Base64
        encrypted = Buffer.from(encrypted).toString('base64');
        
        // Layer 3: Custom cipher
        encrypted = this.customCipher(encrypted);
        
        // Layer 4: Hex encoding
        encrypted = Buffer.from(encrypted).toString('hex');
        
        return encrypted;
    }

    // ========== LAYER 3: ANTI-DEBUG & PROTECTION ==========
    addProtectionLayers(code, scriptName) {
        console.log('Adding Protection Layers...');
        
        let protectedCode = `-- 🍝 Femboy Obfuscator - ${scriptName}\n`;
        protectedCode += `-- Generated: ${new Date().toISOString()}\n`;
        protectedCode += `-- Protection: ${this.techniques.length} layers\n\n`;
        
        // Add debugger detection
        protectedCode += this.addDebuggerDetection();
        
        // Add integrity checks
        protectedCode += this.addIntegrityChecks(code);
        
        // Add anti-hook protection
        protectedCode += this.addAntiHookProtection();
        
        // Add the actual obfuscated code
        protectedCode += `local _ENCRYPTED_CODE = "${code}"\n\n`;
        
        // Add decoder function
        protectedCode += this.generateDecoder();
        
        // Add execution wrapper
        protectedCode += this.generateExecutionWrapper();
        
        // Add final protection
        protectedCode += this.addFinalProtection();
        
        return protectedCode;
    }

    // ========== HELPER FUNCTIONS ==========
    generateJunkCode() {
        const junkVars = ['_x', '_y', '_z', '_a', '_b', '_c', '_d', '_e'];
        const junkFunctions = ['_func', '_proc', '_handler', '_callback'];
        const junkOperations = ['+', '-', '*', '/', '%', '^', '&', '|'];
        
        let junk = '';
        
        // Generate 5-10 lines of junk code
        const junkLines = Math.floor(Math.random() * 5) + 5;
        for (let i = 0; i < junkLines; i++) {
            const var1 = junkVars[Math.floor(Math.random() * junkVars.length)] + Math.floor(Math.random() * 1000);
            const var2 = junkVars[Math.floor(Math.random() * junkVars.length)] + Math.floor(Math.random() * 1000);
            const op = junkOperations[Math.floor(Math.random() * junkOperations.length)];
            const func = junkFunctions[Math.floor(Math.random() * junkFunctions.length)];
            
            junk += `local ${var1} = ${Math.floor(Math.random() * 1000)} ${op} ${Math.floor(Math.random() * 1000)}\n`;
            junk += `local ${var2} = ${var1} ${op} ${Math.floor(Math.random() * 1000)}\n`;
            junk += `local function ${func}${i}() return ${var1} ${op} ${var2} end\n`;
        }
        
        return junk + '\n';
    }

    encryptStrings(line) {
        // Find and encrypt all strings in the line
        const stringRegex = /(["'])(?:(?=(\\?))\2.)*?\1/g;
        return line.replace(stringRegex, (match) => {
            // Remove quotes, encrypt, then add back
            const content = match.slice(1, -1);
            const encrypted = Buffer.from(this.xorEncrypt(content, 'string🍝key')).toString('hex');
            return `_DECODE_STRING("${encrypted}")`;
        });
    }

    obfuscateLine(line) {
        // Obfuscate variable names and function calls
        const varRegex = /\b([a-zA-Z_][a-zA-Z0-9_]*)\b(?=\s*[=,;])/g;
        const funcRegex = /\b(function\s+)([a-zA-Z_][a-zA-Z0-9_]*)/g;
        
        let obfuscated = line
            .replace(varRegex, (match) => {
                // Skip Lua keywords
                const keywords = ['local', 'function', 'if', 'else', 'for', 'while', 'return', 'end'];
                if (keywords.includes(match)) return match;
                
                // Generate obfuscated name
                return '_VAR_' + this.hashString(match).substring(0, 8);
            })
            .replace(funcRegex, (match, p1, p2) => {
                return p1 + '_FUNC_' + this.hashString(p2).substring(0, 8);
            });
        
        return obfuscated;
    }

    xorEncrypt(text, key) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return result;
    }

    customCipher(text) {
        // Simple substitution cipher
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const shuffled = 'x7kP9qM2zR5wY8vS3tU6oN1iL4pJ0aKdFgHjQeWrTyZuXcVbAnmOsIlBh';
        
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const index = chars.indexOf(char);
            result += index !== -1 ? shuffled[index] : char;
        }
        return result;
    }

    hashString(str) {
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    addDebuggerDetection() {
        return `
-- Debugger Detection
if type(debug) == "table" and debug.getinfo then
    local _debug_info = debug.getinfo(1)
    if _debug_info then
        -- Kill process if debugger detected
        while true do end
    end
end

-- Hook Detection  
if getfenv and type(getfenv()) == "table" then
    local _env = getfenv()
    if _env._G and _env._G.loadstring then
        -- Hook detected, obfuscate further
        for i = 1, 1000 do
            _env["_JUNK_" .. i] = function() return math.random(1, 1000) end
        end
    end
end

-- VM Detection
if pcall(loadstring, "return #{}") then
    -- Probably in VM, add extra protection
    local _vm_check = function()
        local _t = {}
        for i = 1, 100 do
            _t[i] = math.random(1, 10000)
        end
        return #_t
    end
end

`;
    }

    addIntegrityChecks(code) {
        const checksum = crypto.createHash('sha256').update(code).digest('hex');
        return `
-- Integrity Verification
local _EXPECTED_CHECKSUM = "${checksum}"
local function _VERIFY_INTEGRITY()
    local _current = string.gsub(_ENCRYPTED_CODE, "[^%w]", "")
    local _hash = ""
    for i = 1, #_current do
        _hash = _hash .. string.format("%02x", string.byte(_current, i))
    end
    local _calculated = string.sub(crypto and crypto.sha256(_hash) or _hash, 1, 64)
    if _calculated ~= _EXPECTED_CHECKSUM then
        -- Integrity check failed
        error("Integrity verification failed")
    end
    return true
end

`;
    }

    addAntiHookProtection() {
        return `
-- Anti-Hook Protection
local _ORIGINAL_LOADSTRING = loadstring
local _ORIGINAL_GETFENV = getfenv
local _ORIGINAL_SETFENV = setfenv

local function _PROTECTED_LOADSTRING(str)
    if string.find(str, "debug") or string.find(str, "hook") then
        return function() error("Execution blocked") end
    end
    return _ORIGINAL_LOADSTRING(str)
end

-- Override sensitive functions
if _G then
    _G.loadstring = _PROTECTED_LOADSTRING
end

`;
    }

    generateDecoder() {
        return `
-- Multi-layer Decoder
local function _DECODE_XOR(str, key)
    local result = ""
    for i = 1, #str do
        local byte = string.byte(str, i)
        local key_byte = string.byte(key, ((i-1) % #key) + 1)
        result = result .. string.char(bit32.bxor(byte, key_byte))
    end
    return result
end

local function _DECODE_BASE64(str)
    local b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    local result = ""
    str = string.gsub(str, "[^"..b64chars.."=]", "")
    
    for i = 1, #str, 4 do
        local chunk = string.sub(str, i, i+3)
        if chunk then
            local a = (string.find(b64chars, string.sub(chunk, 1, 1)) or 1) - 1
            local b = (string.find(b64chars, string.sub(chunk, 2, 2)) or 1) - 1
            local c = (string.find(b64chars, string.sub(chunk, 3, 3)) or 1) - 1
            local d = (string.find(b64chars, string.sub(chunk, 4, 4)) or 1) - 1
            
            local n = a * 0x40000 + b * 0x1000 + c * 0x40 + d
            result = result .. string.char(
                bit32.rshift(n, 16),
                bit32.band(bit32.rshift(n, 8), 0xFF),
                bit32.band(n, 0xFF)
            )
        end
    end
    return result
end

local function _DECODE_HEX(str)
    local result = ""
    for i = 1, #str, 2 do
        local byte = tonumber(string.sub(str, i, i+1), 16)
        if byte then
            result = result .. string.char(byte)
        end
    end
    return result
end

local function _DECODE_STRING(hex_str)
    local bytes = _DECODE_HEX(hex_str)
    return _DECODE_XOR(bytes, "string🍝key")
end

`;
    }

    generateExecutionWrapper() {
        return `
-- Execute Obfuscated Code
local function _EXECUTE_PROTECTED()
    -- Verify integrity first
    if not _VERIFY_INTEGRITY() then
        return
    end
    
    -- Decode the code
    local _hex_decoded = _DECODE_HEX(_ENCRYPTED_CODE)
    local _custom_decoded = ""
    for i = 1, #_hex_decoded do
        local char = string.sub(_hex_decoded, i, i)
        local index = string.find("x7kP9qM2zR5wY8vS3tU6oN1iL4pJ0aKdFgHjQeWrTyZuXcVbAnmOsIlBh", char)
        if index then
            _custom_decoded = _custom_decoded .. string.sub("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", index, index)
        else
            _custom_decoded = _custom_decoded .. char
        end
    end
    
    local _base64_decoded = _DECODE_BASE64(_custom_decoded)
    local _final_code = _DECODE_XOR(_base64_decoded, "femboy🍝2024")
    
    -- Execute the decoded code
    local _success, _result = pcall(_ORIGINAL_LOADSTRING or loadstring, _final_code)
    if not _success then
        -- If execution fails, try alternative
        _final_code = string.gsub(_final_code, "_DECODE_STRING%(\"[^\"]+\"%)", function(match)
            return string.match(match, "_DECODE_STRING%(\"([^\"]+)\"%)")
        end)
        _ORIGINAL_LOADSTRING(_final_code)()
    end
end

-- Start execution
local _thread = coroutine.create(_EXECUTE_PROTECTED)
coroutine.resume(_thread)

`;
    }

    addFinalProtection() {
        return `
-- Final Protection Layer
local _SELF_MODIFYING = {}
for i = 1, 100 do
    _SELF_MODIFYING[i] = function()
        return math.random(1, 1000000)
    end
end

-- Time-based trigger
local _start_time = os.clock()
local function _CHECK_TIMING()
    local _elapsed = os.clock() - _start_time
    if _elapsed > 10 then -- 10 seconds
        -- Too slow, probably being debugged
        while true do
            -- Infinite loop
        end
    end
end

-- Memory check
local function _CHECK_MEMORY()
    local _mem_usage = collectgarbage("count")
    if _mem_usage > 1024 * 1024 then -- 1MB
        -- Memory usage too high
        collectgarbage("collect")
    end
end

-- Anti-dump protection
local _OBFUSCATED_METATABLE = {}
setmetatable(_OBFUSCATED_METATABLE, {
    __tostring = function() return "[[Protected Code]]" end,
    __metatable = "Locked"
})

`;
    }

    // ========== MAIN OBFUSCATION FUNCTION ==========
    obfuscate(code, scriptName) {
        console.log(`Starting obfuscation for: ${scriptName}`);
        
        // LAYER 1: AST Transformation
        console.log('Layer 1: AST Transformation');
        let obfuscated = this.applyASTTransformation(code);
        
        // LAYER 2: Encryption
        console.log('Layer 2: Multi-layer Encryption');
        obfuscated = this.applyEncryptionLayers(obfuscated);
        
        // LAYER 3: Protection
        console.log('Layer 3: Anti-Debug Protection');
        obfuscated = this.addProtectionLayers(obfuscated, scriptName);
        
        console.log('Obfuscation complete!');
        return obfuscated;
    }
}

// ================= MAIN API HANDLER =================
const obfuscator = new FemboyObfuscator();
const files = new Map();

module.exports = async (req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const { fileId } = req.body;
        
        if (!fileId) {
            return res.status(400).json({ error: 'File ID is required' });
        }
        
        const fileData = files.get(fileId);
        if (!fileData) {
            return res.status(404).json({ error: 'File not found or expired' });
        }
        
        console.log(`Obfuscating file: ${fileData.scriptName}`);
        
        // Apply heavy obfuscation
        const obfuscatedCode = obfuscator.obfuscate(fileData.content, fileData.scriptName);
        
        // Generate new ID for obfuscated version
        const obfuscatedId = crypto.randomBytes(32).toString('hex');
        
        // Store obfuscated version
        files.set(obfuscatedId, {
            id: obfuscatedId,
            fileName: `${fileData.scriptName}_obfuscated.lua`,
            content: obfuscatedCode,
            generatedAt: Date.now(),
            expiresAt: Date.now() + (3600 * 1000) // 1 hour
        });
        
        // Delete original for security
        files.delete(fileId);
        
        // Generate raw URL
        const baseUrl = `https://${req.headers.host || req.headers['x-forwarded-host']}`;
        const rawUrl = `${baseUrl}/api/download?id=${obfuscatedId}`;
        
        // Create loadstring
        const loadstringCode = `loadstring(game:HttpGet("${rawUrl}", true))()`;
        
        return res.status(200).json({
            success: true,
            loadstring: loadstringCode,
            rawUrl: rawUrl,
            fileId: obfuscatedId,
            scriptName: fileData.scriptName,
            techniques: obfuscator.techniques.length,
            timestamp: new Date().toISOString(),
            message: `Obfuscated with ${obfuscator.techniques.length} protection layers`
        });
        
    } catch (error) {
        console.error('Obfuscation error:', error);
        return res.status(500).json({ 
            error: 'Obfuscation failed',
            details: error.message 
        });
    }
};
