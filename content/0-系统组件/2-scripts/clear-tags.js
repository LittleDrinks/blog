// archive-quartz.js - 批量归档老文件到 Quartz 4 格式（严格顺序控制）
async function archiveToQuartz() {
    // ==================== 配置区 ====================
    const targetFolder = "CS";  // 修改为你的文件夹名
    const desiredOrder = ['title', 'description', 'tags', 'aliases', 'date', 'publish'];
    const dateFormat = "YYYY-MM-DDTHH:mm:ss";
    // ================================================
    
    const files = app.vault.getMarkdownFiles()
        .filter(f => f.path.startsWith(targetFolder + "/"));
    
    let processed = 0;
    let errorCount = 0;
    
    for (const file of files) {
        try {
            // 获取文件创建时间
            const stat = await app.vault.adapter.stat(file.path);
            const creationDate = moment(stat.ctime).format(dateFormat);
            
            // 读取完整内容
            const content = await app.vault.read(file);
            
            // 分离 frontmatter 和正文
            const fmMatch = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
            const body = fmMatch ? fmMatch[2] : content;
            const existingYaml = fmMatch ? fmMatch[1] : '';
            
            // 解析现有 frontmatter（简单解析，保留已有值）
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
                        fm[key] = []; // 假设为空数组开始
                    } else if (val === 'true') fm[key] = true;
                    else if (val === 'false') fm[key] = false;
                    else if (!isNaN(val) && val !== '') fm[key] = Number(val);
                    else {
                        // 去除引号
                        fm[key] = val.replace(/^["'](.*)["']$/, '$1');
                    }
                }
            }
            
            // 按 desiredOrder 构建新的 frontmatter 对象
            const newFm = {};
            
            // title: 保留已有，无则用文件名
            newFm.title = fm.title || file.basename;
            
            // description: 保留或空字符串
            newFm.description = fm.description || "";
            
            // tags: 强制清空为空数组（你的需求）
            newFm.tags = [];
            
            // aliases: 保留或空数组
            newFm.aliases = Array.isArray(fm.aliases) ? fm.aliases : [];
            
            // date: 文件创建时间
            newFm.date = creationDate;
            
            // publish: 强制 true
            newFm.publish = true;
            
            // 构建 YAML 字符串（严格按顺序）
            const yamlLines = ['---'];
            
            for (const key of desiredOrder) {
                const value = newFm[key];
                
                if (Array.isArray(value)) {
                    yamlLines.push(`${key}:`);
                    if (value.length === 0) {
                        yamlLines.push(`  []`);
                    } else {
                        for (const item of value) {
                            yamlLines.push(`  - ${item}`);
                        }
                    }
                } else if (typeof value === 'string') {
                    // 如果包含特殊字符，加引号转义
                    if (value.includes(':') || value.includes('"') || value.includes('#') || value.includes('\n')) {
                        yamlLines.push(`${key}: "${value.replace(/"/g, '\\"')}"`);
                    } else {
                        yamlLines.push(`${key}: ${value}`);
                    }
                } else {
                    yamlLines.push(`${key}: ${value}`);
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
    
    new Notice(`✅ 已归档 ${processed} 个文件${errorCount > 0 ? ` | ❌ ${errorCount} 个失败` : ''}`, 6000);
}

// 执行
archiveToQuartz();