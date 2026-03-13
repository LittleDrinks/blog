// archive-quartz-fixed.js - 强制类型控制版本
async function archiveToQuartz() {
    // ==================== 配置区 ====================
    const targetFolder = "CS";
    const desiredOrder = ['title', 'description', 'tags', 'aliases', 'date', 'publish'];
    const dateFormat = "YYYY-MM-DDTHH:mm:ss";
    
    // 关键：显式定义每个字段的 YAML 类型
    const fieldTypes = {
        title: 'string',      // 强制字符串（加引号）
        description: 'string',// 强制字符串（加引号，避免数字化）
        tags: 'array',        // 强制数组
        aliases: 'array',     // 强制数组  
        date: 'datetime',     // 强制日期时间（无引号，ISO格式）
        publish: 'boolean'    // 强制布尔值（true/false 无引号）
    };
    // ================================================
    
    const files = app.vault.getMarkdownFiles()
        .filter(f => f.path.startsWith(targetFolder + "/"));
    
    let processed = 0;
    let errorCount = 0;
    
    for (const file of files) {
        try {
            const stat = await app.vault.adapter.stat(file.path);
            const creationDate = moment(stat.ctime).format(dateFormat);
            
            const content = await app.vault.read(file);
            
            // 分离 frontmatter 和正文
            const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
            const body = fmMatch ? fmMatch[2] : content;
            const existingYaml = fmMatch ? fmMatch[1] : '';
            
            // 解析现有 frontmatter
            const fm = {};
            const lines = existingYaml.split('\n');
            let currentKey = null;
            
            for (let line of lines) {
                const trimmed = line.trim();
                if (trimmed === '' || trimmed.startsWith('#')) continue;
                
                if (trimmed.startsWith('- ')) {
                    if (!fm[currentKey]) fm[currentKey] = [];
                    fm[currentKey].push(trimmed.slice(2).trim());
                } else if (trimmed.includes(':')) {
                    const idx = trimmed.indexOf(':');
                    const key = trimmed.slice(0, idx).trim();
                    const val = trimmed.slice(idx + 1).trim();
                    currentKey = key;
                    
                    if (val === '') {
                        fm[key] = [];
                    } else if (val === 'true') fm[key] = true;
                    else if (val === 'false') fm[key] = false;
                    else {
                        // 保留原始字符串值（去除引号）
                        fm[key] = val.replace(/^["'](.*)["']$/, '$1');
                    }
                }
            }
            
            // 构建新的 frontmatter（带类型安全）
            const newFm = {
                title: fm.title || file.basename,
                description: "",
                tags: [],  // 强制清空
                aliases: Array.isArray(fm.aliases) ? fm.aliases : [],
                date: creationDate,  // 已经是字符串格式
                publish: true        // 强制布尔值
            };
            
            // 构建 YAML 字符串（严格按类型格式化）
            const yamlLines = ['---'];
            
            for (const key of desiredOrder) {
                const value = newFm[key];
                const type = fieldTypes[key] || 'string';
                
                switch(type) {
                    case 'array':
                        yamlLines.push(`${key}:`);
                        if (value.length === 0) {
                            yamlLines.push(`  []`);
                        } else {
                            for (const item of value) {
                                yamlLines.push(`  - ${item}`);
                            }
                        }
                        break;
                        
                    case 'boolean':
                        // 布尔值不加引号：true / false
                        yamlLines.push(`${key}: ${value}`);
                        break;
                        
                    case 'datetime':
                        // 日期时间不加引号，保持 ISO 格式
                        yamlLines.push(`${key}: ${value}`);
                        break;
                        
                    case 'string':
                    default:
                        // 字符串强制加双引号，防止被解析为数字/布尔值
                        const strVal = String(value).replace(/"/g, '\\"');
                        yamlLines.push(`${key}: "${strVal}"`);
                        break;
                }
            }
            
            yamlLines.push('---');
            
            // 写回文件
            const newContent = yamlLines.join('\n') + '\n' + body;
            await app.vault.modify(file, newContent);
            processed++;
            
        } catch (error) {
            console.error(`处理失败 ${file.path}:`, error);
            errorCount++;
        }
    }
    
    new Notice(`✅ 已重建 ${processed} 个文件${errorCount > 0 ? ` | ❌ ${errorCount} 个失败` : ''}`, 6000);
}

// 执行
archiveToQuartz();